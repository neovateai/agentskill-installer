const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const { copyFile, copyDirectory, copySkillFiles, removeDirectory } = require('../src/core/file-copier');

describe('file-copier', () => {
  const testDir = path.join(__dirname, 'fixtures');
  const sourceDir = path.join(testDir, 'source');
  const targetDir = path.join(testDir, 'target');

  beforeEach(() => {
    // Create test directories
    [testDir, sourceDir, targetDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('copyFile', () => {
    it('should copy a file from source to destination', () => {
      const sourcePath = path.join(sourceDir, 'test.txt');
      const destPath = path.join(targetDir, 'test.txt');

      fs.writeFileSync(sourcePath, 'test content');

      copyFile(sourcePath, destPath);

      expect(fs.existsSync(destPath)).to.be.true;
      expect(fs.readFileSync(destPath, 'utf8')).to.equal('test content');
    });

    it('should create destination directory if it does not exist', () => {
      const sourcePath = path.join(sourceDir, 'test.txt');
      const destPath = path.join(targetDir, 'nested', 'deep', 'test.txt');

      fs.writeFileSync(sourcePath, 'test content');

      copyFile(sourcePath, destPath);

      expect(fs.existsSync(destPath)).to.be.true;
      expect(fs.readFileSync(destPath, 'utf8')).to.equal('test content');
    });
  });

  describe('copyDirectory', () => {
    it('should copy directory and its contents recursively', () => {
      const sourceDirPath = path.join(sourceDir, 'scripts');
      const destDirPath = path.join(targetDir, 'scripts');

      // Create source directory with files
      fs.mkdirSync(sourceDirPath, { recursive: true });
      fs.writeFileSync(path.join(sourceDirPath, 'setup.sh'), 'echo "setup"');
      fs.mkdirSync(path.join(sourceDirPath, 'nested'));
      fs.writeFileSync(path.join(sourceDirPath, 'nested', 'config.json'), '{}');

      copyDirectory(sourceDirPath, destDirPath);

      expect(fs.existsSync(destDirPath)).to.be.true;
      expect(fs.existsSync(path.join(destDirPath, 'setup.sh'))).to.be.true;
      expect(fs.existsSync(path.join(destDirPath, 'nested', 'config.json'))).to.be.true;
    });
  });

  describe('copySkillFiles', () => {
    const mockLogger = {
      debug: () => {},
      warn: () => {}
    };

    it('should copy SKILL.md and auto-detect optional directories', () => {
      // Create source files
      fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# Test Skill');

      const scriptsDir = path.join(sourceDir, 'scripts');
      fs.mkdirSync(scriptsDir, { recursive: true });
      fs.writeFileSync(path.join(scriptsDir, 'setup.sh'), 'echo "setup"');

      const config = {
        name: 'test-skill'
      };

      const copiedFiles = copySkillFiles(sourceDir, targetDir, config, mockLogger);

      expect(copiedFiles).to.include('SKILL.md');
      expect(copiedFiles).to.include('scripts/ (directory)');
      expect(fs.existsSync(path.join(targetDir, 'SKILL.md'))).to.be.true;
      expect(fs.existsSync(path.join(targetDir, 'scripts', 'setup.sh'))).to.be.true;
    });

    it('should throw error if SKILL.md is missing', () => {
      const config = {
        name: 'test-skill'
      };

      expect(() => copySkillFiles(sourceDir, targetDir, config, mockLogger))
        .to.throw('SKILL.md is required but not found');
    });

    it('should only copy SKILL.md if optional directories do not exist', () => {
      fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# Test Skill');

      const config = {
        name: 'test-skill'
      };

      const copiedFiles = copySkillFiles(sourceDir, targetDir, config, mockLogger);

      expect(copiedFiles).to.have.lengthOf(1);
      expect(copiedFiles).to.include('SKILL.md');
    });

    it('should copy multiple optional directories if they exist', () => {
      fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# Test Skill');

      // Create multiple optional directories
      ['scripts', 'references', 'assets'].forEach(dir => {
        const dirPath = path.join(sourceDir, dir);
        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(path.join(dirPath, 'test.txt'), 'test');
      });

      const config = {
        name: 'test-skill'
      };

      const copiedFiles = copySkillFiles(sourceDir, targetDir, config, mockLogger);

      expect(copiedFiles).to.have.lengthOf(4); // SKILL.md + 3 directories
      expect(copiedFiles).to.include('SKILL.md');
      expect(copiedFiles).to.include('scripts/ (directory)');
      expect(copiedFiles).to.include('references/ (directory)');
      expect(copiedFiles).to.include('assets/ (directory)');
    });
  });

  describe('removeDirectory', () => {
    it('should remove directory and all its contents', () => {
      const dirToRemove = path.join(testDir, 'to-remove');
      fs.mkdirSync(dirToRemove, { recursive: true });
      fs.writeFileSync(path.join(dirToRemove, 'file.txt'), 'content');

      expect(fs.existsSync(dirToRemove)).to.be.true;

      removeDirectory(dirToRemove);

      expect(fs.existsSync(dirToRemove)).to.be.false;
    });

    it('should not throw error if directory does not exist', () => {
      const nonExistentDir = path.join(testDir, 'nonexistent');

      expect(() => removeDirectory(nonExistentDir)).to.not.throw();
    });
  });
});
