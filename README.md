# @agent-skill/installer

> CLI tool for installing and managing AI agent skills

A universal installer for AI agent skills that works with Claude Code, Cursor, Windsurf, and other AI coding assistants.

## Features

- 🚀 Simple CLI commands for skill management
- 📦 Automatic installation to the correct directories
- 🎯 Support for multiple AI tools (Claude Code, Cursor, Windsurf, Aider)
- 🔄 Smart path detection (global vs project-level)
- 📋 List installed skills
- 🧪 Dry-run mode to preview changes
- 📝 Comprehensive logging and error messages

## Installation

```bash
npm install @agent-skill/installer
```

Or install globally:

```bash
npm install -g @agent-skill/installer
```

## Usage

### Install a skill

```bash
agent-skill-installer install
```

This command will:
1. Read `.claude-skill.json` configuration
2. Detect installation context (global or project-level)
3. Copy skill files to the appropriate directories
4. Update the skills manifest
5. Run post-install hooks if configured

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
- `--config <path>` - Path to .claude-skill.json (default: auto-detect)
- `--verbose, -v` - Enable verbose logging
- `--help, -h` - Show help information
- `--version, -V` - Show version number

**Install Options:**
- `--force, -f` - Force reinstall even if already installed
- `--dry-run` - Preview installation without making changes
- `--no-hooks` - Skip post-install hooks
- `--target <targets>` - Comma-separated list of targets (e.g., `claude-code,cursor`)

**Uninstall Options:**
- `--dry-run` - Preview uninstallation without making changes
- `--target <targets>` - Comma-separated list of targets

**List Options:**
- `--target <target>` - Show skills for specific target only
- `--json` - Output in JSON format

## Configuration

Skills are configured using `.claude-skill.json`:

```json
{
  "name": "your-skill-name",
  "version": "1.0.0",
  "package": "@your-org/your-skill-name",
  "files": {
    "reference.md": "reference.md",
    "examples.md": "examples.md",
    "scripts": "scripts/"
  },
  "hooks": {
    "postinstall": "bash scripts/setup.sh"
  },
  "targets": {
    "claude-code": {
      "enabled": true,
      "paths": {
        "global": ".claude/skills",
        "project": ".claude/skills"
      }
    },
    "cursor": {
      "enabled": false,
      "paths": {
        "global": ".cursor/skills",
        "project": ".cursor/skills"
      }
    }
  }
}
```

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
    "@agent-skill/installer": "^1.0.0"
  },
  "files": [
    "SKILL.md",
    ".claude-skill.json"
  ]
}
```

## How It Works

### Installation Flow

1. **Context Detection**: Determines if this is a global or project-level installation
2. **Config Reading**: Reads and validates `.claude-skill.json`
3. **Target Selection**: Identifies which AI tools to install to (based on enabled targets)
4. **Path Resolution**: Calculates the correct installation path for each target
5. **File Copying**: Copies `SKILL.md` and additional files to target directories
6. **Manifest Update**: Updates `.skills-manifest.json` to track installation
7. **Hook Execution**: Runs post-install hooks if configured

### Supported AI Tools

- **Claude Code**: `~/.claude/skills/` (global) or `.claude/skills/` (project)
- **Cursor**: `~/.cursor/skills/` (global) or `.cursor/skills/` (project)
- **Windsurf**: `~/.windsurf/skills/` (global) or `.windsurf/skills/` (project)
- **Aider**: `~/.aider/skills/` (global) or `.aider/skills/` (project)
- **Custom**: Configure your own paths

## Examples

### Install with verbose output

```bash
agent-skill-installer install --verbose
```

### Preview installation without changes

```bash
agent-skill-installer install --dry-run
```

### Install to specific targets only

```bash
agent-skill-installer install --target claude-code,cursor
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
sudo npm install -g @agent-skill/installer
```

### Configuration not found

Make sure `.claude-skill.json` exists in your package root, or specify its path:

```bash
agent-skill-installer install --config /path/to/.claude-skill.json
```

## Development

```bash
# Clone the repository
git clone https://github.com/your-org/agent-skill-installer.git
cd agent-skill-installer

# Install dependencies
npm install

# Link locally for testing
npm link

# Test the CLI
agent-skill-installer --help
```

## Migration from Old Scripts

If you're migrating from the old `install-skill.js` / `uninstall-skill.js` approach:

1. Add `@agent-skill/installer` as a dependency
2. Update your `package.json` scripts:
   ```json
   {
     "scripts": {
       "postinstall": "agent-skill-installer install",
       "preuninstall": "agent-skill-installer uninstall"
     }
   }
   ```
3. Remove `install-skill.js`, `uninstall-skill.js`, and `utils.js`
4. Keep `.claude-skill.json` and `SKILL.md` (no changes needed)

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
