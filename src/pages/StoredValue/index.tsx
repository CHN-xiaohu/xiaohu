import { Card, Tabs } from 'antd';

import StoredValueActivity from './components/StoredValueActivity';
import RechargeRecord from './components/RechargeRecord';

const { TabPane } = Tabs;

const tabsObj = {
  储值活动: <StoredValueActivity />,
  充值记录: <RechargeRecord />,
};

const renderTabs = Object.keys(tabsObj).map((key) => (
  <TabPane key={key} tab={key}>
    {tabsObj[key]}
  </TabPane>
));

export default function StoredValue() {
  return (
    <Card>
      <Tabs defaultActiveKey="储值活动">{renderTabs}</Tabs>
    </Card>
  );
}
