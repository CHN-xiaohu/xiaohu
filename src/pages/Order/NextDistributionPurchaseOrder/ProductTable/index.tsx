import { MathCalcul } from '@/foundations/Support/Math';
import { useRef } from 'react';

import { SelectedCommodity } from '../components/SelectedCommodity';
import { isArea, isNonStandard } from '../components/Sku/utils';
import type { CartProductItem } from '../types';

export default function ProductTable({
  dataSource,
  onProductChange,
}: {
  onProductChange: ({ data }: { data: any[] }) => void;
  dataSource: any[];
}) {
  const cacheProductChangeDataSourceRef = useRef<any[] | null>(null);

  const combineSameProduct = (newProducts: CartProductItem[]) => {
    const existedMap = {} as Record<string, CartProductItem>;

    dataSource.forEach((item) => {
      existedMap[item.id] = item;
    });

    newProducts.forEach((item) => {
      if (existedMap[item.id]) {
        // 合并购买数量以及非标计价的数量
        existedMap[item.id].buyNum += item.buyNum;

        // 合并非标计价的数量
        if (isNonStandard(item.productInfo.chargeUnit.chargeWay)) {
          const indexArr = isArea(item.productInfo.chargeUnit.attrResult) ? [0, 1] : [0];

          indexArr.forEach((index) => {
            existedMap[item.id].productInfo.chargeUnit.attrs[index].attrVal = new MathCalcul(
              existedMap[item.id].productInfo.chargeUnit.attrs[index].attrVal,
            )
              .plus(item.productInfo.chargeUnit.attrs[index].attrVal)
              .toNumber();
          });
        }
      } else {
        existedMap[item.id] = item;
      }
    });

    return Object.values(existedMap);
  };

  const handleOk = (isMerge = true) => {
    if (cacheProductChangeDataSourceRef.current) {
      onProductChange({
        data: isMerge
          ? combineSameProduct(cacheProductChangeDataSourceRef.current)
          : cacheProductChangeDataSourceRef.current,
      });
    }
  };

  return (
    <SelectedCommodity
      showAddButton={true}
      dataSource={dataSource}
      onProductChange={(v) => {
        cacheProductChangeDataSourceRef.current = v.data;

        if (!v.isFromChooseCommodityModal) {
          handleOk(false);
        }
      }}
      onOk={handleOk}
    />
  );
}
