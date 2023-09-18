import { useCallback } from 'react';
import { Spin, message, Alert } from 'antd';
import { useGeneralTableActions, GeneralTableLayout } from '@/components/Business/Table';

import { UserInfoCache } from '@/services/User';

import { getDomainName, deleteDomainName } from './Api';

import { useDomainNameForm } from './Form';

const { tenantCode } = UserInfoCache.get({});

export default function SystemDomainName() {
  const { actionsRef } = useGeneralTableActions();

  // 创建成功
  const handleCreateSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = useDomainNameForm({
    onAddSuccess: handleCreateSuccess,
  });

  const handleDelete = (row) => {
    const { id } = row;
    deleteDomainName({ id }).then((res) => {
      message.info(res.msg);
      handleCreateSuccess();
    });
  };

  return (
    <>
      {ModalFormElement}
      <Spin spinning={false}>
        <div>
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
            request: () => getDomainName({ tenantCode }),
            defaultAddOperationButtonListProps: {
              text: '新增域名',
              onClick: () => openForm(),
            },
            useTableOptions: {
              formatResult: ({ data }) => ({ data, total: 0 }),
            },
            getActions: actionsRef,
            columns: [
              {
                title: '域名',
                dataIndex: 'domainUrl',
              },
              {
                title: '域名端口',
                dataIndex: 'port',
                render: (text) => <span>{text !== 0 ? '设计平台' : 'pc商城'}</span>,
              },
              {
                title: '域名类型',
                dataIndex: 'type',
                render: (text) => <span>{text !== 0 ? '正式域名' : '临时域名'}</span>,
              },
              {
                title: '协议类型',
                dataIndex: 'isHttps',
                render: (text) => <span>{text !== 0 ? 'https' : 'http'}</span>,
              },
              {
                title: '操作',
                dataIndex: 'id',
                width: 110,
                buttonListProps: {
                  list: ({ row }) => [
                    {
                      text: '编辑',
                      visible: row.type !== 0,
                      onClick: () => openForm(row),
                    },
                    {
                      text: '删除',
                      visible: row.type !== 0,
                      modalProps: {
                        content: (
                          <>
                            <p>确定删除该域名吗？</p>
                          </>
                        ),
                        onOk: () => handleDelete(row),
                      },
                    },
                  ],
                },
              },
            ],
            tableProps: {
              pagination: false,
            },
          }}
        />
      </Spin>
    </>
  );
}
