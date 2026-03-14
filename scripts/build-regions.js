const fs = require('fs');
const path = require('path');

const header = `export interface SolarRegion {
  /** 地区编码，适合作为前端 value */
  code: string;
  /** 国家名称 */
  country: string;
  /** 省级地区 */
  province: string;
  /** 城市名称 */
  city: string;
  /** 展示名称 */
  name: string;
  /** 经度（东经为正，西经为负） */
  longitude: number;
  /** IANA 时区标识 */
  timezone: string;
  /** 对应时区标准经线 */
  standardLongitude: number;
}

export interface SolarRegionOption {
  /** 前端展示文案 */
  label: string;
  /** 前端值 */
  value: string;
  /** 经度 */
  longitude: number;
  /** 标准经线 */
  standardLongitude: number;
}

interface RawRegion {
  code: string;
  province: string;
  city: string;
  longitude: number;
}

const CN_STANDARD_LONGITUDE = 120;
const CN_TIMEZONE = "Asia/Shanghai";
const CN_COUNTRY = "中国";

const CHINA_REGION_DATA: readonly RawRegion[] = [
`;

const footer = `] as const;

function buildRegionName(province: string, city: string): string {
  return province === city ? city : \`\${province}·\${city}\`;
}

const BUILT_CHINA_REGIONS = CHINA_REGION_DATA.map((item) =>
  Object.freeze({
    code: item.code,
    country: CN_COUNTRY,
    province: item.province,
    city: item.city,
    name: buildRegionName(item.province, item.city),
    longitude: item.longitude,
    timezone: CN_TIMEZONE,
    standardLongitude: CN_STANDARD_LONGITUDE,
  }),
);

export const CHINA_REGIONS: readonly Readonly<SolarRegion>[] = Object.freeze(
  BUILT_CHINA_REGIONS,
);

const CHINA_REGION_MAP: ReadonlyMap<string, Readonly<SolarRegion>> = new Map(
  CHINA_REGIONS.map((region) => [region.code, region]),
);

/**
 * 获取中国地区列表（返回副本，便于前端直接二次处理）
 */
export function getChinaRegions(): SolarRegion[] {
  return CHINA_REGIONS.map((region) => ({ ...region }));
}

/**
 * 获取前端可直接用于 Select 的地区选项
 */
export function getRegionOptions(): SolarRegionOption[] {
  return CHINA_REGIONS.map((region) => ({
    label: region.name,
    value: region.code,
    longitude: region.longitude,
    standardLongitude: region.standardLongitude,
  }));
}

/**
 * 按地区编码查询
 */
export function findRegionByCode(code: string): SolarRegion | undefined {
  const region = CHINA_REGION_MAP.get(code);
  return region ? { ...region } : undefined;
}
`;

const dataContent = fs.readFileSync(path.join(__dirname, 'all_regions.txt'), 'utf8');
const outputPath = path.join(__dirname, '..', 'src', 'regions.ts');

fs.writeFileSync(outputPath, header + dataContent + footer);
console.log(`已生成 ${outputPath}`);
