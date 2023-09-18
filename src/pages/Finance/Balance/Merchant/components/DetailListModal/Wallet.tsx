import { useRef, useEffect, memo } from 'react';

import type { TableActions } from '@/components/Business/Table';
import { GeneralTableLayout } from '@/components/Business/Table';

import { formatResult, searchPropsItems } from './Common';
import { WaterNumber } from './StoredValue';

import type { IMerchantBalanceDetailsColumns } from '../../Api';
import { getMerchantBalanceDetails } from '../../Api';
import { walletCashTypeSelectOptions } from '../../Constant';

type Props = {
  walletId: string;
  count: number;
};

const items = searchPropsItems({ cashTypeOptions: walletCashTypeSelectOptions });

export const payWays = { 1: '储值卡', 2: '钱包余额', 3: '支付宝', 4: '微信' };

const Main = ({ walletId, count }: Props) => {
  const actionsRef = useRef({} as TableActions<IMerchantBalanceDetailsColumns>);

  useEffect(() => {
    actionsRef.current.reload();
  }, [count]);

  return (
    <GeneralTableLayout<IMerchantBalanceDetailsColumns, any>
      request={getMerchantBalanceDetails}
      useTableOptions={{
        formatSearchParams: (params) => ({ ...params, walletId }),
        formatResult,
      }}
      getActions={actionsRef}
      searchProps={{
        items,
      }}
      operationButtonListProps={false}
      toolBarProps={false}
      columns={[
        {
          title: '操作人',
          dataIndex: 'operatorUsername',
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
          render: (v) => payWays[v] || '--',
        },
        {
          title: '交易流水号',
          dataIndex: 'channelTradeNo',
          render: (_, record) => <WaterNumber record={record} />,
        },
        {
          title: '流水金额',
          dataIndex: 'amount',
        },
        {
          title: '钱包余额',
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

export const Wallet = memo(Main);
