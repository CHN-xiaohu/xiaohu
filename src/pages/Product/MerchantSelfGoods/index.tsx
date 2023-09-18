import { Card, Tabs } from 'antd';
import { useEventEmitter } from 'ahooks';

import type { RouteChildrenProps } from '@/typings/basis';

import { Product } from './Product';

import styles from '../Supply/index.less';

const { TabPane } = Tabs;

const TabPaneOpts = [
  {
    title: '已上架',
    state: 1 as 1,
  },
  {
    title: '未上架',
    state: 2 as 2,
  },
];

export default function ProductMerchantSelfGoods(props: RouteChildrenProps) {
  const upperAndLowerShelves$ = useEventEmitter();

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      <Tabs>
        {TabPaneOpts.map((item) => (
          <TabPane tab={item.title} key={item.state}>
            <Product {...{ ...props, upperAndLowerShelves$, miniProductState: item.state }} />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
}
