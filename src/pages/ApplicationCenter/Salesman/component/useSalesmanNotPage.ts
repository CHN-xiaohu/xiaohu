import { useRequest } from 'ahooks';

import type { SalesmanColumns } from '../Api';
import { getSalesmanNotPage } from '../Api';

export type TBrandsSelectOptions = {
  value: string;
  label: string;
}[];

export const useSalesmanNotPage = () => {
  const { data } = useRequest(() => getSalesmanNotPage(), {
    formatResult: (res) => res.data,
  });
  const salesman = data?.map((item: SalesmanColumns) => ({
    value: item.id,
    label: `${item.salesmanName}`,
    registerPhone: item.registerPhone,
  }));

  return {
    salesmanNotPageSelectOptions: (salesman as TBrandsSelectOptions) || [],
  };
};
