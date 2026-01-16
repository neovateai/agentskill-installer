# Testing Guide

This document provides information about the test suite for @agentskill/installer.

## Test Framework

- **Test Runner**: Mocha
- **Assertion Library**: Chai
- **Test Files**: Located in `test/` directory

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run specific test file
```bash
npx mocha test/config-reader.test.js
```

## Test Structure

### config-reader.test.js
Tests for reading and parsing package.json configuration:
- Reading valid package.json files
- Handling missing files
- Parsing invalid JSON
- Extracting skill names from scoped and non-scoped packages
- Validating configuration objects

### target-detector.test.js
Tests for target detection and filtering:
- Returning default claude-code target
- Filtering enabled targets
- Handling comma-separated target filters
- Edge cases with empty target lists

### file-copier.test.js
Tests for file and directory operations:
- Copying individual files
- Copying directories recursively
- Copying SKILL.md and optional directories
- Handling missing SKILL.md
- Removing directories safely

## Test Coverage

Current test coverage focuses on core modules:
- ✅ config-reader (100%)
- ✅ target-detector (100%)
- ✅ file-copier (100%)

## CI/CD Integration

Tests are automatically run on GitHub Actions for:
- **Platforms**: Ubuntu, macOS, Windows
- **Node.js versions**: 14.x, 16.x, 18.x, 20.x
- **Triggers**: Push to main/master/develop, Pull requests

See `.github/workflows/test.yml` for CI configuration.

## Writing New Tests

When adding new features, follow these guidelines:

1. Create a new test file in `test/` directory with `.test.js` suffix
2. Use describe blocks to group related tests
3. Use beforeEach/afterEach for setup and cleanup
4. Clean up test fixtures after each test
5. Use descriptive test names that explain what is being tested

Example:
```javascript
const { expect } = require('chai');

describe('my-module', () => {
  describe('myFunction', () => {
    it('should do something expected', () => {
      const result = myFunction('input');
      expect(result).to.equal('expected output');
    });
  });
});
```

## Troubleshooting

### Tests fail with "command not found"
Run `npm install` to install test dependencies.

### Tests fail with permission errors
Some tests create and remove directories. Ensure you have write permissions in the project directory.

### Tests timeout
Increase timeout in mocha config or specific tests:
```javascript
it('slow test', function() {
  this.timeout(5000); // 5 seconds
  // test code
});
```
