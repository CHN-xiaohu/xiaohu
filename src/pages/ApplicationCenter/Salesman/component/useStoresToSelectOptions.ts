import { useRequest } from 'ahooks';

import type { StoreColumns } from '../Api';
import { unRegisterStore } from '../Api';

export type TBrandsSelectOptions = {
  value: string;
  label: string;
}[];

export const useStoresToSelectOptions = () => {
  const { data } = useRequest(() => unRegisterStore({ selectField: '' }), {
    formatResult: (res) =>
      res.data.map((item: StoreColumns) => ({
        value: item.id,
        label: `${item.storeName}（${item.registerPhone}）`,
      })),
  });

  return {
    storesSelectOptions: (data as TBrandsSelectOptions) || [],
  };
};
