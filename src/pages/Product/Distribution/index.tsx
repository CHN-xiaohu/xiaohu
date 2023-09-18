import { Card, Tabs, Alert } from 'antd';

import { useRequest, useEventEmitter } from 'ahooks';

import { Distribution } from './Distribution';

import styles from './index.less';

import type { BrandColumns } from '../Api';
import { getBrandList } from '../Api';

const { TabPane } = Tabs;

export default function ProductDistribution() {
  const { data: brands } = useRequest(() => getBrandList({ size: 999, current: 1 }), {
    formatResult: (res) =>
      res.data.records.map((item: BrandColumns) => ({ value: item.id, label: item.cnName })),
  });

  const upperAndLowerShelves$ = useEventEmitter();

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      <div className={styles.alertWrap}>
        <Alert
          showIcon
          message="分销商品是分销咋装云平台供货的商品，商品信息、上下架状态、sku 价格，会受供货商品信息变化而变化"
          type="info"
        />
      </div>

      <Tabs>
        <TabPane tab="销售中" key="1">
          <Distribution {...{ upperAndLowerShelves$, brands, productState: 1 }} />
        </TabPane>
        <TabPane tab="仓库中" key="2">
          <Distribution {...{ upperAndLowerShelves$, brands, productState: 2 }} />
        </TabPane>
        <TabPane tab="失效商品" key="3">
          <Distribution {...{ upperAndLowerShelves$, brands, status: 0 }} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
