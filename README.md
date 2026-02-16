# true-solar-time

基于 Jean Meeus 天文算法的真太阳时计算库。通过均时差（Equation of Time）+ 经度修正，将标准时转换为当地真太阳时（默认按北京时间标准经线 120°E）。

## 安装

```bash
npm install true-solar-time
```

## 使用

```ts
import { getTrueSolarTime, getTrueSolarTimeDetail, getEquationOfTime } from 'true-solar-time'

// 北京时间 2024-01-01 12:00，上海经度 121.47°E
const date = new Date('2024-01-01T04:00:00Z') // UTC 时间

// 简单用法：直接获取真太阳时
const solarTime = getTrueSolarTime(date, 121.47)
console.log(solarTime) // 2024-01-01T04:02:56.098Z

// 详细结果：包含各项偏移量
const detail = getTrueSolarTimeDetail(date, 121.47)
console.log(detail)
// {
//   date: 2024-01-01T04:02:56.098Z,
//   eot: -2.95,        // 均时差（分钟）
//   lngOffset: 5.88,   // 经度时差（分钟）
//   totalOffset: 2.93  // 总偏移（分钟）
// }

// 单独获取均时差
const eot = getEquationOfTime(date)
console.log(eot) // -2.95（分钟）

// 非北京时间输入：可指定标准经线（例如 UTC 使用 0°）
const utcDetail = getTrueSolarTimeDetail(date, 0, { standardLongitude: 0 })
console.log(utcDetail.lngOffset) // 0
```

## API

### `getTrueSolarTime(date: Date, longitude: number, options?: TrueSolarTimeOptions): Date`

计算真太阳时，返回 Date 对象。

- `date` — 输入时间（Date 对象，内部使用 UTC 分量计算）
- `longitude` — 当地经度，东经为正（如上海 121.47，成都 104.07）
- `options.standardLongitude` — 输入时间所属时区标准经线（默认 `120`）

### `getTrueSolarTimeDetail(date: Date, longitude: number, options?: TrueSolarTimeOptions): TrueSolarTimeResult`

计算真太阳时，返回包含各项偏移量的详细结果。

```ts
interface TrueSolarTimeResult {
  date: Date        // 真太阳时
  eot: number       // 均时差（分钟）
  lngOffset: number // 经度时差（分钟）
  totalOffset: number // 总偏移（分钟）
}

interface TrueSolarTimeOptions {
  standardLongitude?: number // 输入时间所属时区标准经线（度）
}
```

### `getEquationOfTime(date: Date): number`

计算均时差（Equation of Time），返回值单位为分钟。正值表示真太阳时快于平太阳时。

## 原理

```
真太阳时 = 标准时 + 经度修正 + 均时差
```

- 经度修正 = (当地经度 - 标准经线) × 4 分钟/度
- 均时差由太阳赤经与平太阳经度之差计算，基于儒略日和太阳轨道参数
- 默认标准经线为 120°E（北京时间），可通过 `options.standardLongitude` 覆盖

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

## 开发

```bash
npm run build   # 构建（ESM + CJS 双输出）
npm test        # 运行测试
npm run typecheck # TS 类型检查
npm run check   # typecheck + test + build
```

## License

MIT
