import { LONGITUDE_MAX, LONGITUDE_MIN } from "./constants";

export function assertValidDate(date: unknown): asserts date is Date {
  if (!(date instanceof Date)) {
    throw new TypeError("date 必须是有效的 Date 对象");
  }
  if (Number.isNaN(date.getTime())) {
    throw new TypeError("date 必须是有效的 Date 对象");
  }
}

export function assertLongitude(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} 必须是有限数字`);
  }
  if (value < LONGITUDE_MIN || value > LONGITUDE_MAX) {
    throw new RangeError(
      `${name} 必须在 ${LONGITUDE_MIN} 到 ${LONGITUDE_MAX} 之间`,
    );
  }
}
