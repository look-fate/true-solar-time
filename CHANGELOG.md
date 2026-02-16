# Changelog

All notable changes to this project will be documented in this file.

## 1.1.0 - 2026-02-16

### Added
- Added `getTrueSolarTimeByRegionCode(date, regionCode)` for direct calculation by region code.
- Added `getTrueSolarTimeDetailByRegionCode(date, regionCode)` for detailed offset breakdown by region code.
- Added tests for region-code APIs, cross-realm `Date` support, historical date handling, and runtime immutability of `CHINA_REGIONS`.

### Changed
- Improved date validation to support cross-realm `Date` objects.
- Updated Julian day conversion to use Gregorian correction from `1582-10-15` onward and Julian rule before that date.
- Made `CHINA_REGIONS` runtime immutable and optimized `findRegionByCode` using a `Map`.
- Updated README with new APIs, input validation cases, and calendar boundary behavior.
