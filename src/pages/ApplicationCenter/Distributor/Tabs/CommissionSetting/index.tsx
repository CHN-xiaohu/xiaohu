import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import { useState } from 'react';

import { useSetCommissionForm } from './useSetCommissionForm';

import { ChooseStore } from './ChooseStoreModal';

import type { CommissionStoresColumns } from '../../api';
import { getSetCommissionStores } from '../../api';

export const CommissionSetting = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { actionsRef } = useGeneralTableActions<CommissionStoresColumns>();

  const { openSetCommissionForm, ModalFormElement } = useSetCommissionForm(() => {
    requestAnimationFrame(() => {
      setSelectedRowKeys([]);
      actionsRef.current.reload();
    });
  });

  return (
    <>
      {ModalFormElement}

      <GeneralTableLayout<CommissionStoresColumns>
        request={getSetCommissionStores}
        getActions={actionsRef}
        placeholder="--"
        searchProps={{
          minItem: 3,
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '商家昵称、注册手机',
                },
              },
              '[startTime,endTime]': convenientDateRangeSchema({ title: '注册时间' }),
            },
          ],
        }}
        operationButtonListProps={{
          list: [
            {
              text: '设置商家分佣比例',
              onClick: () => {
                openSetCommissionForm({ ids: selectedRowKeys });
              },
            },
            {
              text: '开通商家分佣',
              render: (props) => (
                <ChooseStore
                  key="ChooseStore"
                  // eslint-disable-next-line react/no-children-prop
                  children={props.children}
                  onSuccess={() => actionsRef.current.reload()}
                />
              ),
            },
          ],
        }}
        tableProps={{
          rowKey: 'storeId',
          rowSelection: {
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as string[]),
          },
        }}
        columns={[
          {
            title: '商家名称',
            dataIndex: 'storeName',
          },
          {
            title: '注册手机',
            width: 120,
            dataIndex: 'registerPhone',
            placeholder: true,
          },
          {
            title: '商家分佣比例',
            dataIndex: 'commission',
            placeholder: true,
            render: (v) => `${v}%`,
          },
          {
            title: '注册时间',
            width: 186,
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            fixed: 'right',
            width: 140,
            align: 'center',
            buttonListProps: {
              align: 'center',
              isLink: true,
              list: ({ row }) => [
                {
                  text: '修改分佣比例',
                  type: 'primary',
                  onClick: () =>
                    openSetCommissionForm({ ids: [row.storeId], commission: row.commission }),
                },
              ],
            },
          },
        ]}
      />
    </>
  );
};
