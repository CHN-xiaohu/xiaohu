import { useCallback } from 'react';

import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';
import { useModal } from '@/foundations/hooks';
import { toFixed } from '@/components/Library/MoneyText';
import { WaterNumber } from '@/pages/Finance/Balance/Merchant/components/DetailListModal/StoredValue';
import { payWays } from '@/pages/Finance/Balance/Merchant/components/DetailListModal/Wallet';

import { getStoreChargeRecord } from '../Api';

export const useGoldMerchantPayModal = () => {
  const { openModal, closeModal, modalElement: ModalGoldMerchantPayElement } = useModal({
    title: '商家会员付费管理',
    bodyStyle: {
      height: '75vh',
    },
    footer: false,
  });

  const openGoldMerchantPay = useCallback(
    () =>
      openModal({
        children: (
          <GeneralTableLayout
            request={getStoreChargeRecord}
            placeholder="--"
            operationButtonListProps={false}
            toolBarProps={false}
            tableProps={{
              tableLayout: 'auto',
            }}
            searchProps={{
              items: [
                {
                  queryStore: {
                    title: '模糊查询',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '商家名称/手机号',
                    },
                  },
                  '[startTime,endTime]': convenientDateRangeSchema({ title: '操作时间' }),
                },
                {
                  transNumber: {
                    title: '流水号',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '商户订单号/交易流水号',
                    },
                  },
                  payWay: {
                    title: '支付方式',
                    type: 'checkableTags',
                    'x-component-props': {
                      options: generateDefaultSelectOptions([
                        {
                          label: '储值卡',
                          value: 1,
                        },
                        {
                          label: '钱包余额',
                          value: 2,
                        },
                        {
                          label: '支付宝',
                          value: 3,
                        },
                        {
                          label: '微信',
                          value: 4,
                        },
                      ]),
                    },
                  },
                },
              ],
            }}
            columns={[
              {
                title: '订单编号',
                width: 178,
                dataIndex: 'paymentOrderNum',
              },
              {
                title: '商家名称',
                dataIndex: 'storeName',
                ellipsisProps: true,
              },
              {
                title: '注册手机号',
                width: 178,
                dataIndex: 'linkPhone',
              },
              {
                title: '实付金额',
                width: 108,
                dataIndex: 'totalMoney',
                render: (v) => `￥${toFixed(v)}` || '--',
              },
              {
                title: '支付方式',
                dataIndex: 'payWay',
                width: 108,
                render: (v) => payWays[v] || '--',
              },
              {
                title: '交易流水号',
                width: 258,
                dataIndex: 'channelTradeNo',
                render: (_, record) => <WaterNumber record={record} />,
              },
              {
                title: '操作时间',
                width: 178,
                dataIndex: 'updateTime',
              },
            ]}
          />
        ),
      }),
    [closeModal],
  );

  return {
    openGoldMerchantPay,
    closeGoldMerchantPay: closeModal,
    ModalGoldMerchantPayElement,
  };
};
