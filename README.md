# true-solar-time

基于 Jean Meeus 天文算法的真太阳时计算库。  
通过“均时差（Equation of Time）+ 经度修正”，将标准时换算为当地真太阳时。

- 默认标准经线：`120°E`（UTC+8，北京时间）
- 适用于任意经度，支持自定义标准经线（如 UTC 的 `0°`）

## 适用场景

- 需要把标准时换算为地方真太阳时
- 八字、历法、天文教育等需要“真太阳时校正”的场景
- 需要拆分查看均时差与经度修正量

## 安装

```bash
npm install true-solar-time
```

## 快速开始

```ts
import {
  getChinaRegions,
  getEquationOfTime,
  getRegionOptions,
  getTrueSolarTime,
  getTrueSolarTimeDetail,
} from "true-solar-time";

// 示例：北京时间 2026-02-16 15:00:00，地点上海（121.47°E）
// 注意这里带上 +08:00，避免时区歧义
const input = new Date("2026-02-16T15:00:00+08:00");

// 1) 直接获取真太阳时
const solarTime = getTrueSolarTime(input, 121.47);
console.log(solarTime.toISOString());

// 2) 获取详细偏移量
const detail = getTrueSolarTimeDetail(input, 121.47);
console.log(detail);
// {
//   date: Date,        // 真太阳时
//   eot: number,       // 均时差（分钟）
//   lngOffset: number, // 经度修正（分钟）
//   totalOffset: number // 总偏移（分钟）= eot + lngOffset
// }

// 3) 单独获取均时差（分钟）
const eot = getEquationOfTime(input);
console.log(eot);

// 4) 导出地区数据（可直接给前端）
const regionOptions = getRegionOptions();
// [
//   {
//     label: "上海",
//     value: "CN-SH-SHANGHAI",
//     longitude: 121.47,
//     standardLongitude: 120
//   },
//   ...
// ]

const regions = getChinaRegions();
// [
//   {
//     code: "CN-BJ-BEIJING",
//     country: "中国",
//     province: "北京",
//     city: "北京",
//     name: "北京",
//     longitude: 116.4,
//     timezone: "Asia/Shanghai",
//     standardLongitude: 120
//   },
//   ...
// ]
```

## API 概览

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getTrueSolarTime(date, longitude, options?)` | `Date` | 返回真太阳时 |
| `getTrueSolarTimeDetail(date, longitude, options?)` | `TrueSolarTimeResult` | 返回真太阳时 + 偏移拆分 |
| `getEquationOfTime(date)` | `number` | 返回均时差（分钟） |
| `getChinaRegions()` | `SolarRegion[]` | 返回中国地区列表（含经度） |
| `getRegionOptions()` | `SolarRegionOption[]` | 返回前端 Select 可直接使用的选项 |
| `findRegionByCode(code)` | `SolarRegion \| undefined` | 按地区编码查询 |

## API 详情

### `getTrueSolarTime(date: Date, longitude: number, options?: TrueSolarTimeOptions): Date`

计算真太阳时并返回 `Date` 对象。

- `date`: 输入时刻（`Date`）
- `longitude`: 当地经度（东经为正，西经为负）
- `options.standardLongitude`: 输入时间所属时区的标准经线，默认 `120`

### `getTrueSolarTimeDetail(date: Date, longitude: number, options?: TrueSolarTimeOptions): TrueSolarTimeResult`

计算真太阳时并返回偏移拆分结果。

```ts
interface TrueSolarTimeResult {
  date: Date;        // 真太阳时
  eot: number;       // 均时差（分钟）
  lngOffset: number; // 经度修正（分钟）
  totalOffset: number; // 总偏移（分钟）
}
```

### `getEquationOfTime(date: Date): number`

计算均时差（分钟）。  
返回值为正，表示真太阳时快于平太阳时。

### `TrueSolarTimeOptions`

```ts
interface TrueSolarTimeOptions {
  standardLongitude?: number; // 标准经线（度）
}
```

### `getChinaRegions(): SolarRegion[]`

返回中国常用地区数据（含省份、城市、经度、时区、标准经线）。  
适合前端地区联动、后端参数校验或默认值回填。

### `getRegionOptions(): SolarRegionOption[]`

返回轻量化下拉选项：

```ts
interface SolarRegionOption {
  label: string;
  value: string;
  longitude: number;
  standardLongitude: number;
}
```

### `findRegionByCode(code: string): SolarRegion | undefined`

按地区编码查询单个地区，可用于回显与反查经度。

## 时区与输入说明

`Date` 在 JS 中表示绝对时间戳，不存储“北京时间/本地时间”标签。  
建议始终使用带时区偏移的 ISO 字符串或 `Date.UTC(...)` 构造输入：

- 推荐：`new Date("2026-02-16T15:00:00+08:00")`
- 推荐：`new Date(Date.UTC(2026, 1, 16, 7, 0, 0))`
- 谨慎：`new Date("2026-02-16 15:00:00")`（运行环境解析可能不一致）

## 计算原理

```text
真太阳时 = 标准时 + 经度修正 + 均时差
```

- 经度修正：`(当地经度 - 标准经线) × 4 分钟/度`
- 均时差：由太阳赤经与平太阳经度差计算，基于儒略日与太阳轨道参数
- 默认标准经线：`120°E`（可通过 `standardLongitude` 覆盖）

## 输入校验

以下情况会抛出错误：

- `date` 不是有效 `Date`：抛 `TypeError`
- `longitude` 或 `standardLongitude` 不是有限数字：抛 `TypeError`
- `longitude` 或 `standardLongitude` 超出 `[-180, 180]`：抛 `RangeError`

## 常用城市经度参考

| 城市 | 经度 |
|------|------|
| 北京 | 116.40 |
| 上海 | 121.47 |
| 广州 | 113.26 |
| 成都 | 104.07 |
| 西安 | 108.94 |
| 哈尔滨 | 126.63 |
| 乌鲁木齐 | 87.62 |

## 精度与边界

- 本库面向工程与应用层换算场景
- 结果通常可满足分钟级、秒级时间校正需求
- 若用于天文观测或法律计时等高精度场景，请结合权威天文历表复核

## 本地开发

```bash
npm run typecheck
npm test
npm run build
npm run check
```

## License

MIT
