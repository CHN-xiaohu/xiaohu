import { GeneralTableLayout } from '@/components/Business/Table';
import { generateCode } from '@/pages/BrandOwner/Api';
import { versionTypes } from '@/pages/BrandOwner/List';
import { useRequest } from 'ahooks';
import { stringify } from 'qs';

import type { IMerchantManagementColumns } from './Api';
import { getMerchantManagement } from './Api';

export default function Merchant() {
  const windows = typeof window !== 'undefined' ? window : ({} as any);
  const { data: loginCode, run } = useRequest(
    (params) => generateCode({ account: params.account, loginTenantCode: params.loginTenantCode }),
    {
      formatResult: (res) => res.data,
      manual: true,
      onSuccess: (result, params: any) => {
        if (result) {
          // eslint-disable-next-line max-len
          const openWin = windows.open(
            `https://${params[0]?.domain}/users/login?${stringify({
              grantType: 'pps_oauth',
              account: params[0]?.account,
              code: loginCode,
            })}`,
            '_blank',
          );
          openWin.opener = null;
        }
      },
    },
  );

  const jumpLanding = (_data: any, records: any) => {
    run({
      account: records?.tenantAccount,
      loginTenantCode: records?.tenantCode,
      domain: records?.domain,
    });
  };
  return (
    <>
      <GeneralTableLayout<IMerchantManagementColumns>
        request={getMerchantManagement}
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              selectField: {
                title: '模糊查询',
                type: 'string',
                col: 10,
                'x-component-props': {
                  placeholder: '商户名称/联系人手机号',
                },
              },
              '[checkStartDate,checkEndDate]': {
                title: '开通时间',
                type: 'convenientDateRange' as 'convenientDateRange',
                col: 16,
                'x-props': {
                  itemClassName: 'search-form__convenientDateRange',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '商户名称',
            dataIndex: 'tenantName',
            render: (v, records) => (v ? <a onClick={() => jumpLanding(v, records)}>{v}</a> : '--'),
          },
          {
            title: '商户账号',
            dataIndex: 'tenantAccount',
            render: (v) => v || '--',
          },
          {
            title: '联系人',
            dataIndex: 'linkman',
            render: (v) => v || '--',
          },
          {
            title: '联系手机',
            dataIndex: 'contactNumber',
            render: (v) => v || '--',
          },
          {
            title: '商户域名',
            dataIndex: 'domain',
            render: (v) => v || '--',
          },
          {
            title: '版本类型',
            dataIndex: 'versionType',
            render: (v) => versionTypes[v] || '--',
          },
          {
            title: '开通时间',
            dataIndex: 'createTime',
          },
          {
            title: '截止时间',
            dataIndex: 'updateTime',
          },
        ]}
      />
    </>
  );
}
