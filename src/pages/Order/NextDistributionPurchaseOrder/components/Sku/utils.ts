import type { IncomingMessage } from 'http';

import { ECommerceCommodityPriceCalculation } from '@/utils/Money';
import { MathCalcic } from '@spark-build/web-utils';
import { useEventEmitter } from 'ahooks';

// 是否是面积
export const isArea = (attrResult: string) => attrResult === '面积';

export const generateSkuMessageField = (name: React.Key) => `message_${name}`;

// 是否非标准计价
export const isNonStandard = (chargeWay: number) => chargeWay !== 1;

// 是否未上架
export const isNotShelves = (state: number) => state === 2;

export const getNonStandard = (attrResult: string, attrs: any) =>
  isArea(attrResult)
    ? ECommerceCommodityPriceCalculation(
        new MathCalcic(attrs[0].attrVal || 1).multipliedBy(attrs[1].attrVal || 1).toNumber(),
      )
    : attrs![0].attrVal;

export const useSkuPanelEvent = () => {
  return useEventEmitter();
};

export const useSkuPanelSkuChangeEvent = () => {
  return useEventEmitter();
};

// @see https://www.tapd.cn/23571741/bugtrace/bugs/view/1123571741001005894
export const getNonStandardText = (attrResult: string, attrs: any) =>
  isArea(attrResult)
    ? attrs!.reduce((p, c) => [...p, c?.attrVal], [] as React.Key[]).join('x')
    : attrs![0]?.attrVal;

export const getOrderUnit = (attrs: any) =>
  attrs.length > 1
    ? `（${attrs!.reduce((p, c) => [...p, c?.attrVal], [] as React.Key[]).join('*')}）`
    : attrs![0]?.attrVal;

export const isBrowser = typeof window !== 'undefined';

const StoreInstanceSymbol = Symbol('MST_StoreInstance');

export const getMstStoreInstance = () => (isBrowser ? window[StoreInstanceSymbol] : {});

// 从页面的 __NEXT_DATA__ 中获取应用初始化的数据
export const getAppInitialPropsByNextData = () => {
  if (isBrowser) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const __NEXT_DATA__Node = document.querySelector('#__NEXT_DATA__') as HTMLScriptElement;
      const data = JSON.parse(__NEXT_DATA__Node.innerText);

      return data.props.initialProps;
    } catch {
      //
    }
  }

  return {};
};

export const calcProductPrice = ({
  price,
  buyNumber,
  nonStandardValue = 1,
}: {
  price: number | string;
  buyNumber: number;
  nonStandardValue?: number | string;
}) => {
  return new MathCalcic(price).multipliedBy(buyNumber).multipliedBy(nonStandardValue).toNumber();
};

export const calcProductPriceByValuation = (
  price: React.Key,
  data: any,
  // 无需进行非标计价的起售运算
  notCalcStartingSaleByNonStandard = false,
) => {
  let nonStandardValue = 1 as string | number;
  let buyNumber = data.buyNum || 1;

  // 如果是非标准计价
  if (isNonStandard(data.productInfo.chargeUnit.chargeWay)) {
    const cNonStandardValue =
      getNonStandard(data.productInfo.chargeUnit.attrResult, data.productInfo.chargeUnit.attrs!) ||
      1;

    if (!notCalcStartingSaleByNonStandard) {
      const minimumSale = Number(data.product.originMinimumSale || 1);
      nonStandardValue = minimumSale > cNonStandardValue ? minimumSale : cNonStandardValue;
    } else {
      nonStandardValue = cNonStandardValue;
    }
  } else if (buyNumber < (data?.product?.minimumSale || 0)) {
    // 如果是标准，那么就需要计算起售
    buyNumber = Number(data.product.minimumSale);
  }

  return calcProductPrice({
    price,
    buyNumber,
    nonStandardValue,
  });
};

