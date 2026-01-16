const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { readConfig, extractSkillName, validateConfig } = require('../src/core/config-reader');

describe('config-reader', () => {
  const testDir = path.join(__dirname, 'fixtures');

  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('readConfig', () => {
    it('should read package.json and return config', () => {
      const packageJson = {
        name: '@test/my-skill',
        version: '1.0.0',
        description: 'Test skill'
      };

      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

      const config = readConfig(packagePath);

      expect(config).to.have.property('name', '@test/my-skill');
      expect(config).to.have.property('package', '@test/my-skill');
      expect(config).to.have.property('version', '1.0.0');
    });

    it('should throw error if package.json not found', () => {
      const nonExistentPath = path.join(testDir, 'nonexistent.json');

      expect(() => readConfig(nonExistentPath)).to.throw('package.json not found');
    });

    it('should throw error if package.json is invalid JSON', () => {
      const packagePath = path.join(testDir, 'package.json');
      fs.writeFileSync(packagePath, 'invalid json {');

      expect(() => readConfig(packagePath)).to.throw('Failed to parse package.json');
    });
  });

  describe('extractSkillName', () => {
    it('should extract skill name from scoped package', () => {
      expect(extractSkillName('@test/my-skill')).to.equal('my-skill');
      expect(extractSkillName('@antskill/example')).to.equal('example');
    });

    it('should return the same name for non-scoped package', () => {
      expect(extractSkillName('my-skill')).to.equal('my-skill');
      expect(extractSkillName('example-skill')).to.equal('example-skill');
    });

    it('should handle edge cases', () => {
      expect(extractSkillName('@scope/name-with-dashes')).to.equal('name-with-dashes');
      expect(extractSkillName('simple')).to.equal('simple');
    });
  });

  describe('validateConfig', () => {
    it('should pass validation for valid config', () => {
      const config = {
        name: '@test/my-skill',
        package: '@test/my-skill',
        version: '1.0.0'
      };

      expect(() => validateConfig(config)).to.not.throw();
    });

    it('should throw error if name is missing', () => {
      const config = {
        version: '1.0.0'
      };

      expect(() => validateConfig(config)).to.throw('package.json must have a "name" field');
    });

    it('should allow config with only name field', () => {
      const config = {
        name: 'my-skill'
      };

      expect(() => validateConfig(config)).to.not.throw();
    });
  });
});
