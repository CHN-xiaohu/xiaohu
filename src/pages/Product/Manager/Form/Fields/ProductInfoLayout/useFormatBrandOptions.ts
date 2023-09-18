import { useEffect, useState } from 'react';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import type { TModelNamespace } from '@/pages/Product/index.d';

export const useFormatBrandOptions = (
  brandId?: string,
  brandName?: string,
  modelNamespace: TModelNamespace = 'product',
) => {
  const [brandIdOptions, setBrandIdOptions] = useState([] as { value: string; label: string }[]);

  const { brands } = useStoreState(modelNamespace);

  useEffect(() => {
    const getSelectOptions = () => {
      const selectOptions = brands.map((item) => ({ value: item.id, label: item.cnName }));

      // 处理所选品牌被禁用的情况
      if (brandId && !selectOptions.some((v) => v.value === brandId)) {
        selectOptions.push({ value: brandId, label: brandName || '' });
      }

      return selectOptions;
    };

    setBrandIdOptions(getSelectOptions());
  }, [brands, brandId]);

  return {
    brandIdOptions,
  };
};
