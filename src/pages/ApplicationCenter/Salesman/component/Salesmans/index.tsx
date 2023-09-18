import { Tabs } from 'antd';

import Salesman from './Salesman';

const { TabPane } = Tabs;

const SalesmanList = () => {
  return (
    <Tabs type="card" defaultActiveKey="1">
      <TabPane key="1" tab="已通过">
        <Salesman statusType="1" />
      </TabPane>
      <TabPane key="2" tab="待审核">
        <Salesman statusType="0" />
      </TabPane>
      <TabPane key="3" tab="审核不通过">
        <Salesman statusType="2" />
      </TabPane>
    </Tabs>
  );
};

export default SalesmanList;
