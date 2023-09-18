import {
  GeneralTableLayout,
  generateDefaultSelectOptions,
  useGeneralTableActions,
} from '@/components/Business/Table';
import { history } from 'umi';
import { createAsyncFormActions } from '@formily/antd';
import { useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { useRequest } from 'ahooks';

import type { IOrderPaymentColumns } from './Api';
import { createExportReportTask } from './Api';
import { getPurchaseOrderPaymentDetails } from './Api';

import { payWays } from '../Merchant/components/DetailListModal/Wallet';
import { processData } from '../ExportDataReport';
import { TimeLimit } from '../SalesPayment/index';

export const orderStatus = {
  2: '已取消',
  3: '待发货',
  4: '已发货',
  5: '待收货',
  6: '已完成',
  7: '退款中',
};

export default function PurchasePayment() {
  const { actionsRef } = useGeneralTableActions<IOrderPaymentColumns>();
  const formActions = useMemo(() => createAsyncFormActions(), []);
  const [visible, setVisible] = useState(false);

  const { run } = useRequest((params) => createExportReportTask(params), {
    manual: true,
    onSuccess: (result: any) => {
      if (result.success) {
        setVisible(true);
      }
    },
  });

  const exportReport = async () => {
    const { values } = await formActions.getFormState();
    const params = {
      conditionName: values?.content,
      conditionOrderType: values?.orderStatus,
      conditionStartTime: values?.startTime,
      conditionEndTime: values?.endTime,
      reportType: 1,
    };
    if (!params.conditionStartTime && !params.conditionEndTime) {
      message.warning('请选择创建时间区间');
    }
    if (!!params.conditionStartTime && !!params.conditionEndTime) {
      run(params);
    }
  };

  return (
    <>
      <Modal
        title="提示"
        width={250}
        okText="前往查看报表"
        cancelText="暂不查看"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          history.push(`/finances/export-data-report/1`);
        }}
      >
        报表生成中，请耐心等待！
      </Modal>
      <GeneralTableLayout<IOrderPaymentColumns>
        request={getPurchaseOrderPaymentDetails as any}
        getActions={actionsRef}
        tableProps={{
          scroll: { x: 1500 },
          style: { width: 1600 },
        }}
        operationButtonListProps={false}
        searchProps={{
          actions: formActions,
          components: {
            TimeLimit,
          },
          list: [
            {
              text: '导出',
              type: 'primary',
              onClick: async () => {
                exportReport();
              },
            },
            {
              text: '查看已导出报表',
              type: 'text',
              onClick: () => history.push(`/finances/export-data-report/1`),
            },
          ],
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                col: 10,
                'x-component-props': {
                  placeholder: '订单号/商户订单号/交易流水号',
                },
              },
              '[startTime,endTime]': {
                title: '创建时间',
                col: 16,
                type: 'TimeLimit' as 'convenientDateRange',
                'x-props': {
                  itemClassName: 'search-form__convenientDateRange',
                },
              },
            },
            {
              orderStatus: {
                title: '订单状态',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions(processData(orderStatus)),
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '订单编号',
            dataIndex: 'orderSn',
            width: 140,
          },
          {
            title: '支付方式',
            dataIndex: 'payWay',
            render: (v) => payWays[v] || '--',
          },
          {
            title: '交易流水号',
            dataIndex: 'channelTradeNo',
          },
          {
            title: '商户订单号',
            dataIndex: 'paymentOrderNum',
            render: (v) => v || '--',
          },
          {
            title: '金额（元）',
            dataIndex: 'paymentAmount',
          },
          {
            title: '退款金额（元）',
            dataIndex: 'refundAmount',
            render: (v) => v || '--',
          },
          {
            title: '支付状态',
            dataIndex: 'paymentStatus',
          },
          {
            title: '订单状态',
            dataIndex: 'orderStatus',
            render: (v) => orderStatus[v] || '--',
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 160,
          },
          {
            title: '支付时间',
            dataIndex: 'payTime',
            width: 160,
            render: (v) => v || '--',
          },
        ]}
      />
    </>
  );
}
