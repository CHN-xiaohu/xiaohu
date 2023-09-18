import { useState } from 'react';

import { SearchFrom } from '@/components/Business/Formily/components/Forms/SearchForm';

import { useMount } from 'ahooks';
import { transformPennyToDecimal } from '@/utils';

import { useStoresToSelectOptions } from '../useStoresToSelectOptions';

import conversionBg from '../Image/conversion-bg@2x.png';

import type { TransactionColumns } from '../Api';
import { getTransactionEarningReportMap } from '../Api';
import { todayTime, stringFilterOption } from '../Constants';
import './index.less';

export default function TransactionAnalysis() {
  const [isShowSelectStoreId, setShowSelectStoreId] = useState(false);
  const { storesSelectOptions } = useStoresToSelectOptions();
  const [transactionDetail, setTransactionDetail] = useState({} as TransactionColumns);

  const handleSelect = (value: any) => {
    setShowSelectStoreId(value === 0);
  };

  const handleGetTransactionMap = (params: any) => {
    if (Number(params?.sourceType) !== 0) {
      setShowSelectStoreId(false);
      params.storeId = '';
    }
    if (!params.start) {
      params.start = todayTime().start;
      params.end = todayTime().end;
    }

    getTransactionEarningReportMap(params).then((res) => {
      setTransactionDetail(res?.data);
    });
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
        sourceType: {
          title: '数据来源',
          type: 'string',
          'x-component-props': {
            onSelect: handleSelect,

            placeholder: '所有/小程序/APP/PC',
          },
          enum: [
            {
              label: '所有',
              value: '',
            },
            {
              label: '小程序',
              value: 0,
            },
            {
              label: 'APP',
              value: 1,
            },
            {
              label: 'PC',
              value: 2,
            },
          ],
        },
        storeId: {
          title: '选择店铺',
          type: 'string',
          default: '',
          visible: isShowSelectStoreId,
          'x-component-props': {
            placeholder: '请选择店铺',
            dataSource: [{ value: '', label: '所有店铺' }, ...storesSelectOptions],
            showSearch: true,
            filterOption: stringFilterOption,
          },
        },
      },
    ],
  };

  const moneyList = [
    {
      title: '支付金额（元）',
      money: transformPennyToDecimal(transactionDetail?.payAmount || 0),
    },
    {
      title: '支付订单数',
      money: transactionDetail?.transactionNum || 0,
    },
    {
      title: '支付人数',
      money: transactionDetail?.payPeopleNum || 0,
    },
    {
      title: '支付件数',
      money: transactionDetail?.payItemNum || 0,
    },
    {
      title: '下单笔数',
      money: transactionDetail?.orderNum || 0,
    },
    {
      title: '成功退款金额',
      money: transformPennyToDecimal(transactionDetail?.refundAmount || 0),
    },
  ];

  return (
    <div>
      <SearchFrom
        {...{ onSearch: searchSubmit as any, onReset: handleReset as any, ...searchProps }}
      />
      <div className="transactionAnalysis">
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
        <div className="storeTrade">
          <div className="titleLine">
            <span className="titleIcon">|</span>店铺交易转化
          </div>
          <div className="middleContent">
            <div className="listLine">
              <div className="customerLine customerBg">
                <div className="oneCustomer">
                  <span className="titleColor">访客数 &nbsp;&nbsp;&nbsp;-</span>
                  <span className="moneyColor">{transactionDetail?.vistorNum || 0}</span>
                </div>
              </div>
              <div className="customerLine orderBg">
                <div className="oneCustomer">
                  <span className="titleColor">下单人数 &nbsp;&nbsp;&nbsp;-</span>
                  <span className="moneyColor">{transactionDetail?.orderPeopleNum || 0}</span>
                </div>
                <div className="oneCustomer customerLeft">
                  <span className="titleColor">下单金额</span>
                  <span className="moneyColor">
                    {transformPennyToDecimal(transactionDetail?.saleAmount || 0)}
                  </span>
                </div>
              </div>
              <div className="customerLine payBg">
                <div className="oneCustomer">
                  <span className="titleColor">支付人数 &nbsp;&nbsp;&nbsp;-</span>
                  <span className="moneyColor">{transactionDetail?.payPeopleNum || 0}</span>
                </div>
                <div className="oneCustomer customerLeft">
                  <span className="titleColor">支付金额（元） &nbsp;&nbsp;&nbsp;-</span>
                  <span className="moneyColor">
                    {transformPennyToDecimal(transactionDetail?.payAmount || 0)}
                  </span>
                </div>
                <div className="oneCustomer customerLeft">
                  <span className="titleColor">客单价（元） &nbsp;&nbsp;&nbsp;-</span>
                  <span className="moneyColor">
                    {transformPennyToDecimal(transactionDetail?.payEachPrice || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="rightImg">
              <img className="imgSize" src={conversionBg} />
            </div>
            <div className="tipsContent">
              <div className="tipsUse oneMain">
                <span className="tipsTitle">访问-下单转化率</span>
                <span>
                  {(
                    (Number(transactionDetail?.orderPeopleNum) /
                      Number(transactionDetail?.vistorNum)) *
                      100 || 0.0
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <div className="tipsUse twoMain">
                <span className="tipsTitle twoTitle">下单-支付转化率</span>
                <span>
                  {(
                    (Number(transactionDetail?.payPeopleNum) /
                      Number(transactionDetail?.orderPeopleNum)) *
                      100 || 0.0
                  ).toFixed(2)}
                  %
                </span>
              </div>
              <div className="tipsUse threeMain">
                <span className="tipsTitle threeTitle">访问-支付转化率</span>
                <span>
                  {(
                    (Number(transactionDetail?.payPeopleNum) /
                      Number(transactionDetail?.vistorNum)) *
                      100 || 0.0
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
