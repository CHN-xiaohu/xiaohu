import { Card, Tabs } from 'antd';
import type { RouteChildrenProps } from '@/typings/basis';

import Detail from './Detail';
import AuditRecord from './AuditRecord';
import OperationLog from './OperationLog';

import styles from '../index.less';

const { TabPane } = Tabs;

export default function ProductSupplyView(props: RouteChildrenProps<{ id: string }>) {
  if (props.route.isSnapshot) {
    return <Detail {...props} />;
  }

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      <Tabs>
        <TabPane tab="商品详情" key="1">
          <Detail {...props} />
        </TabPane>

        <TabPane tab="审核记录" key="2">
          <AuditRecord {...props} />
        </TabPane>

        <TabPane tab="操作日志" key="3">
          <OperationLog {...props} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
