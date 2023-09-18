import { memo, useCallback } from 'react';
import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { safeJsonParse } from '@/utils';

import { isArr } from '@spark-build/web-utils';

import { useMessageForm } from './components/Form';

import styles from './index.less';

import type { Templates } from './Api';
import { deleteMessageTemplate, getTemplates } from './Api';

export const TemplateMessage = memo(() => {
  const { actionsRef } = useGeneralTableActions();

  const { openForm, ModalFormElement } = useMessageForm({
    onAddSuccess: actionsRef.current.reload,
  });

  const handleDelete = useCallback(
    (values) => {
      const { id, purposeId, appType } = values;

      deleteMessageTemplate({ id, purposeId, appType }).then(() => actionsRef.current.reload());
    },
    [actionsRef],
  );

  return (
    <>
      {ModalFormElement}
      <GeneralTableLayout
        request={() => getTemplates({ appType: 1 })}
        getActions={actionsRef}
        useTableOptions={{
          formatResult: (res) => ({
            data: res.data?.map((item: Templates) => ({
              ...item,
              contentArray: safeJsonParse(item.content, []),
            })),
            total: 0,
          }),
        }}
        bordered={false}
        tableProps={{
          pagination: false,
        }}
        className={styles.templateMessage}
        defaultAddOperationButtonListProps={{
          text: '新增模板',
          onClick: () => openForm(),
        }}
        columns={[
          {
            title: '模板用途',
            dataIndex: 'purposeName',
          },
          {
            title: '模板ID',
            dataIndex: 'templateId',
            ellipsisProps: true,
          },
          {
            title: '启用状态',
            dataIndex: 'status',
            width: 90,
            align: 'center',
            render: (data) => <span>{data === 1 ? '启用' : '禁用'}</span>,
          },
          {
            title: '模板内容',
            dataIndex: 'fieldMapping',
            render: (data) => (
              <div>
                {!isArr(data)
                  ? '--'
                  : data.map((item: any) => (
                      <div key={item.id}>
                        {item.fieldAlias}：{`{{${item.templateParamName}.DATA}}`}
                      </div>
                    ))}
              </div>
            ),
          },
          {
            title: '模板示例',
            dataIndex: 'contentArray',
            render: (data) => (
              <div>
                {!isArr(data) ? '--' : data.map((field: any) => <div key={field}>{field}</div>)}
              </div>
            ),
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 110,
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '编辑',
                  onClick: () => openForm(row),
                },
                {
                  text: '删除',
                  modalProps: {
                    title: '确定删除消息模板吗？',
                    onOk: () => handleDelete(row),
                  },
                },
              ],
            },
          },
        ]}
      />
    </>
  );
});
