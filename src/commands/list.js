const chalk = require('chalk');
const { getEnabledTargets } = require('../core/target-detector');
const { detectContext, getSkillsBaseDir } = require('../core/path-resolver');
const { getInstalledSkills } = require('../core/manifest-manager');
const { getLogger } = require('../utils/logger');

/**
 * List installed skills
 * @param {object} options - Command options from CLI
 */
async function list(options) {
  const logger = getLogger();

  try {
    const context = detectContext();

    // Define all possible targets to check
    const allTargets = [
      {
        name: 'claude-code',
        paths: {
          global: '.claude/skills',
          project: '.claude/skills'
        }
      },
      {
        name: 'cursor',
        paths: {
          global: '.cursor/skills',
          project: '.cursor/skills'
        }
      },
      {
        name: 'windsurf',
        paths: {
          global: '.windsurf/skills',
          project: '.windsurf/skills'
        }
      },
      {
        name: 'aider',
        paths: {
          global: '.aider/skills',
          project: '.aider/skills'
        }
      }
    ];

    // Filter by target if specified
    const targetsToCheck = options.target
      ? allTargets.filter(t => t.name === options.target)
      : allTargets;

    let allSkills = [];

    // Collect skills from all targets
    for (const target of targetsToCheck) {
      try {
        const skillsBaseDir = getSkillsBaseDir(target, context);
        const skills = getInstalledSkills(skillsBaseDir);

        skills.forEach(skill => {
          allSkills.push({
            ...skill,
            target: target.name,
            location: context.isGlobal ? 'global' : 'project'
          });
        });
      } catch (error) {
        // Skip if target doesn't exist or can't be read
        logger.debug(`Could not read skills from ${target.name}: ${error.message}`);
      }
    }

    // JSON output
    if (options.json) {
      console.log(JSON.stringify({ skills: allSkills }, null, 2));
      return;
    }

    // Human-readable output
    if (allSkills.length === 0) {
      logger.info('No skills installed');
      logger.info('\nTo install a skill:');
      logger.info('  npm install -g @your-org/your-skill');
      return;
    }

    logger.section('Installed Skills:');
    logger.newline();

    // Group by target
    const skillsByTarget = {};
    allSkills.forEach(skill => {
      if (!skillsByTarget[skill.target]) {
        skillsByTarget[skill.target] = [];
      }
      skillsByTarget[skill.target].push(skill);
    });

    // Display by target
    Object.entries(skillsByTarget).forEach(([targetName, skills]) => {
      logger.info(chalk.bold(`${targetName}:`));

      skills.forEach(skill => {
        const installDate = new Date(skill.installedAt).toLocaleDateString();
        logger.info(`  • ${chalk.cyan(skill.package)} ${chalk.gray(`v${skill.version}`)}`);
        logger.info(`    Path: ${skill.path}`);
        logger.info(`    Installed: ${installDate}`);
        logger.info('');
      });
    });

    logger.info(chalk.gray(`Total: ${allSkills.length} skill(s) installed`));

  } catch (error) {
    logger.error(`Failed to list skills: ${error.message}`);

    if (options.verbose) {
      console.error(error);
    }

    process.exit(1);
  }
}

module.exports = {
  list
};
