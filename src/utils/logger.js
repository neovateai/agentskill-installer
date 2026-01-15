const chalk = require('chalk');

/**
 * Logger utility for consistent console output
 */
class Logger {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.silent = options.silent || false;
  }

  /**
   * Log info message
   */
  info(message) {
    if (!this.silent) {
      console.log(message);
    }
  }

  /**
   * Log success message with checkmark
   */
  success(message) {
    if (!this.silent) {
      console.log(chalk.green('✓') + ' ' + message);
    }
  }

  /**
   * Log warning message
   */
  warn(message) {
    if (!this.silent) {
      console.log(chalk.yellow('⚠') + ' ' + message);
    }
  }

  /**
   * Log error message
   */
  error(message) {
    console.error(chalk.red('✗') + ' ' + message);
  }

  /**
   * Log debug message (only in verbose mode)
   */
  debug(message) {
    if (this.verbose && !this.silent) {
      console.log(chalk.gray('[debug]') + ' ' + message);
    }
  }

  /**
   * Log section header
   */
  section(title) {
    if (!this.silent) {
      console.log('\n' + chalk.bold(title));
    }
  }

  /**
   * Log divider line
   */
  divider(char = '=', length = 60) {
    if (!this.silent) {
      console.log(char.repeat(length));
    }
  }

  /**
   * Log empty line
   */
  newline() {
    if (!this.silent) {
      console.log();
    }
  }
}

// Create a default logger instance
let defaultLogger = new Logger();

/**
 * Set the default logger options
 */
function setLoggerOptions(options) {
  defaultLogger = new Logger(options);
}

/**
 * Get the current logger instance
 */
function getLogger() {
  return defaultLogger;
}

module.exports = {
  Logger,
  setLoggerOptions,
  getLogger
};
