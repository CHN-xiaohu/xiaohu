import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';
import { isFn } from '@/utils';
import { useWatch } from '@/foundations/hooks';
import { usePersistFn } from 'ahooks';

import '../index.less';
import { Stepper } from '../../Stepper';

export interface ISkuStepperProps {
  stock: number;
  skuStockNum: number;
  value?: number;
  stepperTitle?: string;
  disableStepperInput?: boolean;
  suffix?: React.ReactNode | string;
  /**
   * 自定义步进器规则
   */
  customStepperConfig?: {
    hideQuotas?: boolean;
    // 自定义限购文案
    quotas?:
      | string
      | React.ReactNode
      | ((props: { startSaleNum: number; stock: number }) => string | React.ReactNode);
    // 库存
    stockNum?: number;
    // 格式化库存
    stockFormatter?: (stockNum: number | string) => string | number;
    // 步进器变化的回调
    handleStepperChange?: (currentValue: number | string) => void;
  };
  /**
   * 隐藏起售
   */
  hideQuotaText?: boolean;
  /**
   * 限购数，0 表示不限购
   */
  quota?: number;
  /**
   * 起售单位
   */
  quotaUnit?: string;
  /**
   * 已经购买过的数量
   */
  quotaUsed?: number;
  /**
   * 步进器起售
   */
  startSaleNum?: number;
  unMax?: boolean;
  onChange?: (v: number) => void;
}

export const LIMIT_TYPE = {
  QUOTA_LIMIT: 0,
  STOCK_LIMIT: 1,
};

export const SkuStepper = React.memo(
  ({
    value = 0,
    // stepperTitle,

    stock,
    hideQuotaText,
    disableStepperInput,

    customStepperConfig,

    quota = 0,
    quotaUnit = '件',
    quotaUsed = 0,
    startSaleNum = 1,

    unMax = false,

    suffix,

    onChange,
  }: ISkuStepperProps) => {
    const [state, setState] = useImmer({
      currentNum: value,
      // 购买限制类型: 限购/库存
      limitType: LIMIT_TYPE.STOCK_LIMIT,
    });

    useWatch(
      () => {
        if (value) {
          setState((draft) => {
            draft.currentNum = value;
          });
        }
      },
      [value],
      { isAreEqual: true },
    );

    const stepperLimit = useMemo(() => {
      if (unMax) {
        return undefined;
      }

      const quotaLimit = quota - quotaUsed;
      let limit;

      // 无限购时直接取库存，有限购时取限购数和库存数中小的那个
      if (quota > 0 && quotaLimit <= stock) {
        // 修正负的limit
        limit = quotaLimit < 0 ? 0 : quotaLimit;
        setState((draft) => {
          draft.limitType = LIMIT_TYPE.QUOTA_LIMIT;
        });
      } else {
        limit = stock;

        setState((draft) => {
          draft.limitType = LIMIT_TYPE.STOCK_LIMIT;
        });
      }

      return limit;
    }, [quota, quotaUsed, stock, setState, unMax]);

    const stepperMinLimit = useMemo(() => (startSaleNum < 1 ? 1 : startSaleNum), [startSaleNum]);

    const quotas = useMemo(() => {
      if (hideQuotaText || customStepperConfig?.hideQuotas) {
        return '';
      }

      if (customStepperConfig?.quotas) {
        return isFn(customStepperConfig.quotas)
          ? customStepperConfig.quotas({ stock, startSaleNum })
          : customStepperConfig.quotas;
      }

      const spanArr = [] as string[];
      if (startSaleNum > 1) {
        spanArr.push(`${startSaleNum}${quotaUnit}起售`);
      }

      if (quota > 0) {
        spanArr.push(`限购${quota}${quotaUnit}`);
      }

      return spanArr.join('，');
    }, [startSaleNum, quota, quotaUnit, stock, customStepperConfig, hideQuotaText]);

    const handleChange = usePersistFn((num: number) => {
      onChange?.(num);
      customStepperConfig?.handleStepperChange?.(num);
    });

    return (
      <div className="sku-stepper-stock">
        <div className="sku__stepper-container">
          <Stepper
            {...{
              className: 'sku__stepper',
              value: state.currentNum,
              min: stepperMinLimit,
              max: stepperLimit,
              disableInput: disableStepperInput,
              integer: true,
              onChange: handleChange,
            }}
          />

          {suffix && <div className="sku__stepper-suffix">{suffix}</div>}
        </div>

        {quotas && <span className="sku__stepper-quota">{quotas}</span>}
      </div>
    );
  },
);
