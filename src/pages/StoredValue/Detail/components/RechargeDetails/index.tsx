import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';
import { SearchFrom } from '@/components/Business/Formily/components/Forms/SearchForm';
import { WaterNumber } from '@/pages/Finance/Balance/Merchant/components/DetailListModal/StoredValue';
import { useMount } from 'ahooks';
import { useMemo, useState } from 'react';
import './index.less';
import type { IStatisticsColumn, IStoreValueActivitiesDetailColumn } from '@/pages/StoredValue/Api';
import { getStatistics, getStoreValueActivitiesDetail } from '@/pages/StoredValue/Api';
import type { RouteChildrenProps } from '@/typings/basis';

export const RechargeDetails = ({ match }: RouteChildrenProps) => {
  const [transactionDetail, setTransactionDetail] = useState({} as IStatisticsColumn);
  const { actionsRef } = useGeneralTableActions<IStoreValueActivitiesDetailColumn>();

  const handleGetTransactionMap = (params: any) => {
    getStatistics({ id: match.params.id, ...params }).then((res) => {
      setTransactionDetail(res?.data);
    });
    if (!params.name) {
      params.name = '';
    }
    if (!params.startTime) {
      params.startTime = '';
    }
    if (!params.endTime) {
      params.endTime = '';
    }
    actionsRef.current.reload({ searchFormData: { id: match.params.id, ...params } });
  };

  useMount(() => {
    handleGetTransactionMap({});
  });

  const handleReset = () => {
    handleGetTransactionMap({});
  };
  const searchSubmit = (data: any) => {
    handleGetTransactionMap(data);
  };

  const searchProps = {
    minItem: 3,
    items: [
      {
        name: {
          title: '模糊查询',
          type: 'string',
          'x-component-props': {
            placeholder: '商品店铺名称/手机号/流水号',
          },
        },
        '[startTime,endTime]': convenientDateRangeSchema({ title: '充值时间' }),
      },
    ],
  };

  const moneyList = [
    {
      title: '充值金额(元)',
      money: transactionDetail?.totalRechargeAmountMoney || 0,
    },
    {
      title: '到账金额(元)',
      money: transactionDetail?.totalAmountAccountMoney || 0,
    },
    {
      title: '赠送金额(元)',
      money: transactionDetail?.totalCreditMoney || 0,
    },
    {
      title: '充值商家数(人)',
      money: transactionDetail?.totalStoreRecharge || 0,
    },
    {
      title: '充值笔数',
      money: transactionDetail?.totalRecharge || 0,
    },
  ];

  const RenderSearchForm = useMemo(
    () =>
      searchProps && (
        <SearchFrom
          {...{ onSearch: searchSubmit as any, onReset: handleReset as any, ...searchProps }}
        />
      ),
    [handleReset, searchProps, searchSubmit],
  );

  return (
    <div>
      {RenderSearchForm}
      <div className="topContent">
        {moneyList?.map((items) => {
          return (
            <div key={items.title} className="oneItem">
              <span className="moneyBottom">{items.money}</span>
              <span className="moneyTitle">{items.title}</span>
            </div>
          );
        })}
      </div>
      <GeneralTableLayout<any>
        className="rechargeDetailTable"
        request={(params) => getStoreValueActivitiesDetail({ id: match.params.id, ...params })}
        getActions={actionsRef}
        operationButtonListProps={false}
        toolBarProps={false}
        columns={[
          {
            title: '活动名称',
            dataIndex: 'eventName',
            render: (v) => v || '--',
          },
          {
            title: '商家名称',
            dataIndex: 'storeName',
            render: (v) => v || '--',
          },
          {
            title: '注册手机号',
            dataIndex: 'linkPhone',
            render: (v) => v || '--',
          },
          {
            title: '充值金额',
            dataIndex: 'amount',
            render: (v) => v || '--',
          },
          {
            title: '赠送金额',
            dataIndex: 'give',
            render: (v) => v || '--',
          },
          {
            title: '到账金额',
            dataIndex: 'accountAmount',
            render: (v) => v || '--',
          },
          {
            title: '支付方式',
            dataIndex: 'channelCode',
            render: (v) => v || '--',
          },
          {
            title: '交易流水号',
            dataIndex: 'channelTradeNo',
            render: (_, record) => <WaterNumber record={record} />,
          },
          {
            title: '充值时间',
            dataIndex: 'createTime',
            render: (v) => v || '--',
            width: 178,
          },
        ]}
      />
    </div>
  );
};
