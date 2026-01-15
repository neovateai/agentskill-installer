const { execSync } = require('child_process');
const path = require('path');

/**
 * Execute a post-install hook
 * @param {string} hookCommand - Command to execute
 * @param {string} targetDir - Directory to execute in
 * @param {object} logger - Logger instance
 * @returns {boolean} True if successful, false otherwise
 */
function executeHook(hookCommand, targetDir, logger) {
  try {
    logger.debug(`Executing hook: ${hookCommand}`);

    execSync(hookCommand, {
      cwd: targetDir,
      stdio: 'pipe',
      timeout: 30000 // 30 second timeout
    });

    logger.debug('Hook completed successfully');
    return true;
  } catch (error) {
    logger.warn(`Hook execution failed: ${error.message}`);
    return false;
  }
}

/**
 * Execute post-install hooks if configured
 * @param {object} config - Skill configuration
 * @param {string} targetDir - Target installation directory
 * @param {object} logger - Logger instance
 * @param {boolean} skipHooks - Whether to skip hooks
 */
function executePostInstallHooks(config, targetDir, logger, skipHooks = false) {
  if (skipHooks) {
    logger.debug('Skipping post-install hooks');
    return;
  }

  if (config.hooks && config.hooks.postinstall) {
    logger.debug('Running post-install hook...');
    const success = executeHook(config.hooks.postinstall, targetDir, logger);

    if (success) {
      logger.success('Post-install hook completed');
    } else {
      logger.warn('Post-install hook failed (continuing anyway)');
    }
  }
}

module.exports = {
  executeHook,
  executePostInstallHooks
};
