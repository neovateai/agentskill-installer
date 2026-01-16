const { expect } = require('chai');
const { getEnabledTargets, filterTargets } = require('../src/core/target-detector');

describe('target-detector', () => {
  describe('getEnabledTargets', () => {
    it('should return default claude-code target if no targets specified', () => {
      const config = {
        name: 'test-skill'
      };

      const targets = getEnabledTargets(config);

      expect(targets).to.be.an('array').with.lengthOf(1);
      expect(targets[0]).to.have.property('name', 'claude-code');
      expect(targets[0]).to.have.nested.property('paths.global', '.claude/skills');
      expect(targets[0]).to.have.nested.property('paths.project', '.claude/skills');
    });

    it('should return only enabled targets', () => {
      const config = {
        name: 'test-skill',
        targets: {
          'claude-code': {
            enabled: true,
            paths: {
              global: '.claude/skills',
              project: '.claude/skills'
            }
          },
          'cursor': {
            enabled: false,
            paths: {
              global: '.cursor/skills',
              project: '.cursor/skills'
            }
          },
          'windsurf': {
            enabled: true,
            paths: {
              global: '.windsurf/skills',
              project: '.windsurf/skills'
            }
          }
        }
      };

      const targets = getEnabledTargets(config);

      expect(targets).to.be.an('array').with.lengthOf(2);
      expect(targets[0]).to.have.property('name', 'claude-code');
      expect(targets[1]).to.have.property('name', 'windsurf');
    });

    it('should return empty array if no targets are enabled', () => {
      const config = {
        name: 'test-skill',
        targets: {
          'claude-code': {
            enabled: false,
            paths: {
              global: '.claude/skills',
              project: '.claude/skills'
            }
          }
        }
      };

      const targets = getEnabledTargets(config);

      expect(targets).to.be.an('array').with.lengthOf(0);
    });
  });

  describe('filterTargets', () => {
    const allTargets = [
      { name: 'claude-code', paths: { global: '.claude/skills', project: '.claude/skills' } },
      { name: 'cursor', paths: { global: '.cursor/skills', project: '.cursor/skills' } },
      { name: 'windsurf', paths: { global: '.windsurf/skills', project: '.windsurf/skills' } }
    ];

    it('should return all targets if no filter specified', () => {
      const filtered = filterTargets(allTargets, null);

      expect(filtered).to.deep.equal(allTargets);
    });

    it('should filter targets by single name', () => {
      const filtered = filterTargets(allTargets, 'cursor');

      expect(filtered).to.be.an('array').with.lengthOf(1);
      expect(filtered[0]).to.have.property('name', 'cursor');
    });

    it('should filter targets by comma-separated names', () => {
      const filtered = filterTargets(allTargets, 'claude-code,windsurf');

      expect(filtered).to.be.an('array').with.lengthOf(2);
      expect(filtered[0]).to.have.property('name', 'claude-code');
      expect(filtered[1]).to.have.property('name', 'windsurf');
    });

    it('should handle spaces in filter string', () => {
      const filtered = filterTargets(allTargets, 'claude-code, cursor');

      expect(filtered).to.be.an('array').with.lengthOf(2);
      expect(filtered[0]).to.have.property('name', 'claude-code');
      expect(filtered[1]).to.have.property('name', 'cursor');
    });

    it('should return empty array if no matches found', () => {
      const filtered = filterTargets(allTargets, 'nonexistent');

      expect(filtered).to.be.an('array').with.lengthOf(0);
    });
  });
});
