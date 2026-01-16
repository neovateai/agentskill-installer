# @agentskill/installer

[![Tests](https://github.com/neovateai/agentskill-installer/workflows/Tests/badge.svg)](https://github.com/neovateai/agentskill-installer/actions)
[![npm version](https://img.shields.io/npm/v/@agentskill/installer.svg)](https://www.npmjs.com/package/@agentskill/installer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> CLI tool for installing and managing AI agent skills

A simple installer for AI agent skills that works with Claude Code and other AI coding assistants.

## Features

- 🚀 Simple CLI commands for skill management
- 📦 Automatic installation to the correct directories
- 🔄 Smart path detection (global vs project-level)
- 📋 List installed skills
- 🧪 Dry-run mode to preview changes
- 📝 Comprehensive logging and error messages

## Installation

```bash
npm install @agentskill/installer
```

Or install globally:

```bash
npm install -g @agentskill/installer
```

## Usage

### Install a skill

```bash
agent-skill-installer install
```

This command will:
1. Read package.json for the skill name
2. Detect installation context (global or project-level)
3. Copy SKILL.md and optional directories (scripts/, references/, assets/) to ~/.claude/skills/
4. Update the skills manifest

### Uninstall a skill

```bash
agent-skill-installer uninstall
```

### List installed skills

```bash
agent-skill-installer list
```

Show skills in JSON format:

```bash
agent-skill-installer list --json
```

### CLI Options

**Global Options:**
- `--config <path>` - Path to package.json (default: auto-detect)
- `--verbose, -v` - Enable verbose logging
- `--help, -h` - Show help information
- `--version, -V` - Show version number

**Install Options:**
- `--force, -f` - Force reinstall even if already installed
- `--dry-run` - Preview installation without making changes
- `--target <targets>` - Comma-separated list of targets (e.g., `claude-code`)

**Uninstall Options:**
- `--dry-run` - Preview uninstallation without making changes
- `--target <targets>` - Comma-separated list of targets

**List Options:**
- `--target <target>` - Show skills for specific target only
- `--json` - Output in JSON format

## Using in Your Skill Package

Add this installer as a dependency in your skill's `package.json`:

```json
{
  "name": "@your-org/your-skill",
  "version": "1.0.0",
  "scripts": {
    "postinstall": "agent-skill-installer install",
    "preuninstall": "agent-skill-installer uninstall"
  },
  "dependencies": {
    "@agentskill/installer": "^1.0.0"
  },
  "files": [
    "SKILL.md",
    "scripts/"
  ]
}
```

## File Structure

The installer will automatically copy the following files if they exist:

- **SKILL.md** (required) - Main skill definition
- **scripts/** (optional) - Utility scripts
- **references/** (optional) - Reference documentation
- **assets/** (optional) - Templates, icons, etc.

## How It Works

### Installation Flow

1. **Context Detection**: Determines if this is a global or project-level installation
2. **Config Reading**: Reads package.json for the skill name
3. **Path Resolution**: Calculates the correct installation path (defaults to ~/.claude/skills/)
4. **File Copying**: Copies SKILL.md and optional directories to the target directory
5. **Manifest Update**: Updates .skills-manifest.json to track installation

### Installation Paths

- **Global**: `~/.claude/skills/your-skill-name/`
- **Project**: `.claude/skills/your-skill-name/`

## Examples

### Install with verbose output

```bash
agent-skill-installer install --verbose
```

### Preview installation without changes

```bash
agent-skill-installer install --dry-run
```

### Force reinstall

```bash
agent-skill-installer install --force
```

## Troubleshooting

### Skill not appearing after installation

1. Check if installation was successful:
   ```bash
   agent-skill-installer list
   ```

2. Verify the skill directory exists:
   ```bash
   ls -la ~/.claude/skills/
   ```

3. Restart your AI coding tool

### Permission errors

If you encounter permission errors during global installation:

```bash
# Option 1: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Option 2: Use sudo (not recommended)
sudo npm install -g @agentskill/installer
```

### Configuration not found

Make sure package.json exists in your package root:

```bash
agent-skill-installer install --config /path/to/package.json
```

## Development

```bash
# Clone the repository
git clone https://github.com/your-org/agent-skill-installer.git
cd agent-skill-installer

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Link locally for testing
npm link

# Test the CLI
agent-skill-installer --help
```

## Running Tests

The project uses Mocha and Chai for testing. Tests are automatically run on:
- Push to main/master/develop branches
- Pull requests to main/master/develop branches

Tests run on multiple platforms (Ubuntu, macOS, Windows) and Node.js versions (14, 16, 18, 20).

To run tests locally:
```bash
npm test
```

Test coverage includes:
- **config-reader**: Reading and parsing package.json, extracting skill names
- **target-detector**: Target detection and filtering
- **file-copier**: File and directory copying operations

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/agent-skill-installer/issues)
- **Documentation**: [Full Documentation](https://github.com/your-org/agent-skill-installer#readme)

---

Made with ❤️ for the AI coding community
