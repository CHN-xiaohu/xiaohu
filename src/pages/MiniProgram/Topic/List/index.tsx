import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useState, useCallback, useEffect } from 'react';
import { Modal } from 'antd';
import { history } from 'umi';

import { useDispatch } from 'dva';

import type { topicColumns } from '../Api';
import { getTopicList, deleteTopic } from '../Api';

export default function MiniProgramTopicList() {
  const dispatch = useDispatch();
  const { actionsRef } = useGeneralTableActions<topicColumns>();
  const [isDelete, setToDelete] = useState(false);
  const [id, setId] = useState('');

  // 创建成功
  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const handleToDelete = (topicId: string) => {
    setToDelete(true);
    setId(topicId);
  };

  useEffect(() => {
    dispatch({
      type: 'topic/updateState',
      payload: {
        selectedProductRowKeys: [],
        topicDetail: {},
        selectRowProducts: [],
      },
    });
  }, []);

  const handleCancel = () => {
    setToDelete(false);
  };

  const handleSureDelete = () => {
    setToDelete(false);
    deleteTopic({ ids: id }).then(handleCreateAdSuccess);
  };

  const handleGoEdit = () => {
    history.push('/miniProgram/topic/form');
  };

  return (
    <>
      <Modal
        title="提示"
        visible={isDelete}
        width={250}
        onCancel={handleCancel}
        onOk={handleSureDelete}
      >
        确定删除专题吗？
      </Modal>
      <GeneralTableLayout<topicColumns, any>
        request={getTopicList as any}
        getActions={actionsRef}
        defaultAddOperationButtonListProps={{
          text: '新增专题',
          onClick: () => handleGoEdit(),
        }}
        searchProps={{
          items: [
            {
              name: {
                title: '专题名称',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入专题名称',
                },
              },
              productName: {
                title: '商品名称',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入商品名称',
                },
              },
            },
            {
              firstPage: {
                title: '首页展示',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: [
                    {
                      label: '全部',
                      value: '',
                    },
                    {
                      label: '是',
                      value: 1,
                    },
                    {
                      label: '否',
                      value: 0,
                    },
                  ],
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '序号',
            dataIndex: 'sort',
          },
          {
            title: '专题名称',
            dataIndex: 'name',
            width: '25%',
          },
          {
            title: '首页展示',
            dataIndex: 'firstPage',
            render: (data) => <span>{data ? '是' : '否'}</span>,
          },
          {
            title: '专题商品',
            dataIndex: 'productNum',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                { text: '编辑', onClick: () => history.push(`/miniProgram/topic/form/${row.id}`) },
                { text: '删除', onClick: () => handleToDelete(row.id) },
              ],
            },
          },
        ]}
      />
    </>
  );
}
