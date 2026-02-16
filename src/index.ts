export {
  getEquationOfTime,
  getTrueSolarTime,
  getTrueSolarTimeByRegionCode,
  getTrueSolarTimeDetail,
  getTrueSolarTimeDetailByRegionCode,
} from "./api";
export type { TrueSolarTimeOptions, TrueSolarTimeResult } from "./types";
export {
  CHINA_REGIONS,
  findRegionByCode,
  getChinaRegions,
  getRegionOptions,
} from "./regions";
export type { SolarRegion, SolarRegionOption } from "./regions";
