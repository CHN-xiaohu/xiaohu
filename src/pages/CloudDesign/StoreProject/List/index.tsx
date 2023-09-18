import { Tabs, Card } from 'antd';

import { Projects } from '../../Project/List/Projects';

const { TabPane } = Tabs;

export default function StoreProjectList() {
  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane key="1" tab="我的方案">
          <Projects projectType="1" />
        </TabPane>
        <TabPane key="2" tab="推荐方案">
          <Projects projectType="3" />
        </TabPane>
      </Tabs>
    </Card>
  );
}
