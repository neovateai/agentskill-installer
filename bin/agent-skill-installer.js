#!/usr/bin/env node

const { Command } = require('commander');
const { install } = require('../src/commands/install');
const { uninstall } = require('../src/commands/uninstall');
const { list } = require('../src/commands/list');
const { setLoggerOptions } = require('../src/utils/logger');
const pkg = require('../package.json');

const program = new Command();

program
  .name('agent-skill-installer')
  .description('CLI tool for installing and managing AI agent skills')
  .version(pkg.version);

// Global options
program
  .option('--config <path>', 'Path to .claude-skill.json configuration file')
  .option('-v, --verbose', 'Enable verbose logging for detailed output')
  .option('-s, --silent', 'Suppress non-error output');

// Install command
program
  .command('install')
  .description('Install skill to configured AI coding tool targets')
  .option('--target <targets>', 'Comma-separated list of targets to install to (e.g., claude-code,cursor)')
  .option('-f, --force', 'Force reinstall even if skill is already installed')
  .option('--dry-run', 'Preview installation without making any changes')
  .option('--no-hooks', 'Skip execution of post-install hooks')
  .action(async (cmdOptions) => {
    const options = { ...program.opts(), ...cmdOptions };

    // Set logger options
    setLoggerOptions({
      verbose: options.verbose,
      silent: options.silent
    });

    await install(options);
  });

// Uninstall command
program
  .command('uninstall')
  .description('Uninstall skill from configured AI coding tool targets')
  .option('--target <targets>', 'Comma-separated list of targets to uninstall from')
  .option('--dry-run', 'Preview uninstallation without making any changes')
  .action(async (cmdOptions) => {
    const options = { ...program.opts(), ...cmdOptions };

    // Set logger options
    setLoggerOptions({
      verbose: options.verbose,
      silent: options.silent
    });

    await uninstall(options);
  });

// List command
program
  .command('list')
  .description('List all installed skills across AI coding tools')
  .option('--target <target>', 'Show skills for specific target only (e.g., claude-code)')
  .option('--json', 'Output results in JSON format')
  .action(async (cmdOptions) => {
    const options = { ...program.opts(), ...cmdOptions };

    // Set logger options (always allow output for list command)
    setLoggerOptions({
      verbose: options.verbose,
      silent: false
    });

    await list(options);
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
