import type { RouteChildrenProps } from '@/typings/basis';

import { Card, Tabs } from 'antd';

import { EventDetails } from './components/EventDetails';
import { RechargeDetails } from './components/RechargeDetails';

const { TabPane } = Tabs;

export default function StoredValueDetail(props: RouteChildrenProps<{ id: string }>) {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="活动详情" key="1">
          <EventDetails {...props} />
        </TabPane>

        <TabPane tab="充值明细" key="2">
          <RechargeDetails {...props} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
