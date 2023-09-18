import { UserAuthorityRoutesCache } from '@/services/User';
import { Tabs, Card } from 'antd';

import { ModelList } from './ModelList';

const { TabPane } = Tabs;

export default function ModelManageList() {
  const routesCache = UserAuthorityRoutesCache.get();
  const productRoutes = routesCache.find((route: { code: string }) => route.code === 'product')
    ?.children;

  const tabPanes = [
    {
      tab: '小程序商品',
      visible: !!productRoutes.find((route: { code: string }) => route.code === 'miniprogram'),
      productType: '1',
    },
    {
      tab: '商品列表',
      visible: !!productRoutes.find((route: { code: string }) => route.code === 'product'),
      productType: '0',
    },
    {
      tab: '供货商品',
      visible: !!productRoutes.find((route: { code: string }) => route.code === 'supply'),
      productType: '2',
    },
  ].filter((tabPane) => tabPane.visible);

  return (
    <Card>
      <Tabs defaultActiveKey="0">
        {tabPanes.map((tabPane, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <TabPane key={i} tab={tabPane.tab}>
            <ModelList productType={tabPane.productType} />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
}
