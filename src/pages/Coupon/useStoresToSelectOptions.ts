import { useRequest } from 'ahooks';

import type { StoreColumns } from './Api';
import { getQueryStore } from './Api';

export type TStoreSelectOptions = {
  value: string;
  label: string;
}[];

export const useStoresToSelectOptions = () => {
  const { data } = useRequest(() => getQueryStore({ content: '', auditStatus: 1 }), {
    formatResult: (res) =>
      res.data?.map((item: StoreColumns) => ({
        value: item.id,
        label: `${item.storeName}（${item.linkPhone}）`,
      })),
  });
  return {
    storeSelectOptions: (data as TStoreSelectOptions) || [],
  };
};
