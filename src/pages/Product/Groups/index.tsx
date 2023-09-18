import { useGeneralTableActions, GeneralTableLayout } from '@/components/Business/Table';
import { useCallback } from 'react';

import { Alert, Card } from 'antd';

import { useGroupsForm } from './Form';

import type { GroupsColumns } from '../Api/groups';
import { getGroupsList, delGroups } from '../Api/groups';

export default function Groups() {
  const { actionsRef } = useGeneralTableActions<GroupsColumns>();

  const handleCreateAddSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = useGroupsForm({
    onAddSuccess: handleCreateAddSuccess,
  });

  return (
    <Card>
      {ModalFormElement}
      <div style={{ marginBottom: '10px' }}>
        <Alert
          showIcon
          message="商品分组即为商品分类、类别、标签等，当商品种类繁多时，需要按照不同标准给商品进行分类、分组，比如：新品上市、热门推荐、450系列灯等"
          type="info"
        />
      </div>
      <GeneralTableLayout<GroupsColumns, any>
        request={getGroupsList as any}
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          items: [
            {
              selectField: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '分组名称',
                },
                col: 10,
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          text: '新增分组',
          onClick: () => openForm(),
        }}
        columns={[
          {
            title: '序号',
            dataIndex: 'serial',
          },
          {
            title: '分组名称',
            dataIndex: 'name',
            width: '20%',
          },
          {
            title: '商品数',
            dataIndex: 'productNum',
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
                  onClick: () => openForm({ ...row }),
                },
                {
                  text: '删除',
                  modalProps: {
                    title: '确定删除分组吗？',
                    onOk: () => delGroups(row.id).then(() => actionsRef.current.reload()),
                  },
                },
              ],
            },
          },
        ]}
      />
    </Card>
  );
}
