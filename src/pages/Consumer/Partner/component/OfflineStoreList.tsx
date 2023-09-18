import {
  convenientDateRangeSchema,
  useGeneralTableActions,
  GeneralTableLayout,
} from '@/components/Business/Table';

import { Modal } from 'antd';

import type { partnerColumns } from '../Api';
import { getOfflineStores } from '../Api';

const OfflineStores = ({ partnerId, ...offlineStoresOpt }: any) => {
  const { actionsRef } = useGeneralTableActions<partnerColumns>();

  const request = (params: any) => {
    const query = {
      size: params.pageSize,
      current: params.current,
      id: partnerId,
      ...params,
    };
    return getOfflineStores({ ...query });
  };

  return (
    <Modal {...offlineStoresOpt}>
      <GeneralTableLayout<partnerColumns, any>
        request={request as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        searchProps={{
          minItem: 3,
          items: [
            {
              searchText: {
                title: '模糊搜索',
                type: 'string',
                placeholder: '商家名称/手机号',
              },
              '[selectStartDate,selectEndDate]': convenientDateRangeSchema(),
            },
          ],
        }}
        columns={[
          {
            title: '店铺名称',
            dataIndex: 'storeName',
          },
          {
            title: '商家名称',
            dataIndex: 'linkName',
          },
          {
            title: '注册手机',
            dataIndex: 'linkPhone',
          },
          {
            title: '操作',
            dataIndex: 'id',
          },
        ]}
      />
    </Modal>
  );
};

export default OfflineStores;
