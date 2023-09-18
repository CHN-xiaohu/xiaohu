import {
  GeneralTableLayout,
  generateDefaultSelectOptions,
  useGeneralTableActions,
} from '@/components/Business/Table';
import { history } from 'umi';
import { DatePicker } from '@/components/Antd';
import { message, Modal } from 'antd';
import { usePersistFn, useRequest } from 'ahooks';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { createAsyncFormActions } from '@formily/antd';
import { isStr } from '@/utils';
import { useImmer } from 'use-immer';
import { useDebounceWatch } from '@/foundations/hooks';

import type { ISalesOrderPaymentColumns } from './Api';
import { getSalesOrderPaymentDetails } from './Api';

import { orderStatus } from '../PurchasePayment';
import { payWays } from '../Merchant/components/DetailListModal/Wallet';
import { processData } from '../ExportDataReport';
import { createExportReportTask } from '../PurchasePayment/Api';

const { RangePicker } = DatePicker;

const transformMomentToString = (value: Dayjs, format = 'YYYY-MM-DD HH:mm:ss') =>
  value?.format ? value.format(format) : value;

const transformToMoment = (value: string | Dayjs, format = 'YYYY-MM-DD HH:mm:ss') =>
  isStr(value) ? dayjs(value, format) : value;

export const TimeLimit = ({
  value = [],
  onChange,
  defaultValue = [],
}: {
  value: any[];
  defaultValue: any[];
  onChange: (values: (string | Dayjs)[]) => void;
}) => {
  const format = 'YYYY-MM-DD HH:mm:ss';
  const fetchValue = value.length > 0 ? value : defaultValue;
  const [dates, setDates] = useState([]);

  const [state, setState] = useImmer({
    internalValue: (value.length > 0 ? value : defaultValue).map((date: string | Dayjs) =>
      transformToMoment(date, format),
    ) as any,
  });

  const disabledDate = (current: any) => {
    if (current > dayjs().endOf('day')) {
      return true;
    }
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'month') > 2;
    const tooEarly = dates[1] && dates[1].diff(current, 'month') > 2;
    return tooEarly || tooLate;
  };

  useEffect(() => {
    setTimeout(() => {
      const inputDivs = document.querySelectorAll('.ant-picker-input');
      inputDivs[1]?.firstChild.addEventListener('click', () => {
        dates[0] = dayjs(inputDivs[0]?.firstChild.value);
        setDates(dates);
      });
    });
  }, []);

  const handleEmitChange = usePersistFn((changeDates: any[]) => {
    const dateArr = changeDates || [];
    if (onChange) {
      onChange(dateArr.map((date) => transformMomentToString(date, format)));
    } else {
      setState((draft) => {
        draft.internalValue = dateArr.map((date) => dayjs(date, format));
      });
    }
  });

  const handleDateChange = useCallback(
    (changeDates: any[]) => {
      handleEmitChange(changeDates);
    },
    [handleEmitChange],
  );

  useDebounceWatch(
    () => {
      if (fetchValue) {
        setState((draft) => {
          draft.internalValue = (value?.length > 0 ? value : defaultValue).map((date) =>
            transformToMoment(date, format),
          );
        });
      }
    },
    [value],
    { ms: 16, immediate: true },
  );

  return (
    <RangePicker
      format={format}
      disabledDate={disabledDate}
      value={state.internalValue}
      showTime={{
        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      }}
      onCalendarChange={(val: any) => setDates(val)}
      onChange={handleDateChange}
    />
  );
};

export default function SalesPayment() {
  const { actionsRef } = useGeneralTableActions<ISalesOrderPaymentColumns>();
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
      reportType: 2,
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
          history.push(`/finances/export-data-report/2`);
        }}
      >
        报表生成中，请耐心等待！
      </Modal>
      <GeneralTableLayout<ISalesOrderPaymentColumns>
        request={getSalesOrderPaymentDetails as any}
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
              onClick: () => history.push('/finances/export-data-report/2'),
            },
          ],
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                col: 12,
                'x-component-props': {
                  placeholder: '订单号/商户订单号/交易流水号',
                },
              },
              '[startTime,endTime]': {
                title: '创建时间',
                col: 12,
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
