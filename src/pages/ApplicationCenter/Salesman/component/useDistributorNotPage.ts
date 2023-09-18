import { useRequest } from 'ahooks';

import type { DistributorColumns } from '../../Distributor/api';
import { getAllDistributor } from '../../Distributor/api';

export type TBrandsSelectOptions = {
  value: string;
  label: string;
}[];

export const useDistributorNotPage = () => {
  const { data } = useRequest(() => getAllDistributor(), {
    formatResult: (res) => res.data,
  });

  const distributor = data?.map((item: DistributorColumns) => ({
    value: item.id,
    label: `${item.name}`,
    registerPhone: item.registerPhone,
  }));

  return {
    distributorSelectOptions: (distributor as TBrandsSelectOptions) || [],
  };
};
