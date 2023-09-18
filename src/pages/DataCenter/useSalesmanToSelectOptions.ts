import { useRequest } from 'ahooks';

import type { SalesmanColumns } from '@/pages/Consumer/Merchant/Api';

import { getSalesmanNotPage } from '@/pages/Consumer/Merchant/Api';

export type TSalesmanSelectOptions = {
  value: string;
  label: string;
}[];

export const useSalesmanToSelectOptions = () => {
  const { data } = useRequest(() => getSalesmanNotPage(), {
    formatResult: (res) =>
      res.data.map((item: SalesmanColumns) => ({
        value: item.id,
        label: `${item.salesmanName}（${item.registerPhone}）`,
      })),
  });

  return {
    salesmanSelectOptions: (data as TSalesmanSelectOptions) || [],
  };
};
