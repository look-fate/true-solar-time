export interface SolarRegion {
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
  { code: "CN-BJ-BEIJING", province: "北京", city: "北京", longitude: 116.4 },
  { code: "CN-TJ-TIANJIN", province: "天津", city: "天津", longitude: 117.2 },
  { code: "CN-SH-SHANGHAI", province: "上海", city: "上海", longitude: 121.47 },
  { code: "CN-CQ-CHONGQING", province: "重庆", city: "重庆", longitude: 106.55 },
  {
    code: "CN-HE-SHIJIAZHUANG",
    province: "河北",
    city: "石家庄",
    longitude: 114.52,
  },
  { code: "CN-HE-TANGSHAN", province: "河北", city: "唐山", longitude: 118.18 },
  { code: "CN-SX-TAIYUAN", province: "山西", city: "太原", longitude: 112.55 },
  {
    code: "CN-NM-HUHEHAOTE",
    province: "内蒙古",
    city: "呼和浩特",
    longitude: 111.65,
  },
  { code: "CN-LN-SHENYANG", province: "辽宁", city: "沈阳", longitude: 123.43 },
  { code: "CN-LN-DALIAN", province: "辽宁", city: "大连", longitude: 121.62 },
  { code: "CN-JL-CHANGCHUN", province: "吉林", city: "长春", longitude: 125.32 },
  {
    code: "CN-HLJ-HAERBIN",
    province: "黑龙江",
    city: "哈尔滨",
    longitude: 126.63,
  },
  { code: "CN-JS-NANJING", province: "江苏", city: "南京", longitude: 118.8 },
  { code: "CN-JS-SUZHOU", province: "江苏", city: "苏州", longitude: 120.58 },
  { code: "CN-ZJ-HANGZHOU", province: "浙江", city: "杭州", longitude: 120.16 },
  { code: "CN-ZJ-NINGBO", province: "浙江", city: "宁波", longitude: 121.55 },
  { code: "CN-AH-HEFEI", province: "安徽", city: "合肥", longitude: 117.23 },
  { code: "CN-FJ-FUZHOU", province: "福建", city: "福州", longitude: 119.3 },
  { code: "CN-FJ-XIAMEN", province: "福建", city: "厦门", longitude: 118.1 },
  { code: "CN-JX-NANCHANG", province: "江西", city: "南昌", longitude: 115.86 },
  { code: "CN-SD-JINAN", province: "山东", city: "济南", longitude: 117.12 },
  { code: "CN-SD-QINGDAO", province: "山东", city: "青岛", longitude: 120.38 },
  { code: "CN-HA-ZHENGZHOU", province: "河南", city: "郑州", longitude: 113.62 },
  { code: "CN-HB-WUHAN", province: "湖北", city: "武汉", longitude: 114.31 },
  { code: "CN-HN-CHANGSHA", province: "湖南", city: "长沙", longitude: 112.93 },
  { code: "CN-GD-GUANGZHOU", province: "广东", city: "广州", longitude: 113.27 },
  { code: "CN-GD-SHENZHEN", province: "广东", city: "深圳", longitude: 114.06 },
  { code: "CN-GX-NANNING", province: "广西", city: "南宁", longitude: 108.32 },
  { code: "CN-GX-GUILIN", province: "广西", city: "桂林", longitude: 110.29 },
  { code: "CN-HI-HAIKOU", province: "海南", city: "海口", longitude: 110.35 },
  { code: "CN-HI-SANYA", province: "海南", city: "三亚", longitude: 109.51 },
  { code: "CN-SC-CHENGDU", province: "四川", city: "成都", longitude: 104.07 },
  { code: "CN-GZ-GUIYANG", province: "贵州", city: "贵阳", longitude: 106.63 },
  { code: "CN-YN-KUNMING", province: "云南", city: "昆明", longitude: 102.71 },
  { code: "CN-XZ-LASA", province: "西藏", city: "拉萨", longitude: 91.11 },
  { code: "CN-SN-XIAN", province: "陕西", city: "西安", longitude: 108.94 },
  { code: "CN-GS-LANZHOU", province: "甘肃", city: "兰州", longitude: 103.82 },
  { code: "CN-QH-XINING", province: "青海", city: "西宁", longitude: 101.78 },
  { code: "CN-NX-YINCHUAN", province: "宁夏", city: "银川", longitude: 106.23 },
  {
    code: "CN-XJ-WULUMUQI",
    province: "新疆",
    city: "乌鲁木齐",
    longitude: 87.62,
  },
  { code: "CN-HK-HONGKONG", province: "香港", city: "香港", longitude: 114.17 },
  { code: "CN-MO-MACAO", province: "澳门", city: "澳门", longitude: 113.54 },
  { code: "CN-TW-TAIBEI", province: "台湾", city: "台北", longitude: 121.56 },
] as const;

function buildRegionName(province: string, city: string): string {
  return province === city ? city : `${province}·${city}`;
}

export const CHINA_REGIONS: readonly SolarRegion[] = CHINA_REGION_DATA.map(
  (item) => ({
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
  const region = CHINA_REGIONS.find((item) => item.code === code);
  return region ? { ...region } : undefined;
}
