const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { readConfig, extractSkillName, validateConfig } = require('../core/config-reader');
const { getEnabledTargets, filterTargets } = require('../core/target-detector');
const { detectContext, resolvePath, getSkillsBaseDir } = require('../core/path-resolver');
const { copySkillFiles, removeDirectory } = require('../core/file-copier');
const { updateManifest } = require('../core/manifest-manager');
const { getLogger } = require('../utils/logger');

/**
 * Install skill to configured targets
 * @param {object} options - Command options from CLI
 */
async function install(options) {
  const logger = getLogger();

  logger.section('🚀 Installing AI Coding Skill...');
  logger.newline();

  try {
    // Read and validate configuration
    const config = readConfig(options.config);
    validateConfig(config);

    const skillName = extractSkillName(config.name);
    const packageName = config.package || config.name;

    // Detect installation context
    const context = detectContext();
    logger.debug(`Installation context: ${context.isGlobal ? 'global' : 'project-level'}`);
    logger.debug(`Package root: ${context.packageRoot}`);

    // Get enabled targets
    let targets = getEnabledTargets(config);

    // Filter by target option if specified
    if (options.target) {
      targets = filterTargets(targets, options.target);
      if (targets.length === 0) {
        logger.error(`No matching targets found for: ${options.target}`);
        process.exit(1);
      }
    }

    logger.info(`Installing skill "${skillName}" to ${targets.length} target(s):`);
    targets.forEach(target => {
      logger.info(`  • ${target.name}`);
    });
    logger.newline();

    const installedPaths = [];

    // Install to each target
    for (const target of targets) {
      try {
        logger.section(`📦 Installing to ${target.name}...`);

        const installPath = resolvePath(target, skillName, context);
        const altInstallPath = resolvePath(target, packageName, context);

        logger.info(`  Type: ${context.isGlobal ? 'personal' : 'project'}`);
        logger.info(`  Directory: ${installPath}`);

        // Check if already installed (unless force)
        if (!options.force && fs.existsSync(installPath)) {
          logger.warn(`  Skill already installed. Use --force to reinstall.`);
          continue;
        }

        // Dry run mode
        if (options.dryRun) {
          logger.info(chalk.cyan('  [DRY RUN] Would perform the following:'));
          logger.info(`  - Create directory: ${installPath}`);
          logger.info(`  - Copy SKILL.md`);
          logger.info(`  - Auto-detect and copy: scripts/, references/, assets/`);
          logger.info(`  - Update manifest`);
          continue;
        }

        // Clean up alternative path format (for compatibility)
        if (fs.existsSync(altInstallPath) && altInstallPath !== installPath) {
          logger.debug('Cleaning up alternative path format...');
          removeDirectory(altInstallPath);
        }

        // Copy skill files
        const copiedFiles = copySkillFiles(
          context.packageRoot,
          installPath,
          config,
          logger
        );

        logger.success(`Copied ${copiedFiles.length} file(s)`);

        // Update manifest
        const skillsBaseDir = getSkillsBaseDir(target, context);
        updateManifest(skillsBaseDir, config, installPath, target.name);
        logger.success('Updated manifest');

        logger.success(`Installed to ${target.name}`);
        installedPaths.push({ target: target.name, path: installPath });

      } catch (error) {
        logger.error(`Failed to install to ${target.name}: ${error.message}`);
        if (options.verbose) {
          console.error(error);
        }
      }
    }

    // Summary
    logger.newline();
    logger.divider();
    if (options.dryRun) {
      logger.info(chalk.cyan('DRY RUN COMPLETE'));
      logger.info('No changes were made. Run without --dry-run to install.');
    } else if (installedPaths.length > 0) {
      logger.success('Installation Complete!');
      logger.divider();
      logger.newline();
      logger.info('Installed to:');
      installedPaths.forEach(({ target, path: installPath }) => {
        logger.info(`  • ${target}: ${installPath}`);
      });

      logger.newline();
      logger.info('📖 Next Steps:');
      logger.info('  1. Restart your AI coding tool(s)');
      logger.info('  2. Ask: "What skills are available?"');
      logger.info('  3. Start using your skill!');
    } else {
      logger.warn('No skills were installed');
      logger.info('Check the logs above for details');
    }

  } catch (error) {
    logger.newline();
    logger.error(`Installation failed: ${error.message}`);

    if (options.verbose) {
      console.error(error);
    }

    logger.newline();
    logger.info('Troubleshooting:');
    logger.info('  - Ensure package.json exists and is valid JSON');
    logger.info('  - Ensure SKILL.md exists in the package root');
    logger.info('  - Check file permissions for target directories');
    logger.info('  - Try running with --verbose for more details');

    process.exit(1);
  }
}

module.exports = {
  install
};
