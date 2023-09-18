import { memo, useCallback, useEffect } from 'react';
import { Alert } from 'antd';

import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { history } from 'umi';

import { useDomainNameForm } from './Form';

import { getPcDomainName } from '../../Api';

type Props = {
  count: number;
};

export const DomainNameConfig = memo(({ count }: Props) => {
  const { actionsRef } = useGeneralTableActions();
  const { tenantCode } = history.location.query;

  // 创建成功
  const handleCreateSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = useDomainNameForm({
    onAddSuccess: handleCreateSuccess,
  });

  useEffect(() => {
    actionsRef.current.reload();
  }, [count]);

  return (
    <>
      {ModalFormElement}

      <div style={{ marginBottom: 24 }}>
        <Alert
          showIcon
          message={
            <div>
              解析指向：
              {process.env.APP_NODE_ENV === 'production' ? '212.129.163.148' : '49.234.244.14'}
            </div>
          }
          type="info"
        />
      </div>

      <GeneralTableLayout
        {...{
          getActions: actionsRef,
          request: (params) => getPcDomainName({ tenantCode, ...params }),
          useTableOptions: {
            formatResult: (res) => ({
              data: res.data,
              total: res.total || 0,
            }),
          },
          defaultAddOperationButtonListProps: {
            text: '新增域名',
            onClick: () => openForm(),
          },
          tableProps: {
            pagination: false,
          },
          columns: [
            {
              title: '域名',
              dataIndex: 'domainUrl',
              width: '260px',
              render: (text) => <div style={{ width: '260px' }}>{text}</div>,
            },
            {
              title: '域名端口',
              dataIndex: 'port',
              render: (text) => <span>{text === 1 ? '设计平台' : 'pc商城'}</span>,
            },
            {
              title: '域名类型',
              dataIndex: 'type',
              render: (text) => <span>{text === 1 ? '正式域名' : '临时域名'}</span>,
            },
            {
              title: '协议类型',
              dataIndex: 'isHttps',
              render: (text) => <span>{text !== 0 ? 'https' : 'http'}</span>,
            },
            {
              title: '操作',
              dataIndex: 'id',
              buttonListProps: {
                list: ({ row }) => [
                  {
                    text: '编辑',
                    visible: row.type !== 1,
                    onClick: () => openForm(row),
                  },
                ],
              },
            },
          ],
        }}
      />
    </>
  );
});
