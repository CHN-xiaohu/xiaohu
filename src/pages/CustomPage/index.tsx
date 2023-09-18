import { useCallback } from 'react';
import { history } from 'umi';
import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import { useRequest } from 'ahooks';
import { UserInfoCache } from '@/services/User';

import { getCustomerPage, deleteCustomerPage, getDomainName } from './Api';

export default function CustomPage() {
  const { data: url } = useRequest(
    () => getDomainName({ tenantCode: UserInfoCache.get().tenantCode }),
    {
      formatResult: (res) => {
        // 获取正式域名
        let viewUrlData = res.data.find((item) => item.type === 1 && item.port === 0);

        // 如果不存在，那么就取临时域名
        if (!viewUrlData) {
          viewUrlData = res.data.find((item) => item.port === 0);
        }

        return `https://${viewUrlData?.domainUrl.trim()}/pages/`;
      },
    },
  );

  const { actionsRef } = useGeneralTableActions();

  const goToFormPage = (item?: any) => {
    history.push(`/pc/customPage/form${(item?.id && `/${item.id}`) || ''}`);
  };

  // 删除
  const handleDelete = useCallback((value: string) => {
    deleteCustomerPage({ id: value }).then(() => {
      actionsRef.current.reload();
    });
  }, []);

  return (
    <>
      <GeneralTableLayout
        {...{
          getActions: actionsRef,
          request: (params) =>
            getCustomerPage({
              pageNo: params?.current,
              pageSize: params?.size,
              ...params,
            }),
          searchProps: {
            items: [
              {
                pageName: {
                  title: '页面名称',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '页面名称',
                    style: { width: 300 },
                  },
                },
              },
            ],
          },
          defaultAddOperationButtonListProps: {
            text: '新增页面',
            onClick: () => goToFormPage(),
          },
          columns: [
            {
              title: '页面名称',
              dataIndex: 'pageName',
            },
            {
              title: '添加时间',
              dataIndex: 'createTime',
            },
            {
              title: '操作',
              dataIndex: 'id',
              width: 110,
              buttonListProps: {
                list: ({ row }) => [
                  {
                    text: '预览',
                    onClick: () => window.open(`${url}${row.id}`),
                  },
                  {
                    text: '编辑',
                    onClick: () => goToFormPage(row),
                  },
                  {
                    text: '删除',
                    modalProps: {
                      content: (
                        <>
                          <p>确定删除页面吗？</p>
                          <p>删除后，页面无法进行查看、恢复</p>
                        </>
                      ),
                      onOk: () => handleDelete(row.id),
                    },
                  },
                ],
              },
            },
          ],
        }}
      />
    </>
  );
}
