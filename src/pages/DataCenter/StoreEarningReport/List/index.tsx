import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useStoresToSelectOptions } from '../../useStoresToSelectOptions';

import type { StoreEarningReportColumns } from '../../Api';
import { getStoreEarningReportList } from '../../Api';
import { todayTime, stringFilterOption } from '../../Constants';

export default function EarningReport() {
  const { actionsRef } = useGeneralTableActions<StoreEarningReportColumns>();
  const { storesSelectOptions } = useStoresToSelectOptions();

  const handleGetRequestList = (params: any) => {
    if (!params.start) {
      params.start = todayTime().start;
      params.end = todayTime().end;
    }
    return getStoreEarningReportList(params);
  };

  return (
    <>
      <GeneralTableLayout<StoreEarningReportColumns>
        request={(params) => handleGetRequestList(params) as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        tableProps={{
          rowKey: 'storeId',
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
              storeId: {
                title: '选择店铺',
                type: 'string',
                col: 10,
                default: '',
                'x-component-props': {
                  placeholder: '请选择店铺',
                  dataSource: [{ value: '', label: '所有店铺' }, ...storesSelectOptions],
                  showSearch: true,
                  filterOption: stringFilterOption,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '所属店铺',
            dataIndex: 'storeName',
          },
          {
            title: '店铺排名',
            dataIndex: 'range',
            render: (data, record, index) => <span>{index + 1}</span>,
          },
          {
            title: '支付笔数',
            dataIndex: 'transactionNum',
          },
          {
            title: '实付金额',
            dataIndex: 'payAmount',
          },
          {
            title: '销售金额',
            dataIndex: 'saleAmount',
          },
          {
            title: '优惠金额',
            dataIndex: 'discountAmount',
          },
          {
            title: '退款笔数',
            dataIndex: 'refundNum',
          },
          {
            title: '退款金额',
            dataIndex: 'refundAmount',
          },
        ]}
      />
    </>
  );
}
