const fs = require('fs');
const path = require('path');

/**
 * Read and parse package.json configuration
 * @param {string} configPath - Optional path to package.json
 * @returns {object} Parsed configuration
 */
function readConfig(configPath) {
  // Auto-detect package.json path if not provided
  if (!configPath) {
    const cwd = process.env.INIT_CWD || process.cwd();
    configPath = path.join(cwd, 'package.json');
  }

  if (!fs.existsSync(configPath)) {
    throw new Error(`package.json not found at ${configPath}`);
  }

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const packageJson = JSON.parse(content);

    // Convert package.json to simplified config format
    return {
      name: packageJson.name,
      package: packageJson.name,
      version: packageJson.version
    };
  } catch (error) {
    throw new Error(`Failed to parse package.json: ${error.message}`);
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
    throw new Error('package.json must have a "name" field');
  }
}

module.exports = {
  readConfig,
  extractSkillName,
  validateConfig
};
