import { useMemo, useCallback, useState } from 'react';
import { usePersistFn } from 'ahooks';
import type { FieldData } from 'rc-field-form/lib/interface.d';
import { MathCalcic } from '@spark-build/web-utils';

import { isArea, isNonStandard, nonStandardPriceMessage } from './Sku/utils';
import { getSkuMessageFieldsByChargeUnit } from './TableColumnsComponents';

export interface UseSkuPropsOptions {
  onSelectSkuChange?: any;
  showCustomStepperConfig?: boolean;
  showNonStandardPriceMessage?: boolean;
}

export const useSkuProps = (skuOptions: any, options?: UseSkuPropsOptions) => {
  const [minimumSale, setMinimumSale] = useState<number | null>(null);
  const [currentStockNum, setCurrentStockNum] = useState<number | undefined>(undefined);

  // eslint-disable-next-line no-underscore-dangle
  const _isNonStandard = isNonStandard(
    skuOptions?.nonStandardPriceOptions?.chargeUnit.chargeWay || 1,
  );

  const handleSelectSkuChange = useCallback(
    (skuItem) => {
      options?.onSelectSkuChange?.(skuItem);
      setMinimumSale(skuItem.originMinimumSale);
    },
    [options],
  );

  const quotaUnit =
    (skuOptions?.nonStandardPriceOptions?.chargeUnit || skuOptions?.standardPriceOptions)
      ?.chargeUnitName || '';

  const renderQuotasPrefixText = useCallback(
    (startSaleNum: number) => {
      const skuIsNonStandard = _isNonStandard;

      if (!startSaleNum) {
        return undefined;
      }

      if (!skuIsNonStandard) {
        return startSaleNum > 1 ? <div>{`${startSaleNum}${quotaUnit} 起售`}</div> : undefined;
      }

      if (options?.showNonStandardPriceMessage === false) {
        return undefined;
      }

      const val = minimumSale || skuOptions?.nonStandardPriceOptions?.minimumSale;

      return (
        !!val &&
        nonStandardPriceMessage({
          minimumSale: val,
          unitName: quotaUnit,
        })
      );
    },
    [
      _isNonStandard,
      options?.showNonStandardPriceMessage,
      minimumSale,
      skuOptions?.nonStandardPriceOptions?.minimumSale,
      quotaUnit,
    ],
  );

  const customStepperConfig = useMemo(() => {
    if (options?.showCustomStepperConfig === false) {
      return undefined;
    }

    return {
      quotas: ({ startSaleNum, stock }: { startSaleNum: number; stock: number }) => {
        const realStockNum =
          currentStockNum !== undefined && currentStockNum !== 0 ? currentStockNum : startSaleNum;

        return (
          <div style={{ display: 'flex' }}>
            {renderQuotasPrefixText(realStockNum)}

            {stock < realStockNum && <div className="insufficient-stock">库存不足</div>}

            <div className="remainder-stock">
              剩余{stock}
              {quotaUnit}
            </div>
          </div>
        );
      },
    };
  }, [renderQuotasPrefixText, options?.showCustomStepperConfig, quotaUnit, currentStockNum]);

  const messagesFields = useMemo(() => {
    const { chargeUnit } = skuOptions?.nonStandardPriceOptions || {};

    return !chargeUnit ? undefined : getSkuMessageFieldsByChargeUnit(chargeUnit);
  }, [skuOptions?.nonStandardPriceOptions]);

  const calcNonStandardStock = usePersistFn((_, fields: FieldData[]) => {
    // 标准计价无需处理
    if (!skuOptions.nonStandardPriceOptions) {
      return;
    }

    // 当前非标计价的不同主要是面积的计算，面积是长 * 宽，而其他都是单一数值
    // 所以按约定的 fields 的长度应该是：面积计价是，长度为 3, 包含长度/宽度/购买数量
    // 其他的非标计价时，长度为 2，包含当前的非标计价的值/购买数量
    const area = isArea(skuOptions.nonStandardPriceOptions?.chargeUnit.attrResult);

    // 没有完整输入长/宽
    // TODO 优化不必要的计算
    const emptyFields = fields.find((item) => item.value === undefined);
    if (emptyFields) {
      return;
    }

    const countField = fields.pop();

    // 在当前的布局下，购买数量总是在最后一项，如果改变了布局，就需要考虑是否需要调整这里的取值处理
    const selectedNum = countField?.value || 1;

    const calcic = new MathCalcic(fields[0]?.value ?? 0);

    if (area) {
      calcic.multipliedBy(fields[1]?.value ?? 0);
    }

    setCurrentStockNum(calcic.multipliedBy(selectedNum).toNumber());
  });

  return {
    quotaUnit,
    customStepperConfig,
    messagesFields,
    unStepperMax: _isNonStandard,
    isNonStandard: _isNonStandard,
    onSelectSkuChange: handleSelectSkuChange,
    onFieldsChange: calcNonStandardStock,
  };
};
