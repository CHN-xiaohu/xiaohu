import { useRequest } from 'ahooks';

import type { BrandColumns } from './Api';
import { getBrandList } from './Api';

export type TBrandsSelectOptions = {
  value: string;
  label: string;
}[];

export const useBrandsToSelectOptions = () => {
  const { data } = useRequest(() => getBrandList({ size: 999, current: 1 }), {
    formatResult: (res) =>
      res.data.records.map((item: BrandColumns) => ({ value: item.id, label: item.cnName })),
  });

  return {
    brandsSelectOptions: (data as TBrandsSelectOptions) || [],
  };
};
