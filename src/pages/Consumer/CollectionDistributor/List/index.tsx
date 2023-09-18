import { Card, Tabs } from 'antd';

import { DistributionApplication } from './Distributor';

const { TabPane } = Tabs;

const tabPanes = [
  { tab: '全部', status: -1 },
  { tab: '待审核', status: 0 },
  { tab: '审核通过', status: 1 },
  { tab: '审核未通过', status: 2 },
];

export default function DistributorList() {
  return (
    <Card>
      <Tabs defaultActiveKey="0">
        {tabPanes.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <TabPane tab={item.tab} key={i}>
            <DistributionApplication status={item.status} />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
}
