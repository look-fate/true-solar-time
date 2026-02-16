import {
  DEFAULT_STANDARD_LONGITUDE,
  MINUTE_MS,
} from "./constants";
import { getEquationOfTimeByDate } from "./astronomy";
import { assertLongitude, assertValidDate } from "./validation";
import type { TrueSolarTimeOptions, TrueSolarTimeResult } from "../types";

function resolveStandardLongitude(options?: TrueSolarTimeOptions): number {
  const standardLongitude =
    options?.standardLongitude ?? DEFAULT_STANDARD_LONGITUDE;
  assertLongitude("standardLongitude", standardLongitude);
  return standardLongitude;
}

export function calculateOffsets(
  date: Date,
  longitude: number,
  options?: TrueSolarTimeOptions,
): Pick<TrueSolarTimeResult, "eot" | "lngOffset" | "totalOffset"> {
  assertValidDate(date);
  assertLongitude("longitude", longitude);

  const standardLongitude = resolveStandardLongitude(options);
  const eot = getEquationOfTimeByDate(date);
  const lngOffset = (longitude - standardLongitude) * 4;
  const totalOffset = lngOffset + eot;

  return { eot, lngOffset, totalOffset };
}

export function applyMinuteOffset(date: Date, offsetMinutes: number): Date {
  return new Date(date.getTime() + offsetMinutes * MINUTE_MS);
}
