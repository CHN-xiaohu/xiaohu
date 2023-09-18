import { Card, Tabs } from 'antd';

import { Merchants } from './Merchants';

const { TabPane } = Tabs;

export default function MerchantList() {
  return (
    <Card>
      <Tabs>
        <TabPane tab="全部" key="1">
          <Merchants />
        </TabPane>
        <TabPane tab="待审核" key="2">
          <Merchants {...{ auditStatus: '0' }} />
        </TabPane>
        <TabPane tab="审核通过" key="3">
          <Merchants {...{ auditStatus: '1' }} />
        </TabPane>
        <TabPane tab="审核未通过" key="4">
          <Merchants {...{ auditStatus: '2' }} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
