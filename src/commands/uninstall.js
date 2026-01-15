const fs = require('fs');
const chalk = require('chalk');
const { readConfig, extractSkillName } = require('../core/config-reader');
const { getEnabledTargets, filterTargets } = require('../core/target-detector');
const { detectContext, resolvePath, getSkillsBaseDir } = require('../core/path-resolver');
const { removeDirectory } = require('../core/file-copier');
const { removeFromManifest } = require('../core/manifest-manager');
const { getLogger } = require('../utils/logger');

/**
 * Uninstall skill from configured targets
 * @param {object} options - Command options from CLI
 */
async function uninstall(options) {
  const logger = getLogger();

  logger.section('🗑️  Uninstalling AI Coding Skill...');
  logger.newline();

  try {
    // Read configuration
    const config = readConfig(options.config);

    const skillName = extractSkillName(config.name);
    const packageName = config.package || config.name;

    // Detect installation context
    const context = detectContext();

    // Get enabled targets
    let targets = getEnabledTargets(config);

    // Filter by target option if specified
    if (options.target) {
      targets = filterTargets(targets, options.target);
    }

    logger.info(`Uninstalling skill "${skillName}" from ${targets.length} target(s):`);
    targets.forEach(target => {
      logger.info(`  • ${target.name}`);
    });
    logger.newline();

    const uninstalledFrom = [];

    // Uninstall from each target
    for (const target of targets) {
      try {
        logger.section(`🗑️  Uninstalling from ${target.name}...`);

        // Path format using skill name
        const skillNamePath = resolvePath(target, skillName, context);

        // Path format with full package name (including scope)
        const fullPackageNamePath = resolvePath(target, packageName, context);

        let removed = false;

        // Dry run mode
        if (options.dryRun) {
          logger.info(chalk.cyan('  [DRY RUN] Would perform the following:'));

          if (fs.existsSync(skillNamePath)) {
            logger.info(`  - Remove directory: ${skillNamePath}`);
            removed = true;
          }

          if (fs.existsSync(fullPackageNamePath) && fullPackageNamePath !== skillNamePath) {
            logger.info(`  - Remove directory: ${fullPackageNamePath}`);
            removed = true;
          }

          if (removed) {
            logger.info(`  - Update manifest`);
          }

          continue;
        }

        // Check and remove path using skill name
        if (fs.existsSync(skillNamePath)) {
          removeDirectory(skillNamePath);
          logger.success(`Removed skill directory: ${skillName}`);
          removed = true;
        }

        // Check and remove path with full package name (for compatibility)
        if (fs.existsSync(fullPackageNamePath) && fullPackageNamePath !== skillNamePath) {
          removeDirectory(fullPackageNamePath);
          logger.success(`Removed skill directory: ${packageName}`);
          removed = true;
        }

        // Update manifest
        const skillsBaseDir = getSkillsBaseDir(target, context);
        const manifestUpdated = removeFromManifest(skillsBaseDir, packageName);

        if (manifestUpdated) {
          logger.success('Updated manifest');
        }

        if (removed) {
          logger.success(`Uninstalled from ${target.name}`);
          uninstalledFrom.push(target.name);
        } else {
          logger.info(`  ℹ️  Skill was not installed in ${target.name}`);
        }

      } catch (error) {
        logger.error(`Failed to uninstall from ${target.name}: ${error.message}`);
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
      logger.info('No changes were made. Run without --dry-run to uninstall.');
    } else if (uninstalledFrom.length > 0) {
      logger.success('Uninstallation Complete!');
      logger.divider();
      logger.newline();
      logger.info('Uninstalled from:');
      uninstalledFrom.forEach(target => {
        logger.info(`  • ${target}`);
      });
    } else {
      logger.info('ℹ️  Skill was not installed');
      logger.divider();
    }

  } catch (error) {
    logger.newline();
    logger.warn(`Warning during uninstall: ${error.message}`);

    if (options.verbose) {
      console.error(error);
    }

    // Don't exit with error code as uninstall should be best-effort
    logger.info('Uninstallation completed with warnings');
  }
}

module.exports = {
  uninstall
};
