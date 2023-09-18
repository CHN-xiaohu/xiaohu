import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useState } from 'react';
import { history } from 'umi';

import { Tag, Modal, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import type { deptColumns } from '../Api';
import { getDeptList, removeDept } from '../Api';

const { confirm } = Modal;

export default function SystemDeptList() {
  const { actionsRef } = useGeneralTableActions<deptColumns>();
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([] as any);

  const handleGoAdd = () => {
    history.push('/system/dept/add');
  };

  const handleSelectChange = (keys: any[]) => {
    setSelectedProductRowKeys(keys);
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
        removeDept({ ids }).then(() => {
          actionsRef.current.reload();
        });
      },
      onCancel() {
        console.log('onCancel');
      },
    });
  };

  return (
    <>
      <GeneralTableLayout<deptColumns, any>
        request={getDeptList as any}
        getActions={actionsRef}
        useTableOptions={{
          formatResult: (res) => ({
            data: res.data as any,
            total: 0,
          }),
        }}
        tableProps={{
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
              deptName: {
                title: '机构名称',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入机构名称',
                },
              },
              fullName: {
                title: '机构全称',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入机构全称',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '机构名称',
            dataIndex: 'deptName',
          },
          {
            title: '机构全称',
            dataIndex: 'fullName',
          },
          {
            title: '机构类型',
            dataIndex: 'deptCategoryName',
            render: (deptCategoryName) => (
              <span>
                <Tag color="geekblue" key={deptCategoryName}>
                  {deptCategoryName}
                </Tag>
              </span>
            ),
          },
          {
            title: '排序',
            dataIndex: 'sort',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '修改',
                  onClick: () => {
                    history.push(`/system/dept/add/${row.id}`);
                  },
                },
                { text: '删除', onClick: () => showDeleteConfirm(row.id) },
                {
                  text: '查看',
                  onClick: () => {
                    history.push(`/system/dept/detail/${row.id}`);
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
