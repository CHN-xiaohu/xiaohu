// // 店铺供货价的校验处理
// export const verifyStoreSupplyPrice = (
//   value: number,
//   diffValue: {
//     // 供货商品最低零售价
//     lowerSalePrice: number;
//     // 分销商品零售价
//     salePrice: number;
//   },
// ) => {
//   // return value < diffValue.lowerSalePrice
//   //   ? `不能低于 ${diffValue.lowerSalePrice} 元`
//   //   : value > diffValue.salePrice
//   //   ? '不能高于当前零售价'
//   //   : '';

//   console.log('diffValue', diffValue);
//   return value < diffValue.lowerSalePrice
//     ? `${diffValue.lowerSalePrice}~${diffValue.salePrice}`
//     : value > diffValue.salePrice
//     ? `${diffValue.lowerSalePrice}~${diffValue.salePrice}`
//     : '';
// };

// export const verifySalePricePrice = (
//   value: number,
//   diffValue: {
//     // 供货商品最低零售价
//     lowerSalePrice: number;
//     // 分销商品店铺供货价
//     storeSupplyPrice: number;
//   },
// ) => {
//   console.log('0000', diffValue);
//   console.log('value', value);
//   return value < diffValue.lowerSalePrice
//     ? `不能低于 ${diffValue.lowerSalePrice} 元`
//     : value < diffValue.storeSupplyPrice
//     ? '不能小于当前店铺供货价'
//     : '';
// };

// export const verifyPurchasePriceAndVipPurchasePrice = (
//   value: number,
//   diffValue: {
//     // 供货商品建议零售价
//     lowerSalePrice: string;
//     // 供货商品供货价
//     supplyPrice: string;
//   },
// ) => {
//   console.log('diffValue2222', diffValue);
//   // return value < parseFloat(diffValue.lowerSalePrice)
//   //   ? `不能低于 ${diffValue.lowerSalePrice} 元`
//   //   : '';
//   return value < parseFloat(diffValue.supplyPrice)
//     ? `${diffValue.supplyPrice}~${diffValue.lowerSalePrice}`
//     : value > parseFloat(diffValue.lowerSalePrice)
//     ? `${diffValue.supplyPrice}~${diffValue.lowerSalePrice}`
//     : '';
// };

// 店铺供货价的校验处理
export const verifyStoreSupplyPrice = (
  value: number,
  diffValue: {
    // 供货商品最低零售价
    lowerSalePrice: number;
    // 分销商品零售价
    salePrice: number;
  },
) => {
  return value < diffValue.salePrice
    ? `${diffValue.salePrice}~${diffValue.lowerSalePrice}`
    : value > diffValue.lowerSalePrice
    ? `${diffValue.salePrice}~${diffValue.lowerSalePrice}`
    : '';
};

export const verifySalePricePrice = (
  value: number,
  diffValue: {
    // 供货商品最低零售价
    lowerSalePrice: number;
    // 分销商品店铺供货价
    storeSupplyPrice: number;
  },
) => {
  return value < diffValue.lowerSalePrice
    ? `不能低于 ${diffValue.lowerSalePrice} 元`
    : value < diffValue.storeSupplyPrice
    ? '不能小于当前店铺供货价'
    : '';
};

export const verifyPurchasePriceAndVipPurchasePrice = (
  value: number,
  diffValue: {
    // 建议零售价
    lowerSalePrice: string;
    // 供货价
    supplyPrice: string;
  },
) => {
  return value < parseFloat(diffValue.supplyPrice)
    ? `${diffValue.supplyPrice}~${diffValue.lowerSalePrice}`
    : value > parseFloat(diffValue.lowerSalePrice)
    ? `${diffValue.supplyPrice}~${diffValue.lowerSalePrice}`
    : '';
};
