import { Card, Tabs } from 'antd';

import styles from './index.less';

import { BusinessSetting } from './Tabs/BusinessSetting';
import { DistributorManager } from './Tabs/DistributorManager';
import { PromoteOrder } from './Tabs/PromoteOrder';
import { RecruitmentPlan } from './Tabs/RecruitmentPlan';
import { CommissionSetting } from './Tabs/CommissionSetting';

const { TabPane } = Tabs;

const tabsObj = {
  分销员管理: <DistributorManager />,
  推广订单: <PromoteOrder />,
  商家分佣设置: <CommissionSetting />,
  分销配置: <BusinessSetting />,
  招募计划: <RecruitmentPlan />,
};

const renderTabs = Object.keys(tabsObj).map((key) => (
  <TabPane key={key} tab={key}>
    {tabsObj[key]}
  </TabPane>
));

export const FeatTabs = () => {
  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrap}>
      <Tabs defaultActiveKey="分销员管理">{renderTabs}</Tabs>
    </Card>
  );
};
