import {
  convenientDateRangeSchema,
  useGeneralTableActions,
  GeneralTableLayout,
} from '@/components/Business/Table';

import { Image } from '@/components/Business/Table/Image';

// import { useState } from 'react';

import type { MiniUserColumn } from './Api';
import { getMiniUser } from './Api';

export default function MiniProgramUser() {
  const { actionsRef } = useGeneralTableActions<MiniUserColumn>();

  return (
    <GeneralTableLayout
      request={getMiniUser as any}
      getActions={actionsRef}
      searchProps={{
        // minItem: 3,
        items: [
          {
            content: {
              title: '模糊查询',
              type: 'string',
              'x-component-props': {
                placeholder: '昵称、注册手机',
              },
              col: 10,
            },
            '[startTime,endTime]': convenientDateRangeSchema(),
          },
        ],
      }}
      operationButtonListProps={false}
      columns={[
        {
          title: '手机号',
          dataIndex: 'phone',
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          render: (src: string) => <Image src={src} />,
        },
        {
          title: '性别',
          dataIndex: 'gender',
          render: (data: any) => <span>{data === '1' ? '男' : '女'}</span>,
        },
        // {
        //   title: '所在区域',
        //   dataIndex: 'location',
        // },
        {
          title: '注册时间',
          dataIndex: 'createTime',
        },
      ]}
    />
  );
}
