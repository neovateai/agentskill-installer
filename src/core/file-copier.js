const fs = require('fs');
const path = require('path');

/**
 * Copy a single file
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 */
function copyFile(sourcePath, destPath) {
  // Ensure destination directory exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(sourcePath, destPath);
}

/**
 * Copy a directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy skill files to target directory
 * @param {string} sourceDir - Source directory (package root)
 * @param {string} targetDir - Target installation directory
 * @param {object} config - Skill configuration
 * @param {object} logger - Logger instance
 * @returns {Array} List of copied files
 */
function copySkillFiles(sourceDir, targetDir, config, logger) {
  const copiedFiles = [];

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy SKILL.md (required)
  const skillMdSource = path.join(sourceDir, 'SKILL.md');
  if (!fs.existsSync(skillMdSource)) {
    throw new Error('SKILL.md is required but not found');
  }
  copyFile(skillMdSource, path.join(targetDir, 'SKILL.md'));
  copiedFiles.push('SKILL.md');
  logger.debug('Copied SKILL.md');

  // Copy additional files if specified
  if (config.files) {
    Object.entries(config.files).forEach(([source, dest]) => {
      const sourcePath = path.join(sourceDir, source);
      if (!fs.existsSync(sourcePath)) {
        logger.warn(`Warning: ${source} not found, skipping`);
        return;
      }

      const destPath = path.join(targetDir, dest);

      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath);
        copiedFiles.push(`${source}/ (directory)`);
        logger.debug(`Copied directory: ${source}`);
      } else {
        copyFile(sourcePath, destPath);
        copiedFiles.push(source);
        logger.debug(`Copied file: ${source}`);
      }
    });
  }

  return copiedFiles;
}

/**
 * Remove a directory and all its contents
 * @param {string} dirPath - Directory path to remove
 */
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

module.exports = {
  copyFile,
  copyDirectory,
  copySkillFiles,
  removeDirectory
};
