# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.6] - 2020-04-06
### Fixed
- Updated package-lock.json to fix vulnerabilities

## [0.1.5] - 2020-02-18
### Fixed
- Updated mocha and nyc libraries to fix vulnerabilities

## [0.1.4] - 2019-08-29
### Fixed
- Updated eslint and mocha library to fix vulnerabilities

## [0.1.3] - 2019-07-18
### Added
- Added automated deploys of new versions

### Fixed
- Updated mocha library to fix vulnerabilities

## [0.1.2] - 2018-08-16
### Changed
- Moved logic for `Maybe`, `Enum`, and `Discriminator` into separate classes which expose some typing information

### Removed
- jsdoc, we are now only using jsdoc-to-markdown

### Fixed
- Fixed `Typed.typeName` specifiers for `Maybe`, `Enum` and `Discriminator`

## [0.1.1] - 2018-08-13
### Added
- `prepublishOnly` task to build the library
- `files` specifier in `package.json` to restrict which files are packaged

### Changed
- Changed API and CONTRIBUTING URLs in README to be absolute URLs

### Removed
- `lib` from git repo

## 0.1.0 - 2018-08-13
### Added
- `Maybe`, `Enum`, and `Discriminator` types
- `extends` function for extending Records
- API documentation with jsdoc and jsdoc-to-markdown

[Unreleased]: https://github.com/brightcove/typed-immutable-extensions/compare/v0.1.6...HEAD
[0.1.6]: https://github.com/brightcove/typed-immutable-extensions/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/brightcove/typed-immutable-extensions/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/brightcove/typed-immutable-extensions/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/brightcove/typed-immutable-extensions/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/brightcove/typed-immutable-extensions/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/brightcove/typed-immutable-extensions/compare/v0.1.0...v0.1.1
