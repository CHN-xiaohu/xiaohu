import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { Icons } from '@/components/Library/Icon';

import { useState } from 'react';

import { Modal, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';

import type { menuColumn } from '../Api';
import { getMenuList, removeMenu } from '../Api';

const { confirm } = Modal;

export default function SystemMenuList() {
  const { actionsRef } = useGeneralTableActions<menuColumn>();
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([] as any);

  const handleSelectChange = (keys: any[]) => {
    setSelectedProductRowKeys(keys);
  };

  const handleGoAdd = () => {
    history.push('/system/menu/form');
  };

  // eslint-disable-next-line consistent-return
  const showDeleteConfirm = (id: any) => {
    console.log('id', id);
    let ids = '';
    if (id) {
      ids = id;
    } else if (selectedProductRowKeys.length < 1) {
      return message.warning('请先选择要删除的记录！');
    } else {
      selectedProductRowKeys.forEach((items: any) => {
        ids += `${items},`;
      });
      ids = ids.substring(0, ids.lastIndexOf(','));
    }
    confirm({
      title: '删除确认',
      icon: <QuestionCircleOutlined />,
      content: '确定删除选中记录？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        removeMenu({ ids }).then(() => {
          actionsRef.current.reload();
        });
      },
      onCancel() {
        console.log('onCancel');
      },
    });
  };

  return (
    <GeneralTableLayout<menuColumn, any>
      request={getMenuList as any}
      getActions={actionsRef}
      useTableOptions={{
        formatResult: (res) => ({
          data: res.data,
          total: 0,
        }),
      }}
      tableProps={{
        pagination: false,
        rowSelection: {
          onChange: handleSelectChange,
        },
      }}
      operationButtonListProps={{
        list: [
          {
            text: '新增',
            onClick: () => handleGoAdd(),
            type: 'primary',
            icon: 'PlusOutlined',
          },
          {
            text: '删除',
            danger: true,
            onClick: () => showDeleteConfirm(''),
            icon: 'DeleteOutlined',
          },
        ],
      }}
      searchProps={{
        items: [
          {
            code: {
              title: '菜单编号',
              type: 'string',
              'x-component-props': {
                placeholder: '请输入菜单编号',
              },
            },
            name: {
              title: '菜单名称',
              type: 'string',
              'x-component-props': {
                placeholder: '请输入菜单名称',
              },
            },
          },
        ],
      }}
      columns={[
        {
          title: '菜单名称',
          dataIndex: 'name',
        },
        {
          title: '菜单图标',
          dataIndex: 'source',
          align: 'center',
          render: (source) => <Icons type={`anticon-${source}`} style={{ paddingRight: '5px' }} />,
        },
        {
          title: '菜单编号',
          dataIndex: 'code',
        },
        {
          title: '菜单别名',
          dataIndex: 'alias',
        },
        {
          title: '路由地址',
          dataIndex: 'path',
        },
        {
          title: '排序',
          dataIndex: 'sort',
          align: 'right',
        },
        {
          title: '操作',
          dataIndex: 'id',
          buttonListProps: {
            list: ({ row }) => [
              {
                text: '修改',
                onClick: () => {
                  history.push(`/system/menu/form/${row.id}`);
                },
              },
              { text: '删除', onClick: () => showDeleteConfirm(row.id) },
              {
                text: '查看',
                onClick: () => {
                  history.push(`/system/menu/detail/${row.id}`);
                },
              },
            ],
          },
        },
      ]}
    />
  );
}
