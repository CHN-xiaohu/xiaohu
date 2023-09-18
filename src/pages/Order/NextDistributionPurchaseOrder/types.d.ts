export type CartProductItem = {
  buyNum: number;
  id: string;
  product: {
    id: string;
    image: string;
    minimumSale: number;
    originMinimumSale: number;
    originPrice: number;
    skuGroup: string;
    sku_name_map: string[];
    sku_value_map: string[];
    stock_num: number;
  };
  productInfo: {
    chargeUnit: {
      attrResult: string;
      attrs: { attrName: string; attrUnitName: string; attrVal: number }[];
      chargeUnitId: number;
      chargeUnitName: string;
      chargeWay: number;
      chargeWayName: string;
      formula: string;
    };
  };
  supplyPrice: number;
};

export type OnProductChangeParamType = {
  data: CartProductItem[];
  isSkuChange?: boolean;
  isUpdate?: boolean;
  isDeleted?: boolean;
  isFromChooseCommodityModal?: boolean;
};

export type OnProductChangeType = (v: OnProductChangeParamType) => void;
