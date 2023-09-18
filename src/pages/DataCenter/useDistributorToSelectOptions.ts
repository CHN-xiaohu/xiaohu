import { useRequest } from 'ahooks';

import type { DistributorColumns } from '@/pages/ApplicationCenter/Distributor/api';

import { getAllDistributor } from '@/pages/ApplicationCenter/Distributor/api';

export type TDistributorSelectOptions = {
  value: string;
  label: string;
}[];

export const useDistributorToSelectOptions = () => {
  const { data } = useRequest(() => getAllDistributor(), {
    formatResult: (res) =>
      res.data.map((item: DistributorColumns) => ({
        value: item.id,
        label: `${item.name}（${item.registerPhone}）`,
      })),
  });

  return {
    distributorSelectOptions: (data as TDistributorSelectOptions) || [],
  };
};
