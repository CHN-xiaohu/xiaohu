import type { RouteChildrenProps } from '@/typings/basis';

import { useLoadingWrapper } from '@/foundations/hooks';

import { Card, Tabs, Spin } from 'antd';
import { useEffect } from 'react';

import { OrderLog } from './components/Log';
import { OrderInfo } from './components/Info';

import { Container } from './Container';

import { useOrderButtonList } from './ButtonList';

import {
  getOrderDetail,
  getSalesOrderDetail,
  supplyOrderDetail,
  brandSupplyOrderDetail,
} from '../Api';

const { TabPane } = Tabs;

const Main = ({
  match: {
    params: { id },
  },
}: RouteChildrenProps) => {
  const { ModalFormElement, state, setState } = Container.useContainer();
  const { isLoading, runRequest } = useLoadingWrapper();
  // 当前页面是销售单（小程序 c 端）
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  // 当前页面是分销采购单
  const isSupplier = window.location.pathname.includes('/orders/supplier');
  // 当前页面是分销供货单
  const isBrandSupplier = window.location.pathname.includes('/orders/brandSupplier');
  // 当前页面是采购单
  const isPurchaseOrder = window.location.pathname.includes('/orders/purchase');

  const { renderButtonList } = useOrderButtonList({
    orderId: id,
    isSalesOrder,
    isSupplier,
    isBrandSupplier,
    isPurchaseOrder,
  });

  const handleGetDetail = () =>
    runRequest(() => {
      let requestMethod = getOrderDetail;

      if (isSupplier) {
        requestMethod = supplyOrderDetail;
      } else if (isBrandSupplier) {
        requestMethod = brandSupplyOrderDetail;
      } else if (isSalesOrder) {
        requestMethod = getSalesOrderDetail;
      }

      return requestMethod(id).then((res) => {
        setState((draft) => {
          draft.dataSource = res.data;
          draft.submitSuccess = '';
        });
      });
    });

  useEffect(() => {
    handleGetDetail();
  }, [state.reRequestOrderDetail]);

  return (
    <Spin spinning={isLoading}>
      {ModalFormElement}

      <Card>
        <Tabs tabBarExtraContent={renderButtonList}>
          <TabPane tab="订单信息" key="1">
            <OrderInfo dataSource={state.dataSource} handleGetDetail={handleGetDetail} />
          </TabPane>

          <TabPane tab="订单日志" key="2">
            <OrderLog dataSource={state.dataSource} />
          </TabPane>
        </Tabs>
      </Card>
    </Spin>
  );
};

export default function OrderDetail(props: any) {
  return (
    <Container.Provider initialState={{}}>
      <Main {...props} />
    </Container.Provider>
  );
}
