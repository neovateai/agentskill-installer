const fs = require('fs');
const path = require('path');
const os = require('os');

// Use INIT_CWD to get the correct working directory
const CWD = process.env.INIT_CWD || process.cwd();

/**
 * Detect current installation context
 * @returns {object} Context information
 */
function detectContext() {
  return {
    // npm environment variables
    isGlobal: process.env.npm_config_global === 'true',
    initCwd: process.env.INIT_CWD,
    packageRoot: findPackageRoot(),

    // Installation context
    isNpmInstall: !!process.env.npm_lifecycle_event,
    lifecycleEvent: process.env.npm_lifecycle_event,

    // Paths
    cwd: process.cwd(),
    homeDir: os.homedir()
  };
}

/**
 * Find the package root directory
 * Search upward from CWD, skipping node_modules
 * @returns {string} Package root path
 */
function findPackageRoot() {
  let projectRoot = CWD;

  // Search upward, skip node_modules directories, find the actual project root
  while (projectRoot !== path.dirname(projectRoot)) {
    // Check if this is a project root directory (contains package.json or .git)
    const hasPackageJson = fs.existsSync(path.join(projectRoot, 'package.json'));
    const hasGit = fs.existsSync(path.join(projectRoot, '.git'));

    // Check if current directory is in node_modules
    const isInNodeModules = projectRoot.includes('/node_modules/') ||
                           path.basename(projectRoot) === 'node_modules';

    if ((hasPackageJson || hasGit) && !isInNodeModules) {
      // Found the actual project root directory
      break;
    }

    // Continue searching upward
    projectRoot = path.dirname(projectRoot);
  }

  // Verify the final path is reasonable
  const finalIsInNodeModules = projectRoot.includes('/node_modules/') ||
                              path.basename(projectRoot) === 'node_modules';

  if (finalIsInNodeModules) {
    // If suitable project root not found, use current working directory (with warning)
    console.warn('⚠ Warning: Could not find project root directory, using current directory');
    projectRoot = CWD;
  }

  return projectRoot;
}

/**
 * Resolve installation path for a target
 * @param {object} target - Target configuration
 * @param {string} skillName - Name of the skill (without scope)
 * @param {object} context - Installation context
 * @returns {string} Resolved installation path
 */
function resolvePath(target, skillName, context) {
  if (context.isGlobal) {
    // Global installation: install to user home directory
    return path.join(context.homeDir, target.paths.global, skillName);
  } else {
    // Project-level installation: install to project root
    return path.join(context.packageRoot, target.paths.project, skillName);
  }
}

/**
 * Get the base skills directory for a target
 * @param {object} target - Target configuration
 * @param {object} context - Installation context
 * @returns {string} Base skills directory path
 */
function getSkillsBaseDir(target, context) {
  if (context.isGlobal) {
    return path.join(context.homeDir, target.paths.global);
  } else {
    return path.join(context.packageRoot, target.paths.project);
  }
}

module.exports = {
  detectContext,
  findPackageRoot,
  resolvePath,
  getSkillsBaseDir
};
