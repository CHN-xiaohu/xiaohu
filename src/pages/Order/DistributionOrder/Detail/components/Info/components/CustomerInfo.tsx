import { memo } from 'react';
import { Row, Col, Card } from 'antd';

import styles from '../index.less';

import { Container } from '../../../Container';

type Item = {
  value: 'customerName' | 'customerPhone' | 'customerAddress';
  label: string;
  info?: string;
  defaultValue?: string;
};

const Main = () => {
  const { state } = Container.useContainer();

  return (
    <Card type="inner" title="收货信息" className={styles.customerInformation}>
      <Row className={styles.customer} gutter={24}>
        {([
          { value: 'customerName', label: '收货姓名' },
          { value: 'customerPhone', label: '手机号码' },
          {
            value: 'customerAddress',
            label: '详细地址',
            info: ['province', 'city', 'area', 'street', 'address']
              .map((k) => state.dataSource[k])
              .join(''),
            defaultValue: ['provinceId', 'cityId', 'streetId', 'areaId'].map(
              (key) => state.dataSource[key],
            ),
          },
        ] as Item[]).map((item) => (
          <Col md={8} sm={24} key={item.value}>
            {item.label}：{item.info || state.dataSource[item.value]}
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export const CustomerInfo = memo(Main);
