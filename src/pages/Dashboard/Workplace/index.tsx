import { useState } from 'react';
import * as React from 'react';
import { Card, Statistic, Popover } from 'antd';
import dayjs from 'dayjs';

import { useMount } from 'ahooks';

import { icons } from '@/components/Library/Icon';

import styles from './index.less';

import { getAnalyze } from '../Api';

const orderStatisticOptions = [
  { title: '待支付订单数', key: 'waitPay' },
  { title: '待发货订单数', key: 'waitDeliver' },
  { title: '支付订单数', key: 'orderNum' },
  { title: '支付人数', key: 'payNum' },
  { title: '支付金额（元）', key: 'totalMoney', precision: 2 },
];

const userStatisticOptions = [
  { title: '新增商家', key: 'newStoreNum' },
  { title: '新增供应商', key: 'newSupplierNum' },
  { title: '金牌商家个数', key: 'newVipNum' },
];

const orderQuestionDataSource = [
  '支付金额(元)：统计时间内，所有付款订单金额之和',
  '支付订单数：0点截至当前时间，成功支付的订单数，一个订单对应唯一一个订单号',
  '支付人数：0点截至当前时间，下单并且付款成功的客户数，一人多次付款记为一人',
  '待支付订单数：0点截至当前时间，下单并且未支付的订单数',
  '待发货订单数：0点截至当前时间，下单付款成功且未发货的订单数',
];

const userQuestionDataSource = [
  '新增商家数：0点截至当前时间，新增的商家人数',
  '新增供应商数：0点截至当前时间，新增的供应商人数',
  '金牌商家数：0点截至当前时间，升级金牌商家的个数',
];

export const Question = ({
  title,
  dataSource,
  iconStyle,
}: {
  title: string;
  dataSource: string[];
  iconStyle?: React.CSSProperties;
}) => (
  <Popover
    title={title}
    trigger="hover"
    overlayClassName={styles.titlePopover}
    content={
      <div>
        {dataSource.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    }
  >
    <icons.QuestionCircleOutlined style={iconStyle} />
  </Popover>
);

export default function DashboardWorkplace() {
  const [dataSource, setState] = useState({});

  useMount(() => {
    getAnalyze().then((res) => setState(res.data));
  });

  const renderCardTitleTime = (str: string) => (
    <div className={styles.titleWrapper}>
      {str}

      <span className={styles.titleDesc}>更新时间: {dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
    </div>
  );

  return (
    <>
      <Card
        title={
          <>
            {renderCardTitleTime('采购单实时概况')}
            <Question
              title="今日实时数据的统计时间均为今日零时截至当前更新时间"
              dataSource={orderQuestionDataSource}
            />
          </>
        }
        className={styles.cardWrapper}
        bordered={false}
      >
        {orderStatisticOptions.map((item) => (
          <div key={item.title} className={styles.cardStatisticWrapper}>
            <Statistic
              title={item.title}
              value={dataSource[item.key] || 0}
              className={styles.cardStatistic}
              precision={item.precision || 0}
            />
          </div>
        ))}
      </Card>

      <Card
        title={
          <>
            {renderCardTitleTime('用户实时概况')}
            <Question
              title="用户实时概况：实时数据的统计时间均为今日零时截至当前更新时间"
              dataSource={userQuestionDataSource}
            />
          </>
        }
        className={styles.cardWrapper}
        bordered={false}
      >
        {userStatisticOptions.map((item) => (
          <div key={item.title} className={styles.cardStatisticWrapper}>
            <Statistic
              title={item.title}
              value={dataSource[item.key] || 0}
              className={styles.cardStatistic}
            />
          </div>
        ))}
      </Card>
    </>
  );
}
