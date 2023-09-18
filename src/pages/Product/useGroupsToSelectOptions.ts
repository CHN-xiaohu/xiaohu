import { useRequest } from 'ahooks';

import type { GroupsColumns } from './Api/groups';
import { getGroupsNoPage } from './Api/groups';

export type TGroupsSelectOptions = {
  value: string;
  label: string;
}[];

export const useGroupsToSelectOptions = () => {
  const { data } = useRequest(() => getGroupsNoPage({ contentFiled: '' }), {
    formatResult: (res) =>
      res.data?.map((item: GroupsColumns) => ({ value: item.id, label: item.name })),
  });
  return {
    groupsSelectOptions: (data as TGroupsSelectOptions) || [],
  };
};
