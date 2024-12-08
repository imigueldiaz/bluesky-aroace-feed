# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2024-12-08

### Added
- New `filter-patterns.js` module for centralized pattern management
- Test files for filters, utils, and db modules
- Code coverage configuration with codecov.yml
- ESLint and Prettier configurations
- Database module with tests
- Vitest setup and configuration files

### Changed
- Improved gaming context detection in `analyze.js`
- Refactored text analysis to reduce dependency on Compromise library
- Updated all code comments to use English consistently
- Enhanced spam and sensitive content filtering
- Restructured project with better code organization
- Updated dependencies in package.json

### Fixed
- Improved accuracy of gaming context detection for "ace" keyword
- Enhanced language detection reliability

## [0.1.1] - 2024-12-08

### Changed

- Refactored methods for iterating over keywords into a single analyze module (Thanks to [@Dorwinrin](https://github.com/Dorwinrin))

## [0.1.0] - 2024-12-07

### Added

- Initial project setup with basic feed generator functionality
- Ace/aro content filtering system
- Multi-language support for content detection
- Basic server setup with Node.js
- Keywords and filters configuration
- Content analysis and filtering logic
- Environment configuration setup
- Testing framework integration with Vitest

### Changed

- Updated documentation to reflect Node.js implementation (previously described as Python)

### Fixed

- Fixed typo in codebase

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
