/** 真太阳时计算结果详情 */
export interface TrueSolarTimeResult {
  /** 真太阳时 */
  date: Date;
  /** 均时差（分钟） */
  eot: number;
  /** 经度时差（分钟） */
  lngOffset: number;
  /** 总偏移（分钟） */
  totalOffset: number;
}

/** 真太阳时计算配置 */
export interface TrueSolarTimeOptions {
  /**
   * 输入时间所属时区的标准经线（单位：度）
   * 例如：UTC+8 为 120，UTC 为 0
   */
  standardLongitude?: number;
}
