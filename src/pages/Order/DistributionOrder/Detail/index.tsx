import type { RouteChildrenProps } from '@/typings/basis';

import { useLoadingWrapper } from '@/foundations/hooks';

import { Card, Tabs, Spin } from 'antd';
import { useEffect } from 'react';

import { OrderLog } from './components/Log';
import { OrderInfo } from './components/Info';

import { Container } from './Container';

import { brandSupplyOrderDetail } from '../../Api';

const { TabPane } = Tabs;

const Main = ({
  match: {
    params: { id },
  },
}: RouteChildrenProps) => {
  const { state, setState } = Container.useContainer();
  const { isLoading, runRequest } = useLoadingWrapper();

  const handleGetDetail = () =>
    runRequest(() =>
      brandSupplyOrderDetail(id).then((res) => {
        setState((draft) => {
          draft.dataSource = res.data;
          draft.submitSuccess = '';
        });
      }),
    );

  useEffect(() => {
    handleGetDetail();
  }, [state.reRequestOrderDetail]);

  return (
    <Spin spinning={isLoading}>
      <Card>
        <Tabs>
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
