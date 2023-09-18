import { memo, useCallback } from 'react';
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
  const { openModal, state } = Container.useContainer();
  const isSupplierOrder = window.location.pathname.includes('/orders/supplier');

  const handleOpenForm = useCallback(
    (item: Item) => () => {
      const initialValues = {
        [item.value]: state.dataSource[item.value],
      };

      if (item.value === 'customerAddress') {
        initialValues.addressCodes = item.defaultValue;
        initialValues.address = state.dataSource?.address;
      }
      openModal({
        formStep: item.value,
        title: `修改${item.label}`,
        initialValues,
      });
    },
    [state.dataSource],
  );

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
            defaultValue: ['province', 'city', 'area', 'street'].map(
              (key) => state.dataSource[key],
            ),
          },
        ] as Item[]).map((item) => (
          <Col md={8} sm={24} key={item.value}>
            {item.label}：{item.info || state.dataSource[item.value]}
            <span>
              {![2, 5, 6].includes(state.dataSource?.orderStatus) && !isSupplierOrder && (
                <a style={{ marginLeft: '10px' }} onClick={handleOpenForm(item as any)}>
                  修改
                </a>
              )}
            </span>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export const CustomerInfo = memo(Main);
