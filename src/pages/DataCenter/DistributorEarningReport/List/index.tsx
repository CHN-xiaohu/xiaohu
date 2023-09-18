import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useDistributorToSelectOptions } from '../../useDistributorToSelectOptions';
import type { SalesmanReportColumns } from '../../Api';
import { getDistributorEarningReportList } from '../../Api';
import { todayTime, stringFilterOption } from '../../Constants';

export default function DistributorEarningReport() {
  const { distributorSelectOptions } = useDistributorToSelectOptions();
  const { actionsRef } = useGeneralTableActions<SalesmanReportColumns>();

  const handleGetRequestList = (params: any) => {
    if (!params.start) {
      params.start = todayTime().start;
      params.end = todayTime().end;
    }
    return getDistributorEarningReportList(params);
  };

  return (
    <>
      <GeneralTableLayout<SalesmanReportColumns>
        request={(params) => handleGetRequestList(params) as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        tableProps={{
          rowKey: 'distributorId',
          scroll: { x: 1500 },
          style: { width: 1600 },
        }}
        searchProps={{
          items: [
            {
              '[start,end]': {
                title: '统计时间',
                type: 'convenientDateRange',
                'x-component-props': {
                  defaultValue: [todayTime().start, todayTime().end],
                  format: 'YYYY-MM-DD',
                },
              },
            },
            {
              distributorId: {
                title: '选择分销员',
                type: 'string',
                col: 10,
                default: '',
                'x-component-props': {
                  placeholder: '请选择分销员',
                  dataSource: [{ value: '', label: '所有分销员' }, ...distributorSelectOptions],
                  showSearch: true,
                  filterOption: stringFilterOption,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '分销员',
            dataIndex: 'name',
            width: 200,
          },
          {
            title: '销售排名',
            dataIndex: 'range',
            render: (data, record, index) => <span>{index + 1}</span>,
          },
          {
            title: '待结算金额',
            dataIndex: 'waitSettleAmount',
          },
          {
            title: '待结算邀请金额',
            dataIndex: 'waitInviteAmount',
          },
          {
            title: '待结算推广金额',
            dataIndex: 'waitSpreadAmount',
          },
          {
            title: '待结算订单笔数',
            dataIndex: 'waitSettleOrderNum',
          },
          {
            title: '已结算金额',
            dataIndex: 'settleAmount',
          },
          {
            title: '已结算邀请金额',
            dataIndex: 'inviteAmount',
          },
          {
            title: '已结算推广金额',
            dataIndex: 'spreadAmount',
          },
          {
            title: '已结算订单笔数',
            dataIndex: 'settleOrderNum',
          },
          {
            title: '新增客户/粉丝',
            dataIndex: 'storeIncreaseNum',
          },
          {
            title: '新增分销员',
            dataIndex: 'childIncreaseNum',
          },
        ]}
      />
    </>
  );
}
