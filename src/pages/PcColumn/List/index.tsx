import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { Modal } from 'antd';

import { useState, useCallback } from 'react';
import { history } from 'umi';

import type { PcColumnColumns } from '../Api';
import { getColumnPage, delPcColumn } from '../Api';

import { COLUMN_TYPE, modelNamespace } from '../Constant';

export default function PcColumnList() {
  const [isOpenDel, setIsOpenDel] = useState(false);
  const [columnId, setColumnId] = useState('');

  const { actionsRef } = useGeneralTableActions<PcColumnColumns>();

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const handleGoAdd = () => {
    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      navigationList: [],
    });
    history.push('/pc/column/form');
  };

  const handleGoEdit = (ids: any) => {
    history.push(`/pc/column/edit_form/${ids}`);
  };

  const delOpt = {
    title: '提示',
    visible: isOpenDel,
    width: 250,
    onCancel() {
      setIsOpenDel(false);
    },
    onOk() {
      delPcColumn(columnId).then(() => handleCreateAdSuccess());
      setIsOpenDel(false);
    },
  };

  const handleToDel = (ids: string) => {
    setIsOpenDel(true);
    setColumnId(ids);
  };

  return (
    <>
      <Modal {...delOpt}>确定删除该栏目？</Modal>
      <GeneralTableLayout<PcColumnColumns, any>
        request={(params: any) =>
          getColumnPage({
            flag: 2,
            ...params,
          }) as any
        }
        getActions={actionsRef}
        defaultAddOperationButtonListProps={{
          text: '新增栏目',
          onClick: () => handleGoAdd(),
        }}
        searchProps={{
          items: [
            {
              name: {
                title: '模糊查询',
                type: 'string',
                col: 8,
                'x-component-props': {
                  placeholder: '栏目名称',
                },
              },
            },
            {
              type: {
                title: '栏目类型',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      {
                        label: '广告栏目',
                        value: 'ADVERT_TEMPLATE',
                      },
                      {
                        label: '商品栏目',
                        value: 'PRODUCT_TEMPLATE',
                      },
                      {
                        label: '导航栏目',
                        value: 'NAVIGATION_TEMPLATE',
                      },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '栏目排序',
            dataIndex: 'sort',
          },
          {
            title: '栏目名称',
            dataIndex: 'name',
          },
          {
            title: '栏目类型',
            dataIndex: 'type',
            render: (data: any) => <div>{COLUMN_TYPE[data]}</div>,
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }: any) => [
                {
                  text: '编辑',
                  onClick: () => {
                    handleGoEdit(row.id);
                  },
                },
                {
                  text: '删除',
                  onClick: () => {
                    handleToDel(row.id);
                  },
                },
              ],
            },
          },
        ]}
      />
    </>
  );
}
