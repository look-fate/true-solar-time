import { LONGITUDE_MAX, LONGITUDE_MIN } from "./constants";

function isDateObject(value: unknown): value is Date {
  return Object.prototype.toString.call(value) === "[object Date]";
}

export function assertValidDate(date: unknown): asserts date is Date {
  if (!isDateObject(date)) {
    throw new TypeError("date 必须是有效的 Date 对象");
  }

  let timeValue: number;
  try {
    timeValue = Date.prototype.getTime.call(date);
  } catch {
    throw new TypeError("date 必须是有效的 Date 对象");
  }

  if (Number.isNaN(timeValue)) {
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
