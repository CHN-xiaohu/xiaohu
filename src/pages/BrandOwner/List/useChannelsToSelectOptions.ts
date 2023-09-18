import { useRequest } from 'ahooks';

import type { BelongChannelColumns } from '../Api';
import { getBelongChannel } from '../Api';

export type TBrandsSelectOptions = {
  value: string;
  label: string;
  contactNumber: string;
}[];

export const useChannelsToSelectOptions = () => {
  const { data, run } = useRequest(() => getBelongChannel({}), {
    formatResult: (res) =>
      res.data.map((item: BelongChannelColumns) => ({
        value: item.id,
        label: item.tenantName,
        contactnumber: item.contactNumber,
      })),
  });

  return {
    channelsSelectOptions: (data as TBrandsSelectOptions) || [],
    runGetBelongChannel: run,
  };
};
