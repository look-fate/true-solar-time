import { describe, it, expect } from "vitest";
import {
  getEquationOfTime,
  getTrueSolarTime,
  getTrueSolarTimeDetail,
} from "../src/index";

// 辅助：创建北京时间 Date（UTC+8）
function bjTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0,
): Date {
  return new Date(
    Date.UTC(year, month - 1, day, hour - 8, minute, second),
  );
}

describe("getEquationOfTime", () => {
  it("1月中旬均时差约 -9 到 -10 分钟", () => {
    // 2024-01-15，天文表参考值约 -9.2 分钟
    const date = bjTime(2024, 1, 15, 12);
    const eot = getEquationOfTime(date);
    expect(eot).toBeCloseTo(-9.2, 0);
  });

  it("2月中旬均时差约 -14 分钟", () => {
    // 2024-02-12，天文表参考值约 -14.2 分钟
    const date = bjTime(2024, 2, 12, 12);
    const eot = getEquationOfTime(date);
    expect(eot).toBeCloseTo(-14.2, 0);
  });

  it("4月中旬均时差接近 0", () => {
    // 2024-04-15，天文表参考值约 0 分钟
    const date = bjTime(2024, 4, 15, 12);
    const eot = getEquationOfTime(date);
    expect(Math.abs(eot)).toBeLessThan(1.5);
  });

  it("11月初均时差约 +16 分钟", () => {
    // 2024-11-03，天文表参考值约 +16.4 分钟
    const date = bjTime(2024, 11, 3, 12);
    const eot = getEquationOfTime(date);
    expect(eot).toBeCloseTo(16.4, 0);
  });
});

describe("getTrueSolarTime", () => {
  it("经度 120°E 时经度修正为 0", () => {
    const date = bjTime(2024, 6, 21, 12);
    const result = getTrueSolarTimeDetail(date, 120);
    expect(result.lngOffset).toBe(0);
  });

  it("经度修正计算正确（上海 121.47°E）", () => {
    const result = getTrueSolarTimeDetail(bjTime(2024, 1, 1, 12), 121.47);
    // (121.47 - 120) * 4 = 5.88 分钟
    expect(result.lngOffset).toBeCloseTo(5.88, 2);
  });

  it("经度修正计算正确（成都 104.07°E）", () => {
    const result = getTrueSolarTimeDetail(bjTime(2024, 1, 1, 12), 104.07);
    // (104.07 - 120) * 4 = -63.72 分钟
    expect(result.lngOffset).toBeCloseTo(-63.72, 2);
  });

  it("getTrueSolarTime 返回的 Date 与 Detail 一致", () => {
    const date = bjTime(2024, 7, 1, 14, 30);
    const simple = getTrueSolarTime(date, 116.4);
    const detail = getTrueSolarTimeDetail(date, 116.4);
    expect(simple.getTime()).toBe(detail.date.getTime());
  });

  it("totalOffset = eot + lngOffset", () => {
    const result = getTrueSolarTimeDetail(bjTime(2024, 3, 20, 8), 110);
    expect(result.totalOffset).toBeCloseTo(result.eot + result.lngOffset, 10);
  });

  it("支持通过 standardLongitude 适配非北京时间输入", () => {
    const date = new Date(Date.UTC(2024, 6, 1, 12, 0, 0));
    const result = getTrueSolarTimeDetail(date, 0, { standardLongitude: 0 });
    expect(result.lngOffset).toBe(0);
  });
});

describe("跨午夜场景", () => {
  it("西部城市晚间可能回退到前一天", () => {
    // 成都 104.07°E，经度修正约 -63.72 分钟
    // 北京时间 00:30，真太阳时应回退到前一天 23:xx
    const date = bjTime(2024, 6, 21, 0, 30);
    const result = getTrueSolarTimeDetail(date, 104.07);
    // 总偏移应为负值（经度修正 -63.72 + 均时差约 -1.5）
    expect(result.totalOffset).toBeLessThan(0);
    // 真太阳时应早于输入时间
    expect(result.date.getTime()).toBeLessThan(date.getTime());
  });
});

describe("输入校验", () => {
  it("无效日期应抛出异常", () => {
    const invalidDate = new Date("invalid");
    expect(() => getEquationOfTime(invalidDate)).toThrow(TypeError);
    expect(() => getTrueSolarTime(invalidDate, 120)).toThrow(TypeError);
  });

  it("非法经度应抛出异常", () => {
    const date = bjTime(2024, 1, 1, 12);
    expect(() => getTrueSolarTime(date, Number.NaN)).toThrow(TypeError);
    expect(() => getTrueSolarTime(date, 200)).toThrow(RangeError);
  });

  it("非法 standardLongitude 应抛出异常", () => {
    const date = bjTime(2024, 1, 1, 12);
    expect(() =>
      getTrueSolarTimeDetail(date, 120, { standardLongitude: Number.POSITIVE_INFINITY }),
    ).toThrow(TypeError);
    expect(() =>
      getTrueSolarTimeDetail(date, 120, { standardLongitude: -200 }),
    ).toThrow(RangeError);
  });
});
