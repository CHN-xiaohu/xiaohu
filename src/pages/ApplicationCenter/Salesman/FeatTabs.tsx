import { Card, Tabs } from 'antd';

import styles from './index.less';

import SalesmanList from './component/Salesmans';
import { SalesDeployForm } from './component/SalesDeployForm';
import AreaSalesman from './component/AreaSalesman';
import ExpendOrder from './component/ExpendOrder';
import RecuitPlan from './component/RecruitPlan';
import RulesIntroduce from './component/RulesIntroduce';
// import AchievementReport from './component/AchievementReport';

const { TabPane } = Tabs;

const tabsObj = {
  业务员管理: <SalesmanList />,
  区域业务员: <AreaSalesman />,
  推广订单: <ExpendOrder />,
  业务配置: <SalesDeployForm />,
  招募计划: <RecuitPlan />,
  规则说明: <RulesIntroduce />,
  // 业绩报表: <AchievementReport />,
};

const renderTabs = Object.keys(tabsObj).map((key) => (
  <TabPane key={key} tab={key}>
    {tabsObj[key]}
  </TabPane>
));

export const FeatTabs = () => {
  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrap}>
      <Tabs defaultActiveKey="业务员管理">{renderTabs}</Tabs>
    </Card>
  );
};