export const calcShopCartProductPrice = (
  price: React.Key,
  data: any,
  // 无需进行非标计价运算
  notCalcNonStandard = false,
) => {
  return ECommerceCommodityPriceCalculation(
    calcProductPriceByValuation(price, data, notCalcNonStandard),
  );
};

export const getPriceByUserLevel = <
  F = {
    minVipPurchasePrice: React.Key;
    minPurchasePrice: React.Key;
  }
>({
  dataSource,
  isVip,
  priceFields = {
    vip: 'minVipPurchasePrice',
    default: 'minPurchasePrice',
  },
}: {
  dataSource: F;
  priceFields?: {
    vip: string;
    default: string;
  };
  isVip?: number;
}) => {
  if (isVip === undefined) {
    // eslint-disable-next-line no-param-reassign
    isVip =
      getAppInitialPropsByNextData()?.initialStoreState?.user?.hasVip ??
      getMstStoreInstance()?.user?.hasVip;
  }

  // 0 是金牌商家，所以显示会员价，1 是普通商家，所以显示普通采购价
  let price = (isVip === 0
    ? dataSource[priceFields.vip]
    : isVip === 1
    ? dataSource[priceFields.default]
    : dataSource[priceFields.default]) as undefined | React.Key;

  if (price === undefined) {
    return null;
  }

  price = parseFloat(String(price));

  return Number.isNaN(price) ? null : price;
};
export const SITE_SETTINGS = '__SITE_SETTINGS__';
export const getPriceByUserLevelFromServerRequest = (
  req: IncomingMessage,
  item: any,
  priceFields?: {
    vip: string;
    default: string;
  },
) => {
  return getPriceByUserLevel({
    dataSource: item,
    isVip: req?.[SITE_SETTINGS]?.initialStoreState?.user?.hasVip,
    priceFields,
  });
};

export const getSkuPriceByUserLevelFromServerRequest = (
  req: IncomingMessage,
  item: {
    vipPurchasePrice: React.Key;
    purchasePrice: React.Key;
  },
) => {
  return getPriceByUserLevel({
    dataSource: item,
    isVip: req?.[SITE_SETTINGS]?.initialStoreState?.user?.hasVip,
    priceFields: { vip: 'vipPurchasePrice', default: 'purchasePrice' },
  });
};

