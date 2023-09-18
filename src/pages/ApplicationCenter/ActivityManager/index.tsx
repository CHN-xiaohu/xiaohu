import { Card, Tabs } from 'antd';

import { ActivityForm } from './Tabs/ActivityForm';

import styles from '../Distributor/index.less';

const { TabPane } = Tabs;

const tabsObj = {
  活动表单: <ActivityForm />,
};

const renderTabs = Object.keys(tabsObj).map((key) => (
  <TabPane key={key} tab={key}>
    {tabsObj[key]}
  </TabPane>
));

export default function ActivityManager() {
  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrap}>
      <Tabs defaultActiveKey="活动表单">{renderTabs}</Tabs>
    </Card>
  );
}
