const fs = require('fs');
const path = require('path');

/**
 * Read and parse .claude-skill.json configuration
 * @param {string} configPath - Optional path to config file
 * @returns {object} Parsed configuration
 */
function readConfig(configPath) {
  // Auto-detect config path if not provided
  if (!configPath) {
    const cwd = process.env.INIT_CWD || process.cwd();
    configPath = path.join(cwd, '.claude-skill.json');
  }

  if (!fs.existsSync(configPath)) {
    throw new Error(`.claude-skill.json not found at ${configPath}`);
  }

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse .claude-skill.json: ${error.message}`);
  }
}

/**
 * Extract skill name from package name (remove scope prefix if present)
 * @param {string} packageName - Full package name (e.g., "@org/skill-name")
 * @returns {string} Skill name without scope
 */
function extractSkillName(packageName) {
  if (packageName.startsWith('@')) {
    const parts = packageName.split('/');
    return parts[1] || packageName;
  }
  return packageName;
}

/**
 * Validate configuration object
 * @param {object} config - Configuration to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  if (!config.name) {
    throw new Error('Configuration must have a "name" field');
  }

  if (!config.targets && !config.package) {
    throw new Error('Configuration must have either "targets" or "package" field');
  }

  // Validate enabled targets
  if (config.targets) {
    const enabledTargets = Object.entries(config.targets)
      .filter(([_, target]) => target.enabled);

    if (enabledTargets.length === 0) {
      throw new Error('At least one target must be enabled');
    }

    // Validate each enabled target
    for (const [name, target] of enabledTargets) {
      if (!target.paths || !target.paths.global || !target.paths.project) {
        throw new Error(`Target "${name}" must have both global and project paths`);
      }
    }
  }
}

module.exports = {
  readConfig,
  extractSkillName,
  validateConfig
};
