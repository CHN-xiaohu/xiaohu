import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import { UserInfoCache } from '@/services/User';
import { useRequest } from 'ahooks';

import { Alert, Tooltip } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

import type { IAppointmentDesignPagetColumns } from './Api';
import { getAppointmentDesignPage } from './Api';
import styles from './index.less';

import { getDomainName } from '../Project/Api';

const QuestionTip = ({ tip, children }: React.PropsWithChildren<{ tip: string }>) => (
  <Tooltip title={tip}>
    {children}
    <QuestionCircleOutlined style={{ marginLeft: 6 }} />
  </Tooltip>
);

export default function FinanceBalanceAccount() {
  const { actionsRef } = useGeneralTableActions<IAppointmentDesignPagetColumns>();
  const userInfo = UserInfoCache.get();

  const { data: url } = useRequest(() => getDomainName({ tenantCode: userInfo.tenantCode }), {
    formatResult: (res) => {
      // 获取正式域名
      let viewUrlData = res.data.find((item: any) => item.type === 1 && item.port === 0) as any;

      // 如果不存在，那么就取临时域名
      if (!viewUrlData) {
        viewUrlData = res.data.find((item: any) => item.port === 0);
      }

      return `${
        viewUrlData?.isHttps !== 0 ? 'https' : 'http'
      }://${viewUrlData?.domainUrl.trim()}/design-projects/`;
    },
  });

  return (
    <>
      <div className={styles.alertWrap}>
        <Alert
          showIcon
          message="预约设计：客户浏览3D设计方案，申请预约设计，需根据客户信息和浏览方案，打电话详细沟通需求"
          type="info"
        />
      </div>
      <GeneralTableLayout<IAppointmentDesignPagetColumns>
        request={getAppointmentDesignPage as any}
        operationButtonListProps={false}
        getActions={actionsRef}
        searchProps={{
          cardProps: {
            className: styles.generalTable,
          },
          items: [
            {
              selectField: {
                title: '模糊查询',
                type: 'string',
                col: 10,
                'x-component-props': {
                  placeholder: '方案名称',
                },
              },
              '[startTime,endTime]': {
                title: '预约时间',
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
            title: '客户名称',
            dataIndex: 'userName',
            render: (v) => v || '--',
          },
          {
            title: '手机号码',
            dataIndex: 'linkPhone',
            render: (v) => v || '--',
          },
          {
            title: '方案名称',
            dataIndex: 'designName',
            render: (v, records) =>
              v ? (
                <a href={`${url}${records.designId}`} target="_blank">
                  {v}
                </a>
              ) : (
                '--'
              ),
          },
          // {
          //   title: '来源',
          //   dataIndex: 'createTime',
          //   render: (v) => v || '--',
          // },
          {
            title: '预约时间',
            dataIndex: 'createTime',
            placeholder: '--',
          },
          {
            title: <QuestionTip tip="被申请者为方案预约设计的处理者" children="被申请人" />,
            width: 100,
            dataIndex: 'dealerName',
            placeholder: '--',
          },
        ]}
      />
    </>
  );
}