export const getSkuPropsFromProductData = (data: any, req?: IncomingMessage) => {
  const { productInfo, products = [], salePropKeyNames = [], salePropKeyIds = [] } = data;

  // 销售价格
  const salePrice = req
    ? getPriceByUserLevelFromServerRequest(req, productInfo)
    : getPriceByUserLevel({ dataSource: productInfo });

  const maxPrice = req
    ? getPriceByUserLevelFromServerRequest(req, productInfo, {
        vip: 'maxVipPurchasePrice',
        default: 'maxPurchasePrice',
      })
    : getPriceByUserLevel({
        dataSource: productInfo,
        priceFields: {
          vip: 'maxVipPurchasePrice',
          default: 'maxPurchasePrice',
        },
      });

  let initialSku = (null as unknown) || undefined;

  // eslint-disable-next-line no-underscore-dangle
  const _isNonStandard = isNonStandard(productInfo.chargeUnit.chargeWay);

  /**
   * @see https://www.tapd.cn/23571741/prong/stories/view/1123571741001002393
   *
   * 非标准计价时，无需限定最小起批量
   *
   * @description
   *    如果是非标计价，在限定起售数的时候，使用 minimumSale，而在计算价格的时候使用 originMinimumSale
   *    如果是标准计价，用 minimumSale/originMinimumSale 都可以
   */
  const resolveMinimumSaleFields = (minimumSale: React.Key = '1') => {
    // eslint-disable-next-line no-underscore-dangle
    const _minimumSale = Number(minimumSale);

    return {
      minimumSale: _isNonStandard ? 1 : _minimumSale || 1,
      // 0 代表没有起售限制，所以这里应该是原样保存商品 or sku 的 minimumSale 值
      originMinimumSale: _minimumSale,
    };
  };

  const skuDataSource = {
    name: productInfo.name,
    image: productInfo.image,
    none_sku: !products[0].salePropValIds.length,
    collection_id: products[0].id,
    price: salePrice,
    ...resolveMinimumSaleFields(products[0]?.minimumSale),
    originPrice:
      productInfo.minOrignPrice !== productInfo.minSalePrice ? productInfo.minOrignPrice : 0,
    stock_num: Number(products[0]?.stock),
    tree: [],
    list: [],
  };

  let nonStandardPriceOptions: any;
  let standardPriceOptions: any;

  // 非标准计价
  if (_isNonStandard) {
    nonStandardPriceOptions = {
      minimumSale: skuDataSource?.originMinimumSale, // 这个属性没啥用了
      chargeUnit: productInfo.chargeUnit,
    };
  } else {
    standardPriceOptions = productInfo.chargeUnit;
  }

  if (products.length && salePropKeyNames.length && salePropKeyIds.length) {
    skuDataSource!.list = products.map((item) => ({
      originPrice: 0,
      ...item,
      sku_name_map: item.salePropValNames,
      sku_value_map: item.salePropValIds,
      price: (req
        ? getSkuPriceByUserLevelFromServerRequest(req, item)
        : getPriceByUserLevel({
            dataSource: item,
            priceFields: { vip: 'vipPurchasePrice', default: 'purchasePrice' },
          })) as number,
      stock_num: Number(item.stock),
      ...resolveMinimumSaleFields(item.minimumSale),
    }));

    skuDataSource!.tree = salePropKeyNames.map((n, idx) => ({
      k: n,
      k_id: salePropKeyIds[idx],
      v: products.reduce(
        (prev, next) => {
          if (!prev.ids.includes(next.salePropValIds[idx])) {
            prev.ids.push(next.salePropValIds[idx]);
            prev.cTreeVs.push({
              id: next.salePropValIds[idx],
              name: next.salePropValNames[idx],
            });
          }

          return prev;
        },
        { ids: [] as string[], cTreeVs: [] as { id: string; name: string }[] },
      ).cTreeVs,
    }));

    if (skuDataSource?.list.length) {
      const firstSkuItem = skuDataSource.list.find((item) => item.stock_num !== 0);
      const minimumSale = firstSkuItem?.minimumSale || 1;

      initialSku = {
        // 非标准计价时，无需限定最小起批量
        selectedNum: nonStandardPriceOptions ? 1 : minimumSale,
        sku_value_map: firstSkuItem?.sku_value_map || [],
        sku_parent_value_map: skuDataSource!.tree.map((item) => item.k_id),
      };

      if (firstSkuItem) {
        skuDataSource.stock_num = firstSkuItem.stock_num;
        skuDataSource.minimumSale = minimumSale!;

        // 在有 sku 的情况下，将第一个有库存的 sku 项的最小起批数重新赋值给 nonStandardPriceOptions.minimumSale
        // if (nonStandardPriceOptions) {
        //   nonStandardPriceOptions.minimumSale = firstSkuItem.originMinimumSale!;
        // }
      }
    }
  }

  return {
    // 销售价格
    salePrice,
    maxPrice,
    // sku 面板数据源
    skuDataSource,
    // 有 sku 时，默认选中
    initialSku,
    // 非标准计价
    nonStandardPriceOptions: nonStandardPriceOptions || null,
    // 标准计价
    standardPriceOptions: standardPriceOptions || null,
  };
};

// 非标准计价提示语
export const nonStandardPriceMessage = ({
  minimumSale,
  unitName,
}: {
  unitName: string;
  minimumSale: string | number;
}) => {
  return `不足${minimumSale}${unitName}按${minimumSale}${unitName}计价`;
};
