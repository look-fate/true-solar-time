import { getEquationOfTimeByDate } from "./internal/astronomy";
import { applyMinuteOffset, calculateOffsets } from "./internal/offset";
import { assertValidDate } from "./internal/validation";
import { findRegionByCode } from "./regions";
import type { TrueSolarTimeOptions, TrueSolarTimeResult } from "./types";
import type { SolarRegion } from "./regions";

function resolveRegionByCode(regionCode: string): SolarRegion {
  if (typeof regionCode !== "string" || regionCode.trim() === "") {
    throw new TypeError("regionCode 必须是非空字符串");
  }

  const region = findRegionByCode(regionCode);
  if (!region) {
    throw new RangeError(`未找到地区编码: ${regionCode}`);
  }
  return region;
}

/**
 * 计算均时差（Equation of Time）
 * @param date - 输入日期（UTC 或本地时间均可，内部使用 UTC）
 * @returns 均时差，单位：分钟。正值表示真太阳时快于平太阳时
 */
export function getEquationOfTime(date: Date): number {
  assertValidDate(date);
  return getEquationOfTimeByDate(date);
}

/**
 * 计算真太阳时
 * @param date - 输入时刻（Date 对象）
 * @param longitude - 当地经度（东经为正，如上海 121.47）
 * @param options - 可选项，standardLongitude 用于指定输入时间所属时区标准经线
 * @returns 真太阳时 Date 对象
 */
export function getTrueSolarTime(
  date: Date,
  longitude: number,
  options?: TrueSolarTimeOptions,
): Date {
  const { totalOffset } = calculateOffsets(date, longitude, options);
  return applyMinuteOffset(date, totalOffset);
}

/**
 * 计算真太阳时（详细结果）
 * @param date - 输入时刻（Date 对象）
 * @param longitude - 当地经度（东经为正，如上海 121.47）
 * @param options - 可选项，standardLongitude 用于指定输入时间所属时区标准经线
 * @returns 包含各项偏移量的详细结果
 */
export function getTrueSolarTimeDetail(
  date: Date,
  longitude: number,
  options?: TrueSolarTimeOptions,
): TrueSolarTimeResult {
  const { eot, lngOffset, totalOffset } = calculateOffsets(
    date,
    longitude,
    options,
  );

  return {
    date: applyMinuteOffset(date, totalOffset),
    eot,
    lngOffset,
    totalOffset,
  };
}

/**
 * 按地区编码计算真太阳时
 * @param date - 输入时刻（Date 对象）
 * @param regionCode - 地区编码（如 CN-SH-SHANGHAI）
 * @returns 真太阳时 Date 对象
 */
export function getTrueSolarTimeByRegionCode(
  date: Date,
  regionCode: string,
): Date {
  const region = resolveRegionByCode(regionCode);
  return getTrueSolarTime(date, region.longitude, {
    standardLongitude: region.standardLongitude,
  });
}

/**
 * 按地区编码计算真太阳时（详细结果）
 * @param date - 输入时刻（Date 对象）
 * @param regionCode - 地区编码（如 CN-SH-SHANGHAI）
 * @returns 包含各项偏移量的详细结果
 */
export function getTrueSolarTimeDetailByRegionCode(
  date: Date,
  regionCode: string,
): TrueSolarTimeResult {
  const region = resolveRegionByCode(regionCode);
  return getTrueSolarTimeDetail(date, region.longitude, {
    standardLongitude: region.standardLongitude,
  });
}
