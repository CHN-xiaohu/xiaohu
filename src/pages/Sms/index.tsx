import { useGeneralTableActions, GeneralTableLayout } from '@/components/Business/Table';

import { useState } from 'react';
import { useMount } from 'ahooks';
import { Card } from 'antd';

import { UserInfoCache } from '@/services/User';

import type { smsColumns } from './Api';
import { getSmsList } from './Api';

import styles from './index.less';

export default function Sms() {
  const { actionsRef } = useGeneralTableActions<smsColumns>();

  const { tenantCode } = UserInfoCache.get({});
  const [surplusAmount, setSurplusAmount] = useState(0);
  const smsStatus = ['', '等待回执', '发送失败', '发送成功'];

  const request = (params: any) => {
    const query = {
      tenantCode,
      ...params,
    };
    return getSmsList({ ...query });
  };

  useMount(() => {
    const params = {
      current: 1,
      size: 10,
      tenantCode,
    };
    getSmsList(params).then((res) => {
      setSurplusAmount(res.data.surplusAmount);
    });
  });

  return (
    <Card>
      <div className={styles.sms}>
        <span className={styles.title}>
          剩余短信条数：<span>{surplusAmount}</span>条
        </span>
        {surplusAmount < 50 && (
          <span className={styles.tips}>
            短信条数不足，请添加客服微信：
            <span className={styles.recharge}>18923105835</span>，进行短信充值
          </span>
        )}
      </div>
      <GeneralTableLayout<smsColumns, any>
        request={request as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        useTableOptions={{
          formatResult: (res) => ({
            total: res.data.page.total,
            data: res.data.page.records,
          }),
        }}
        columns={[
          {
            title: '短信内容',
            dataIndex: 'sendContent',
            width: '35%',
          },
          {
            title: '接收手机',
            dataIndex: 'phoneNumber',
          },
          {
            title: '类型',
            dataIndex: 'businessType',
          },
          {
            title: '发送状态',
            dataIndex: 'status',
            render: (data) => <span>{smsStatus[Number(data)]}</span>,
          },
          {
            title: '发送时间',
            dataIndex: 'sendTime',
          },
        ]}
      />
    </Card>
  );
}
