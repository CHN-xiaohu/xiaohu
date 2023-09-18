import { Card, Tabs } from 'antd';
import { useEventEmitter } from 'ahooks';

import { Miniprogram } from './Miniprogram';

import styles from '../Supply/index.less';

import { useBrandsToSelectOptions } from '../useBrandsToSelectOptions';
import { useGroupsToSelectOptions } from '../useGroupsToSelectOptions';

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

export default function ProductMiniprogram() {
  const { brandsSelectOptions } = useBrandsToSelectOptions();
  const { groupsSelectOptions } = useGroupsToSelectOptions();

  const upperAndLowerShelves$ = useEventEmitter();

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      <Tabs>
        {TabPaneOpts.map((item) => (
          <TabPane tab={item.title} key={item.state}>
            <Miniprogram
              {...{
                brandsSelectOptions,
                groupsSelectOptions,
                upperAndLowerShelves$,
                productState: item.state,
              }}
            />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
}
