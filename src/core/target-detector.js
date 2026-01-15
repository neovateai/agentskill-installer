/**
 * Get enabled target configurations from config
 * @param {object} config - Full configuration object
 * @returns {Array} Array of enabled target objects
 */
function getEnabledTargets(config) {
  // If no targets configuration, use default Claude Code configuration
  if (!config.targets) {
    return [{
      name: 'claude-code',
      paths: {
        global: '.claude/skills',
        project: '.claude/skills'
      }
    }];
  }

  // Return all enabled targets
  return Object.entries(config.targets)
    .filter(([_, target]) => target.enabled)
    .map(([name, target]) => ({
      name,
      paths: target.paths
    }));
}

/**
 * Filter targets based on CLI option
 * @param {Array} allTargets - All available targets
 * @param {string} targetFilter - Comma-separated target names from CLI
 * @returns {Array} Filtered targets
 */
function filterTargets(allTargets, targetFilter) {
  if (!targetFilter) {
    return allTargets;
  }

  const requestedTargets = targetFilter.split(',').map(t => t.trim());
  return allTargets.filter(target => requestedTargets.includes(target.name));
}

module.exports = {
  getEnabledTargets,
  filterTargets
};
