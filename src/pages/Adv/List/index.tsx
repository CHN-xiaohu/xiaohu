import {
  generateDefaultSelectOptions,
  useGeneralTableActions,
  GeneralTableLayout,
} from '@/components/Business/Table';
import { useCallback, useRef } from 'react';

import { history } from 'umi';

import { useMount } from 'ahooks';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { showLocation, advStatus } from '../components/index';
import type { AdvColumns } from '../Api';
import { getAdvs, deleteAdv, getMiniAdvList, getAdvDetail } from '../Api';
import { useADForm } from '../Form';

const terminalMaps = ['IOS&Android', 'IOS', 'Android'];

export default function AdvList() {
  const { actionsRef } = useGeneralTableActions<AdvColumns>();

  const { categoriesTree } = useStoreState('pcColumn');

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = useADForm({
    onAddSuccess: handleCreateAdSuccess,
    categoriesTree,
  });

  const handleGetAdvDetail = (id: any) => {
    getAdvDetail(id).then((res) => {
      const detailData = res.data;
      return openForm({
        chooseProduct:
          detailData.skipLocation === 'APP_PRODUCT_DETAIL' ||
          detailData.skipLocation === 'MINI_PRODUCT_DETAIL'
            ? detailData.skipValue
            : undefined,
        chooseSpecialPage:
          detailData.skipLocation === 'MINI_SPECIAL_PAGE' ? detailData.skipValue : undefined,
        groupPurchase:
          detailData.skipLocation === 'GROUP_PURCHASE_PAGE' ? detailData.skipValue : undefined,
        byBusinessCode:
          detailData.skipLocation === 'ACTION_FORM_PAGE' ? detailData.skipValue : undefined,
        categoryPathId:
          detailData.skipLocation === 'SPECIFY_CATEGORY'
            ? detailData?.skipValue?.split(',')
            : undefined,
        ...detailData,
      });
    });
  };

  const appAdvList = useRef([
    {
      title: '序号',
      dataIndex: 'sort',
    },
    {
      title: '生效状态',
      dataIndex: 'status',
      render: (data: any) => <span>{advStatus[Number(data)] || advStatus[0]}</span>,
    },
    {
      title: '启用状态',
      dataIndex: 'isUsing',
      render: (data: any) => <span>{data ? '启用' : '禁用'}</span>,
    },
    {
      title: '广告位置',
      dataIndex: 'location',
      render: (data: any) => <span>{showLocation(data)}</span>,
    },
    {
      title: '广告标题',
      dataIndex: 'name',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (data: any) => <span>{data === '1999-01-01 00:00:00' ? '长期' : data}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (data: any) => <span>{data === '2999-01-01 00:00:00' ? '长期' : data}</span>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 110,
      buttonListProps: {
        list: ({ row }: any) => [
          {
            text: '查看',
            // eslint-disable-next-line no-confusing-arrow
            onClick: () =>
              window.location.pathname.split('/')[2] === 'miniAdv'
                ? history.push(`/miniProgram/miniAdv/detail/${row.id}`)
                : history.push(`/app/adv/detail/${row.id}`),
          },
          {
            text: '编辑',
            onClick: () => {
              handleGetAdvDetail(row.id);
            },
          },
          {
            text: '删除',
            modalProps: {
              title: '确认删除该广告？',
              onOk: () => deleteAdv(row.id).then(() => actionsRef.current.reload()),
            },
          },
        ],
      },
    },
  ]);
  useMount(() => {
    if (window.location.pathname === '/app/adv') {
      appAdvList.current.splice(5, 0, {
        title: '展示终端',
        dataIndex: 'terminal',
        render: (data: any) => <span>{terminalMaps[Number(data)] || terminalMaps[0]}</span>,
      });
    }
  });

  return (
    <>
      {ModalFormElement}

      <GeneralTableLayout<AdvColumns, any>
        request={
          window.location.pathname.split('/')[2] === 'miniAdv'
            ? (getMiniAdvList as any)
            : (getAdvs as any)
        }
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          items: [
            {
              name: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '广告标题',
                },
                col: 10,
              },
              '[startTime,endTime]': {
                title: '生效时间',
                type: 'daterange',
                props: {
                  showTime: true,
                  format: 'YYYY-MM-DD HH:mm:ss',
                },
              },
            },
            {
              status: {
                title: '生效状态',
                type: 'checkableTags',
                default: '',
                col: 10,
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '生效中', value: 2 },
                      { label: '未生效', value: 1 },
                      { label: '已过期', value: 3 },
                    ],
                    '',
                  ),
                },
              },
              isUsing: {
                title: '启用状态',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '启用', value: 1 },
                      { label: '禁用', value: 0 },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          text: '新增广告',
          onClick: () => openForm(),
        }}
        columns={appAdvList.current}
      />
    </>
  );
}
