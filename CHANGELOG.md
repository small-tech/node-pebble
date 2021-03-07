# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.0] - 2021-03-07

### Changed

  - __Breaking change:__ Binaries are no longer bundled in the package. They are downloaded as an npm postinstall task.
  - Uses ECMAScript Modules (ESM; es6 modules).

## [4.2.4] - 2020-10-29

### Improved

  - Upgrade dependencies to remove npm vulnerability warnings.

## [4.2.3] - 2020-04-12

### Added

  - Unhandled rejection handler now handles possibility of being called more than once before process shutdown is complete.

## [4.2.2] - 2020-04-12

### Changed

  - Ignore QUIET environment variable in unhandled rejection handler so messages always display before a crash.

## [4.2.1] - 2020-04-12

### Changed

  - Now crashes after shutting down the Pebble process on unhandled rejections.

## [4.2.0] - 2020-04-12

### Added

  - Now automatically shuts down Pebble process if an unhandled rejection is detected.

## [4.1.0] - 2020-04-08

### Changed

  - Specify http://localhost:8888 as the default OCSP responder URL that’s added to certificates.

## [4.0.0] - 2020-04-07

### Changed

  - Breaking change: default environment variables are no longer customised. You must pass in custom variables manually.

### Fixed

  - Environment variables set in the outer process will now correctly apply to the Pebble server.

## [3.0.3] - 2020-04-07

### Fixed

  - Improve optional argument handling in `ready()` method.

## [3.0.2] - 2020-04-06

### Changed

  - Version bump to try and fix [npm publish bug with readme not appearing](https://npm.community/search?q=Unable%20to%20find%20a%20readme%20). No other changes.

## [3.0.1] - 2020-04-06

### Fixed

  - Make certificate path portable.

## [3.0.0] - 2020-04-06

### Changed

  - Breaking change: new API: `await Pebble.ready()`
  - The Pebble process itself (not the Pebble class) is now a singleton.

### Added

  - Automatic monkey patching of Node.js TLS module to accept Pebble certificates.
  - New method: `Pebble.shutdown()`

## [2.0.0] - 2020-04-05

### Changed

  - Breaking change: new asynchronous API

## [1.0.0] - 2020-04-05

Initial release.
