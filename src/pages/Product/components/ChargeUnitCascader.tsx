import { memo } from 'react';
import type { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Modal, Cascader } from 'antd';
import type { CascaderValueType } from 'antd/lib/cascader';
import { FormEffectHooks } from '@formily/antd';
import { createLinkageUtils } from '@/components/Business/Formily';

import { specificationTableFormPath } from '../Manager/Form/Fields/SkuLayout';

// 是否非标准计价
export const isNonStandard = (chargeWay: number) => chargeWay !== 1;

// 找到对应单位名
export const getCascaderName = ({ unitState }: { unitState: any }) => {
  const pricingList = unitState.props['x-component-props'].options.find(
    (option: any) => option.id === unitState.value?.[0],
  );
  const cascaderName = pricingList?.children.find(
    (pricing: any) => pricing.id === unitState.value?.[1],
  ).name;
  return cascaderName;
};

export const useChargeUnitCascaderEffects = () => {
  const linkage = createLinkageUtils();
  FormEffectHooks.onFieldValueChange$(
    'formLayout.productInfoFullLayout.productInfoLayout.item1.chargeUnits',
  ).subscribe((UnitState) => {
    const chargeWay = UnitState.value?.[0];
    const priceLayoutPath = 'formLayout.skuFullLayout.priceLayout.priceGrid';
    const precision = isNonStandard(Number(chargeWay)) ? 2 : 0;
    const addonAfter = getCascaderName({ unitState: UnitState });

    const skuLayoutMinimumSalePath = `${specificationTableFormPath}.*.*(minimumSale)`;
    const skuLayoutStockPath = `${specificationTableFormPath}.*.*(stock)`;

    const minimumSalePath = `${priceLayoutPath}.minimumSale`;
    const stockPath = `${priceLayoutPath}.stock`;
    const warningPath = `${priceLayoutPath}.warning`;

    linkage.xComponentProp(skuLayoutMinimumSalePath, 'precision', precision);
    linkage.xComponentProp(minimumSalePath, 'precision', precision);

    linkage.xComponentProp(skuLayoutStockPath, 'precision', precision);
    linkage.xComponentProp(stockPath, 'precision', precision);
    linkage.xComponentProp(warningPath, 'precision', precision);

    linkage.xComponentProp(stockPath, 'addonAfter', addonAfter);
    linkage.xComponentProp(warningPath, 'addonAfter', addonAfter);
  });
};

export const ChargeUnitCascader = memo((props: ISchemaFieldComponentProps) => {
  const openModal = (v: CascaderValueType) =>
    Modal.confirm({
      title: '提示',
      content: '切换计价单位会影响商品的起售数量，是否继续切换？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => props.onChange(v),
    });

  return (
    <Cascader
      {...{
        ...props,
        onChange: (v) => {
          openModal(v);
        },
      }}
    />
  );
});
