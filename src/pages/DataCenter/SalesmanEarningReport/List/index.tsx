import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useSalesmanToSelectOptions } from '../../useSalesmanToSelectOptions';
import type { SalesmanReportColumns } from '../../Api';
import { getSalesmanEarningReportList } from '../../Api';
import { todayTime, stringFilterOption } from '../../Constants';

export default function SalesmanEarningReport() {
  const { salesmanSelectOptions } = useSalesmanToSelectOptions();
  const { actionsRef } = useGeneralTableActions<SalesmanReportColumns>();

  const handleGetRequestList = (params: any) => {
    if (!params.start) {
      params.start = todayTime().start;
      params.end = todayTime().end;
    }
    return getSalesmanEarningReportList(params);
  };

  return (
    <>
      <GeneralTableLayout<SalesmanReportColumns>
        request={(params) => handleGetRequestList(params) as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        tableProps={{
          rowKey: 'salesmanId',
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
              salesmanId: {
                title: '选择业务员',
                type: 'string',
                col: 10,
                default: '',
                'x-component-props': {
                  placeholder: '请选择业务员',
                  dataSource: [{ value: '', label: '所有业务员' }, ...salesmanSelectOptions],
                  showSearch: true,
                  filterOption: stringFilterOption,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '业务员',
            dataIndex: 'name',
            width: 200,
          },
          {
            title: '销售排名',
            dataIndex: 'range',
            render: (data, record, index) => <span>{index + 1}</span>,
          },
          {
            title: '待入账金额',
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
            title: '待入账订单笔数',
            dataIndex: 'waitSettleOrderNum',
          },
          {
            title: '入账金额',
            dataIndex: 'settleAmount',
          },
          {
            title: '已入账邀请金额',
            dataIndex: 'inviteAmount',
          },
          {
            title: '已入账推广金额',
            dataIndex: 'spreadAmount',
          },
          {
            title: '入账订单笔数',
            dataIndex: 'settleOrderNum',
          },
          {
            title: '新增商家',
            dataIndex: 'fansIncreaseNum',
          },
          {
            title: '新增业务员',
            dataIndex: 'childIncreaseNum',
          },
        ]}
      />
    </>
  );
}
