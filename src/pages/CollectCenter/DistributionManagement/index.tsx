import { Card, Tabs } from 'antd';

import ChannelSelfOperatedGoods from './components/ChannelSelfOperatedGoods';
import ChannelDistributionProduct from './components/ChannelDistributionProduct';

const { TabPane } = Tabs;

export default function ChannelDeployForm() {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="渠道自营商品" key="1">
          <ChannelSelfOperatedGoods />
        </TabPane>
        <TabPane tab="渠道分销商品" key="2">
          <ChannelDistributionProduct />
        </TabPane>
      </Tabs>
    </Card>
  );
}
