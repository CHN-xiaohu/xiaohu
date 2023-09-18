import { useEffect, memo } from 'react';
import { useGeneralTableActions } from '@/components/Business/Table';
import { GeneralTableLayout } from '@/components/Business/Table';
import { createAsyncFormActions } from '@formily/antd';

import { formatResult, searchPropsItems } from './Common';

import type { IMerchantBalanceDetailsColumns } from '../../Api';
import { getMerchantStoredValueBalanceDetails } from '../../Api';

type Props = {
  walletId: string;
  count: number;
};

const items = searchPropsItems({ timeTitle: '时间' });

const formActions = createAsyncFormActions();

export const WaterNumber = ({ record }: { record: any }) => {
  const paymentOrderNum = record?.paymentOrderNum;
  const channelTradeNo = record?.channelTradeNo;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {!!paymentOrderNum && (
        <div style={{ whiteSpace: 'nowrap' }}>商户订单号: {paymentOrderNum}</div>
      )}
      {!!channelTradeNo && <div style={{ whiteSpace: 'nowrap' }}>流水号: {channelTradeNo}</div>}
      {!paymentOrderNum && !channelTradeNo && '--'}
    </div>
  );
};

const Main = ({ walletId, count }: Props) => {
  const { actionsRef } = useGeneralTableActions<IMerchantBalanceDetailsColumns>();

  useEffect(() => {
    actionsRef.current.reload();
    formActions.reset();
  }, [count]);

  return (
    <GeneralTableLayout<IMerchantBalanceDetailsColumns, any>
      request={getMerchantStoredValueBalanceDetails}
      useTableOptions={{ formatSearchParams: (params) => ({ ...params, walletId }), formatResult }}
      getActions={actionsRef}
      searchProps={{
        actions: formActions,
        items,
      }}
      operationButtonListProps={false}
      columns={[
        {
          title: '操作人',
          dataIndex: 'operatorUsername',
          render: (v) => v || '--',
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          width: 178,
        },
        {
          title: '明细类型',
          dataIndex: 'cashTypeValue',
        },
        {
          title: '订单编号',
          dataIndex: 'orderSn',
          render: (v) => v || '--',
        },
        {
          title: '支付方式',
          dataIndex: 'payWay',
          render: (v) => v || '--',
        },
        {
          title: '流水编号',
          dataIndex: 'channelTradeNo',
          render: (_, record) => <WaterNumber record={record} />,
        },
        {
          title: '流水金额',
          dataIndex: 'amount',
        },
        {
          title: '储值卡余额',
          dataIndex: 'amountLeft',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 178,
          render: (v) => v || '--',
        },
        {
          title: '到账账号',
          dataIndex: 'arriveAccount',
          width: 178,
          render: (v) => v || '--',
        },
      ]}
    />
  );
};

export const StoredValue = memo(Main);
