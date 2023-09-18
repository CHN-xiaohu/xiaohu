import { useRequest } from 'ahooks';

import type { StoreUserColumns } from '@/pages/Consumer/Supplier/Api';

import { getAllStoreUsers } from '@/pages/Consumer/Supplier/Api';

export type TStoresSelectOptions = {
  value: string;
  label: string;
}[];

export const useStoresToSelectOptions = () => {
  const { data } = useRequest(() => getAllStoreUsers(), {
    formatResult: (res) =>
      res.data.map((item: StoreUserColumns) => ({
        value: item.id,
        label: `${item.storeName}（${item.account}）`,
      })),
  });

  return {
    storesSelectOptions: (data as TStoresSelectOptions) || [],
  };
};
