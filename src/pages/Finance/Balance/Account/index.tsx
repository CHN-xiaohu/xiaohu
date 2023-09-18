import {
  GeneralTableLayout,
  useGeneralTableActions,
  convenientDateRangeSchema,
} from '@/components/Business/Table';

import styles from './index.less';

import type { AccountColumns } from './Api';
import { getBrandWalletDetail } from './Api';

export default function FinanceBalanceAccount() {
  const { actionsRef } = useGeneralTableActions<AccountColumns>();

  return (
    <>
      <GeneralTableLayout<AccountColumns>
        request={getBrandWalletDetail as any}
        operationButtonListProps={false}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                col: 10,
                'x-component-props': {
                  placeholder: '订单号、支付流水号、名称',
                },
              },
              '[startTime,endTime]': convenientDateRangeSchema({ title: '下单时间' }),
            },
          ],
        }}
        columns={[
          {
            title: '订单号|支付流水号',
            dataIndex: 'walletId',
            width: '10%',
          },
          {
            title: '名称',
            dataIndex: 'cashTypeValue',
            width: '20%',
          },
          {
            title: '交易时间',
            dataIndex: 'createTime',
            width: '12%',
          },
          {
            title: '业务单号',
            dataIndex: 'orderSn',
            width: '8%',
          },
          {
            title: '金额（元）',
            dataIndex: 'amount',
            width: '10%',
            render: (data, records) => (
              <span>
                {Number(records.inoutType) === 1 ? (
                  <span className={styles.green}>+{(Number(data) / 100).toFixed(2)}</span>
                ) : (
                  <span className={styles.red}>-{(Number(data) / 100).toFixed(2)}</span>
                )}
              </span>
            ),
          },
          {
            title: '账户余额',
            dataIndex: 'amountLeft',
            render: (data) => <span>{(Number(data) / 100).toFixed(2)}</span>,
            width: '12%',
          },
          {
            title: '备注',
            dataIndex: 'remark',
            width: '18%',
          },
        ]}
      />
    </>
  );
}
