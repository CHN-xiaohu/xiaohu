import { Card, Tabs, Alert } from 'antd';

import { useEventEmitter } from 'ahooks';

import { Supply } from './Supply';

import styles from './index.less';

import { useBrandsToSelectOptions } from '../useBrandsToSelectOptions';

const { TabPane } = Tabs;

const TabPaneOpts = [
  {
    title: '销售中',
    state: 1 as 1,
  },
  {
    title: '仓库中',
    state: 2 as 2,
  },
];

export default function ProductSupply() {
  const { brandsSelectOptions } = useBrandsToSelectOptions();

  const upperAndLowerShelves$ = useEventEmitter();

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      <div className={styles.alertWrap}>
        <Alert
          showIcon
          message="供货商品需提交咋装云平台审核，审核通过后，才可在集采中心售卖"
          type="info"
        />
      </div>

      <Tabs>
        {TabPaneOpts.map((item) => (
          <TabPane tab={item.title} key={item.state}>
            <Supply {...{ upperAndLowerShelves$, brandsSelectOptions, productState: item.state }} />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
}
