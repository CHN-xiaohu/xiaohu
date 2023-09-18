import { Tabs, Card } from 'antd';

import { useRequest } from 'ahooks';

import { Share } from './Share';

import type { BrandColumns } from '../Api';
import { getBrandList } from '../Api';

const { TabPane } = Tabs;

export default function ProductShare() {
  const { data: brands } = useRequest(() => getBrandList({ size: 999, current: 1 }), {
    formatResult: (res) =>
      res.data.records.map((item: BrandColumns) => ({ value: item.id, label: item.cnName })),
  });

  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="待审核" key="1">
          <Share brands={brands} />
        </TabPane>
        <TabPane tab="审核通过" key="2">
          <Share brands={brands} auditStatus={1} />
        </TabPane>
        <TabPane tab="审核未通过" key="3">
          <Share brands={brands} auditStatus={2} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
