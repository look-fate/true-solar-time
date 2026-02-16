import { COSEPS, SINEPS, TWO_PI } from "./constants";
import { assertValidDate } from "./validation";

function fpart(x: number): number {
  x = x - Math.floor(x);
  if (x < 0) x += 1;
  return x;
}

/** 计算太阳赤经（小时） */
function sunRightAscensionHours(t: number): number {
  const m = TWO_PI * fpart(0.993133 + 99.997361 * t);
  const dL = 6893 * Math.sin(m) + 72 * Math.sin(2 * m);
  const L = TWO_PI * fpart(0.7859453 + m / TWO_PI + (6191.2 * t + dL) / 1296000);

  const sl = Math.sin(L);
  const x = Math.cos(L);
  const y = COSEPS * sl;
  const z = SINEPS * sl;
  const rho = Math.sqrt(1 - z * z);

  let ra = (48 / TWO_PI) * Math.atan2(y, x + rho);
  if (ra < 0) ra += 24;
  return ra;
}

/** 将日期转换为儒略日 */
function toJulianDate(date: Date): number {
  assertValidDate(date);

  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const min = date.getUTCMinutes();
  const sec = date.getUTCSeconds();
  const ms = date.getUTCMilliseconds();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  let jd =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5;
  jd += (hour + min / 60 + (sec + ms / 1000) / 3600) / 24;

  return jd;
}

export function getEquationOfTimeByDate(date: Date): number {
  const jd = toJulianDate(date);
  const mjd = jd - 2400000.5;
  const t = (mjd - 51544.5) / 36525;
  const ra = sunRightAscensionHours(t);

  // 平太阳经度（度 -> 小时）
  let L0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  L0 = ((L0 % 360) + 360) % 360;
  const meanSun = L0 / 15.0;

  let eotHours = meanSun - ra;
  while (eotHours > 12) eotHours -= 24;
  while (eotHours < -12) eotHours += 24;

  return eotHours * 60;
}
