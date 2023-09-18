import {
  generateDefaultSelectOptions,
  convenientDateRangeSchema,
  useGeneralTableActions,
  GeneralTableLayout,
} from '@/components/Business/Table';
import { SwitchPlus } from '@/components/Library/Switch';

import { useMount } from 'ahooks';
import { useState, useCallback } from 'react';

import { useSupplierForm } from '../Form';

import type { SupplierColumns } from '../Api';
import { getSupplierList, changeStatus, getDownStoreList } from '../Api';

export default function SupplierList() {
  const [storeList, setStoreList] = useState<{ value: string; label: string }[]>([]);

  const { actionsRef } = useGeneralTableActions<SupplierColumns>();

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  useMount(() => {
    getDownStoreList('').then((res) => {
      const stores = res.data.map((item: any) => ({
        value: item.id,
        label: `${item.storeName}（${item.registerPhone}）`,
      }));
      setStoreList(stores);
    });
  });

  const { openForm, ModalFormElement } = useSupplierForm({
    onAddSuccess: handleCreateAdSuccess,
    storeList,
  });

  const handleChangeStatus = (_: any, record: any) => {
    return changeStatus({ id: record.id }).then(() => {
      actionsRef.current.reload();
    });
  };

  return (
    <>
      {ModalFormElement}
      <GeneralTableLayout<SupplierColumns, any>
        request={getSupplierList as any}
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          items: [
            {
              selectField: {
                title: '模糊搜索',
                type: 'string',
                'x-component-props': {
                  placeholder: '供应商名称、联系人、注册手机号',
                },
              },
              '[selectStartDate,selectEndDate]': convenientDateRangeSchema(),
            },
            {
              status: {
                title: '启用状态',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      {
                        label: '开启',
                        value: 1,
                      },
                      {
                        label: '关闭',
                        value: 0,
                      },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          text: '新增供应商',
          onClick: () => openForm(),
        }}
        columns={[
          {
            title: '供应商名称',
            dataIndex: 'supplierName',
            width: '15%',
          },
          {
            title: '联系人',
            dataIndex: 'linkName',
            width: '15%',
          },
          {
            title: '手机号',
            dataIndex: 'linkPhone',
          },
          {
            title: '所在地区',
            dataIndex: 'area',
            render: (_: any, records: any) => (
              <span>
                {records.provinceName}
                {records.cityName}
                {records.areaName}
              </span>
            ),
          },
          {
            title: '启用状态',
            dataIndex: 'status',
            render: (data, record, index) => (
              <SwitchPlus
                field="status"
                value={data}
                onChange={() => handleChangeStatus(index, record)}
                modalProps={{
                  children: (
                    <span>
                      {
                        // eslint-disable-next-line no-extra-boolean-cast
                        !Boolean(data) ? '确定启用该供应商吗？' : '确定禁用该供应商吗？'
                      }
                    </span>
                  ),
                }}
              />
            ),
          },
          {
            title: '注册时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 110,
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '编辑',
                  onClick: () =>
                    openForm({
                      ...row,
                      area: [row.provinceName, row.cityName, row.areaName],
                    }),
                },
              ],
            },
          },
        ]}
      />
    </>
  );
}
