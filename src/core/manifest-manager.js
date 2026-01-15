const fs = require('fs');
const path = require('path');

/**
 * Read skills manifest
 * @param {string} skillsDir - Base skills directory
 * @returns {object} Manifest object
 */
function readManifest(skillsDir) {
  const manifestPath = path.join(skillsDir, '.skills-manifest.json');

  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (error) {
      console.warn('Warning: Could not parse existing manifest, creating new one');
      return { skills: {} };
    }
  }

  return { skills: {} };
}

/**
 * Write skills manifest
 * @param {string} skillsDir - Base skills directory
 * @param {object} manifest - Manifest object to write
 */
function writeManifest(skillsDir, manifest) {
  const manifestPath = path.join(skillsDir, '.skills-manifest.json');

  // Ensure directory exists
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir, { recursive: true });
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Update manifest with new skill installation
 * @param {string} skillsDir - Base skills directory
 * @param {object} config - Skill configuration
 * @param {string} installPath - Installation path
 * @param {string} targetName - Target name (e.g., 'claude-code')
 */
function updateManifest(skillsDir, config, installPath, targetName) {
  const manifest = readManifest(skillsDir);

  // Extract skill name from package name (remove scope prefix)
  const skillName = config.name.startsWith('@') ?
    config.name.split('/')[1] || config.name :
    config.name;

  // Use package name as key (with scope if present)
  const packageKey = config.package || config.name;

  manifest.skills[packageKey] = {
    version: config.version || '1.0.0',
    installedAt: new Date().toISOString(),
    package: packageKey,
    path: installPath,
    target: targetName,
    skillName: skillName
  };

  writeManifest(skillsDir, manifest);
}

/**
 * Remove skill from manifest
 * @param {string} skillsDir - Base skills directory
 * @param {string} packageName - Package name to remove
 * @returns {boolean} True if removed, false if not found
 */
function removeFromManifest(skillsDir, packageName) {
  const manifestPath = path.join(skillsDir, '.skills-manifest.json');

  if (!fs.existsSync(manifestPath)) {
    return false;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    if (manifest.skills && manifest.skills[packageName]) {
      delete manifest.skills[packageName];
      writeManifest(skillsDir, manifest);
      return true;
    }
  } catch (error) {
    console.warn('Warning: Could not update manifest:', error.message);
  }

  return false;
}

/**
 * Get all installed skills from manifest
 * @param {string} skillsDir - Base skills directory
 * @returns {Array} Array of skill information objects
 */
function getInstalledSkills(skillsDir) {
  const manifest = readManifest(skillsDir);

  return Object.entries(manifest.skills || {}).map(([packageName, info]) => ({
    package: packageName,
    ...info
  }));
}

module.exports = {
  readManifest,
  writeManifest,
  updateManifest,
  removeFromManifest,
  getInstalledSkills
};
