import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import * as api from '@/pages/Programa/Api';

import { useState } from 'react';
import { history } from 'umi';
import { Modal } from 'antd';

import { useDispatch } from 'dva';

import { COLUMN_TYPE, TemplateSelectTree } from '../Constant';

export default () => {
  const { actionsRef } = useGeneralTableActions<api.ColumnColumn>();
  const request = (params: any) => api.getColunmList({ flag: 1, ...params });

  const [currentId, setId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRemove = (id: string) => {
    setId(id);
    setLoading(false);
    setShowModal(true);
  };

  const handleCancelRemove = () => {
    setId('');
    setShowModal(false);
  };

  const handleConfirmRemove = () => {
    setLoading(true);
    api.removeColumn(currentId).then(() => {
      actionsRef.current.reload();
      setLoading(false);
      setShowModal(false);
    });
  };

  const dispatch = useDispatch();
  const handleSkipToAdd = () => {
    dispatch({
      type: 'programa/resetForm',
    });
    history.push('/app/programa/update');
  };

  return (
    <>
      <Modal
        title="提示"
        confirmLoading={loading}
        visible={showModal}
        onOk={handleConfirmRemove}
        onCancel={handleCancelRemove}
      >
        确定删除栏目？
      </Modal>
      <GeneralTableLayout<api.ColumnColumn, any>
        request={request as any}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              name: {
                type: 'string',
                title: '模糊查询',
                'x-component-props': {
                  placeholder: '栏目名称',
                },
              },
              type: {
                type: 'checkableTags',
                title: '栏目类型',
                default: '',
                'x-component-props': {
                  options: [{ value: '', label: '全部' }, ...TemplateSelectTree.COLUMN_TYPE],
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
            render: (value: string) => <span>{COLUMN_TYPE[value]}</span>,
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
            width: 300,
          },
          {
            title: '操作',
            width: 200,
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '编辑',
                  onClick: () => {
                    history.push(`/app/programa/update/${row.id}`);
                  },
                },
                {
                  text: '删除',
                  onClick: () => {
                    handleRemove(row.id);
                  },
                },
              ],
            },
          },
        ]}
        defaultAddOperationButtonListProps={{
          text: '新增栏目',
          onClick: () => handleSkipToAdd(),
        }}
      />
    </>
  );
};
