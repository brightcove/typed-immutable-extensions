# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## Fixed

- Fixed `Typed.typeName` specifiers for `Maybe`, `Enum` and `Discriminator`

### Changed

- Moved logic for `Maybe`, `Enum`, and `Discriminator` into separate classes which expose some typing information

### Removed

- jsdoc, we are now only using jsdoc-to-markdown

## [0.1.1] - 2018-08-13

### Added

- `prepublishOnly` task to build the library
- `files` specifier in `package.json` to restrict which files are packaged

### Changed

- Changed API and CONTRIBUTING URLs in README to be absolute URLs

### Removed

- `lib` from git repo

## [0.1.0] - 2018-08-13

### Added

- `Maybe`, `Enum`, and `Discriminator` types
- `extends` function for extending Records
- API documentation with jsdoc and jsdoc-to-markdown