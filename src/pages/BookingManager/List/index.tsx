import { GeneralTableLayout } from '@/components/Business/Table';

import { getCustomerList } from '../Api';

export default function BookingManagerList() {
  return (
    <GeneralTableLayout
      request={getCustomerList as any}
      searchProps={{
        minItem: 3,
        items: [
          {
            content: {
              title: '模糊查询',
              type: 'string',
              'x-component-props': {
                placeholder: '企业名称，姓名，联系方式',
              },
            },
          },
        ],
      }}
      operationButtonListProps={false}
      columns={[
        {
          title: '企业名称',
          dataIndex: 'companyName',
        },
        {
          title: '姓名',
          dataIndex: 'name',
        },

        {
          title: '联系方式',
          dataIndex: 'phoneNum',
        },

        {
          title: '添加时间',
          dataIndex: 'createTime',
          width: 184,
        },
      ]}
    />
  );
}
