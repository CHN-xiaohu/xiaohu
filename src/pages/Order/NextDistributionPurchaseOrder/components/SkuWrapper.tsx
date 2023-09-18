import React from 'react';

import { Sku } from './Sku';
import { useSkuProps } from './useSkuProps';

interface Props {
  dataSource: any;
  onSelectSkuChange?: any;
  showCustomStepperConfig?: boolean;
  showNonStandardPriceMessage?: boolean;
}

export const SkuWrapper: React.FC<Props> = ({
  dataSource,
  onSelectSkuChange,
  showCustomStepperConfig,
  showNonStandardPriceMessage,
  ...lastProps
}) => {
  const configProps = useSkuProps(dataSource, {
    onSelectSkuChange,
    showCustomStepperConfig,
    showNonStandardPriceMessage,
  });

  return (
    <Sku
      {...{
        dataSource: dataSource?.skuDataSource,
        startSaleNum: dataSource?.skuDataSource?.minimumSale,
        initialSku: dataSource?.initialSku,
        hideQuotaText: showCustomStepperConfig === false,
        ...configProps,
        ...lastProps,
      }}
    />
  );
};
