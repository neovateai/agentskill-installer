/**
 * @agent-skill/installer
 *
 * A CLI tool for installing and managing AI agent skills
 * for Claude Code, Cursor, Windsurf, and other AI coding assistants.
 *
 * Main exports for programmatic usage (if needed in the future)
 */

const { install } = require('./commands/install');
const { uninstall } = require('./commands/uninstall');
const { list } = require('./commands/list');

const { readConfig, extractSkillName, validateConfig } = require('./core/config-reader');
const { getEnabledTargets, filterTargets } = require('./core/target-detector');
const { detectContext, resolvePath } = require('./core/path-resolver');
const { Logger, setLoggerOptions, getLogger } = require('./utils/logger');

module.exports = {
  // Commands
  install,
  uninstall,
  list,

  // Core utilities
  readConfig,
  extractSkillName,
  validateConfig,
  getEnabledTargets,
  filterTargets,
  detectContext,
  resolvePath,

  // Logger
  Logger,
  setLoggerOptions,
  getLogger
};
