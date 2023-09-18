export const COLUMN_VALUE_JOIN_LABEL = '_!!_^^_#_';

export type ICacheCheckAttributesByIdResult = Record<
  string,
  {
    label: string;
    value: string;
    parent_id: string;
    parent_name: string;
  }[]
>;

export const generateColumnRowItemData = (value: string, label: string) =>
  `${value}${COLUMN_VALUE_JOIN_LABEL}${label}`;
export const getValueAndLabelDataFromColumnRowItem = (str: string) =>
  (str || COLUMN_VALUE_JOIN_LABEL).split(COLUMN_VALUE_JOIN_LABEL);
export const isEqualByColumnRowItem = (value: string, other: string) => {
  const [realValue] = getValueAndLabelDataFromColumnRowItem(value);
  const [realOther] = getValueAndLabelDataFromColumnRowItem(other);

  return realValue === realOther;
};

export const skuCacheManage = {
  /**
   * 储存合并的表格行的计算结果
   * 空间换时间
   *
   * ===> {
   * 3db483e73f0522634b7c0c1eca8484ae: {0: 1}
   * 13f5f612febb47ff507087b2f65f71cc: {0: 1}
   * 519f7baa04b66d327106a2004b25a94b: {0: 1}
   * }
   */
  cacheDescarteItemRowSpanResultMap: new Map(),

  // 缓存生成的 sku table columns 的结果
  // 储存当前生成的 antd table columns 的数据
  cacheTableColumnsResultMap: new Map(),

  // 缓存勾选规格属性的结果，用于生成比对
  cacheCheckAttributesByIdResultMap: new Map<string, ICacheCheckAttributesByIdResult[0]>(),
};

export const clearSkuTableDataCache = () => {
  skuCacheManage.cacheDescarteItemRowSpanResultMap.clear();
  skuCacheManage.cacheTableColumnsResultMap.clear();
};

export const clearCheckAttributesCache = () => {
  skuCacheManage.cacheCheckAttributesByIdResultMap.clear();
};

export const joinColumnValueJoinLabelMark = (str: string) => `${str}${COLUMN_VALUE_JOIN_LABEL}`;
