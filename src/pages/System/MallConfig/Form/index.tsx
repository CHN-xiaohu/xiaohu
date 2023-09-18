import { Tabs, Card } from 'antd';

import { GeneralConfig } from '../Form/GeneralConfig';
import { ServiceConfig } from '../Form/ServiceConfig';
// import { PayConfig } from '../Form/PayConfig';

const { TabPane } = Tabs;

export default function SystemMallConfigForm() {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="通用配置" key="1">
          <GeneralConfig />
        </TabPane>
        {/* <TabPane tab="支付配置" key="2">
          <PayConfig />
        </TabPane> */}
        <TabPane tab="客服配置" key="3">
          <ServiceConfig />
        </TabPane>
      </Tabs>
    </Card>
  );
}
