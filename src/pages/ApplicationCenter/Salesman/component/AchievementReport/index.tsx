import { GeneralTableLayout } from '@/components/Business/Table';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import { Card } from 'antd';

import type { AchievementReportColumn } from '../../Api';
import '../../index.less';

export default function AchievementReport() {
  return (
    <Card>
      <div className="achievement">
        <div>
          <ExclamationCircleOutlined className="iconImg" />
          业绩报表统计日期以订单分佣金额入账时间为准
        </div>
        <div className="bottomLine">
          月汇总账单在次月首日凌晨3时生成。如遇特殊情况，则可能产生延迟生成情况，请谅解
        </div>
      </div>
      <GeneralTableLayout<AchievementReportColumn>
        searchProps={{
          minItem: 3,
          items: [
            {
              months: {
                title: '月份',
                type: 'month',
              },
              name: {
                title: '业务员',
                type: 'string',
                'x-component-props': {
                  placeholder: '请选择业务员',
                },
              },
            },
          ],
        }}
        operationButtonListProps={{
          list: [
            {
              text: '导出汇总报表',
              type: 'primary',
              onClick: () => {
                console.log('导出汇总报表');
              },
            },
            {
              text: '导出报表明细',
              type: 'primary',
              onClick: () => {
                console.log('导出报表明细');
              },
            },
          ],
        }}
        columns={[
          {
            title: '业务员',
            dataIndex: 'string',
          },
          {
            title: '日期',
            dataIndex: 'date',
          },
          {
            title: '入账金额（元）',
            dataIndex: 'money',
          },
          {
            title: '订单笔数',
            dataIndex: 'orderCount',
          },
          {
            title: '操作',
            dataIndex: 'id',
          },
        ]}
      />
    </Card>
  );
}
