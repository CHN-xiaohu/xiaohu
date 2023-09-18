import { Table } from 'antd';

import { nanoid } from 'nanoid';

import { ELLIPSIS } from '@/pages/Order/Constants';

export const DeliveryTable = ({ value = [] }: { value: any[] }) => (
  <Table
    bordered
    pagination={false}
    dataSource={value}
    rowKey={(_, idx) => {
      return _.id ?? nanoid();
    }}
    columns={[
      {
        title: '商品名称1',
        dataIndex: 'productName',
      },
      {
        title: '购买规格',
        dataIndex: 'productPropVal',
        render: (v) => v || ELLIPSIS,
      },
      {
        title: '数量',
        dataIndex: 'productNum',
      },
    ]}
  />
);
