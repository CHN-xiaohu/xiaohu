import { Tabs } from 'antd';
import { useEventEmitter } from 'ahooks';

import { Distributor } from './Distributor';

const { TabPane } = Tabs;

const types = [
  { text: '已通过', value: 1 },
  { text: '待审核', value: 0 },
  { text: '审核不通过', value: 2 },
];

export const DistributorManager = () => {
  const upperAndLowerShelves$ = useEventEmitter();

  return (
    <Tabs type="card" defaultActiveKey="已通过" size="small">
      {types.map((item) => (
        <TabPane key={item.text} tab={item.text}>
          <Distributor {...{ upperAndLowerShelves$, status: item.value }} />
        </TabPane>
      ))}
    </Tabs>
  );
};
