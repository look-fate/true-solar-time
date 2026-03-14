# Changelog

All notable changes to this project will be documented in this file.

## 1.2.1 - 2026-03-14

### Fixed
- 移除了错误导入的非中国城市数据
- 现在只包含 4063 个中国城市（之前错误包含了全球城市）

## 1.2.0 - 2026-03-14

### Added
- 扩展城市数据库从 46 个到 6884 个中国城市
- 新增覆盖全国各省市县的完整经纬度数据
- 数据来源于 moira_macOS 项目的完整城市数据库

### Changed
- 城市编码格式优化为 `CN-{省份缩写}-{序号}`
- 保持所有 API 接口向后兼容

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
