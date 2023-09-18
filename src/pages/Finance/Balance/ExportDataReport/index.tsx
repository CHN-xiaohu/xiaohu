import {
  useGeneralTableActions,
  GeneralTableLayout,
  convenientDateRangeSchema,
} from '@/components/Business/Table';
import { Button } from 'antd';

import { BodyRow, useTableRowAutoWidth } from '@/pages/Order/components/BodyRow';

import { Question } from '@/pages/Dashboard/Workplace';
import { useRequest } from 'ahooks';

import { Row } from './BodyRow';
import type { IExportReportColumns } from './Api';
import { downloadExcel, getExportReportRecording } from './Api';

import { orderStatus } from '../PurchasePayment';

export const reportTypeData = {
  1: '采购单支付记录',
  2: '销售单支付记录',
};

const reportBuildStatus = {
  0: '报表生成中',
  1: '下载报表',
  2: '报表生成失败',
};

const reportBuildStatusColorMap = {
  0: '#1890ff',
  2: '#f5222d',
};

export const processData = (obj: Record<string, any>) => {
  return Object.keys(obj).map((value) => ({
    value,
    label: obj[value],
  }));
};

export default function ExportDataReport({
  match: {
    params: { reportType },
  },
}: any) {
  const { actionsRef } = useGeneralTableActions<IExportReportColumns>();
  const { targetDomRef } = useTableRowAutoWidth();

  const { run } = useRequest((id) => downloadExcel({ id }), {
    manual: true,
    onSuccess: (result) => {
      window.open(result.data);
    },
  });

  const searchItem: any = [
    {
      '[startTime,endTime]': convenientDateRangeSchema({ title: '申请时间' }),
      reportType: {
        title: '报表类型',
        type: 'string',
        default: reportType,
        'x-component-props': {
          placeholder: '请选择报表类型',
          dataSource: processData(reportTypeData),
        },
      },
    },
  ];

  const columnsList: any = [
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '30%',
      render: (_: any, records: any) => (
        <span>
          创建时间: {`${records.conditionStartTime} —— ${records.conditionEndTime}` || '--'}
        </span>
      ),
    },
    {
      title: '模糊查询',
      dataIndex: 'conditionName',
      width: '30%',
      render: (data: any) => <span>模糊查询: {data || '--'}</span>,
    },
    {
      title: '订单类型',
      dataIndex: 'conditionOrderType',
      width: '20%',
      render: (data: any) => (
        <span>订单类型: {data === 0 ? '全部' : data ? orderStatus[data] : '--'}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'reportBuildStatus',
      render: (data: any, records: any) => (
        <>
          {data === 1 && <Button onClick={() => run(records.id)}>{reportBuildStatus[data]}</Button>}
          {data !== 1 && (
            <span style={{ color: reportBuildStatusColorMap[data] }}>
              {reportBuildStatus[data]}
            </span>
          )}
          {data === 2 && (
            <Question iconStyle={{ marginLeft: 6 }} title="" dataSource={[records.faildReason]} />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <GeneralTableLayout<IExportReportColumns, any>
        request={(params) =>
          getExportReportRecording({ ...params, reportType: params.reportType ?? reportType })
        }
        getActions={actionsRef}
        searchProps={{
          items: searchItem,
        }}
        operationButtonListProps={false}
        tableContainerRef={targetDomRef}
        columns={columnsList}
        tableProps={{
          className: 'order-table-wrap',
          bordered: false,
          components: {
            body: {
              row: BodyRow(Row),
            },
          },
        }}
      />
    </>
  );
}
