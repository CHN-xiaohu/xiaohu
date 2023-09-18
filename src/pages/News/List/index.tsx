import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useState, useCallback } from 'react';
import { Modal } from 'antd';
import { history } from 'umi';

import type { NewsColumns } from '../Api';
import { getNewsList, delNew } from '../Api';

export default function NewsList() {
  const { actionsRef } = useGeneralTableActions<NewsColumns>();

  const [id, setId] = useState('');
  const [openDel, setOpenDel] = useState(false);
  const deviceType = ['', 'Android', 'IOS', 'IOS, Android'];

  const handleDelSuccess = useCallback(() => actionsRef.current.reload(), []);

  const geToEditForm = () => {
    history.push('/app/news/form');
  };

  const handleGoDetail = (record: any) => {
    history.push(`/app/news/detail/${record.id}`);
  };

  const handleGoDel = (records: any) => {
    setId(records.id);
    setOpenDel(true);
  };

  const delOpt = {
    title: '提示',
    visible: openDel,
    width: 250,
    onCancel() {
      setOpenDel(false);
    },
    onOk() {
      delNew(id).then(() => handleDelSuccess());
      setOpenDel(false);
    },
  };

  return (
    <>
      <Modal {...delOpt}>
        确认删除此消息？
        <br />
        已发出的推送无法取消
      </Modal>
      <GeneralTableLayout<NewsColumns, any>
        request={getNewsList as any}
        getActions={actionsRef}
        defaultAddOperationButtonListProps={{
          text: '新增消息',
          onClick: () => geToEditForm(),
        }}
        searchProps={{
          items: [
            {
              deviceType: {
                title: '推送平台',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      {
                        label: '全平台',
                        value: '3',
                      },
                      {
                        label: 'Android',
                        value: '1',
                      },
                      {
                        label: 'IOS',
                        value: '2',
                      },
                    ],
                    '',
                  ),
                },
              },
              '[startDate,endDate]': {
                title: '推送时间',
                type: 'daterange',
                'x-component-props': {
                  placeholder: '请选择查询时间',
                  showTime: true,
                  format: 'YYYY-MM-DD HH:mm:ss',
                  col: 16,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '公告标题',
            dataIndex: 'title',
            width: '15%',
          },
          {
            title: '公告简介',
            dataIndex: 'shortDescription',
            width: '20%',
          },
          {
            title: '推送平台',
            dataIndex: 'deviceType',
            render: (data: any) => <span>{deviceType[Number(data)]}</span>,
          },
          {
            title: '推送时间',
            dataIndex: 'beginDate',
          },
          {
            title: '新增时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                { text: '查看', onClick: () => handleGoDetail(row) },
                { text: '删除', onClick: () => handleGoDel(row) },
              ],
            },
          },
        ]}
      />
    </>
  );
}
