import { Card, Tabs, Alert } from 'antd';
import { useEventEmitter } from 'ahooks';

import type { RouteChildrenProps } from '@/typings/basis';

import styles from '@/pages/Product/Supply/index.less';

import { Product } from './Product';

const { TabPane } = Tabs;

const TabPaneOpts = [
  {
    title: '审核通过',
    state: 2,
  },
  {
    title: '未审核',
    state: 0,
  },
  {
    title: '审核中',
    state: 1,
  },
  {
    title: '审核驳回',
    state: 3,
  },
] as const;

export default function LivempProduct(props: RouteChildrenProps) {
  const upperAndLowerShelves$ = useEventEmitter();

  const tips = (
    <div>
      <div>
        1.只有审核通过的商品，才可以加入到直播间的商品列表中，建议大家提前提交商品审核，审核时长1-7天
      </div>
      <div>2.审核通过的商品上限为2000，每天最多提交审核500件商品</div>
    </div>
  );

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      <div style={{ padding: '25px 20px 20px 20px', backgroundColor: '#fff' }}>
        <Alert showIcon message={tips} type="info" />
      </div>
      <Tabs>
        {TabPaneOpts.map((item) => (
          <TabPane tab={item.title} key={item.state}>
            <Product {...{ ...props, auditStatus: item.state, upperAndLowerShelves$ }} />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
}
