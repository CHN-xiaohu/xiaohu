import { Tabs } from 'antd';

import { PosterSetting } from './PosterSetting';
import { RecruitPageSetting } from './RecruitPageSetting';
import { ShareSetting } from './ShareSetting';

const { TabPane } = Tabs;

const tabsObj = {
  分销员招募页设置: <RecruitPageSetting />,
  分享设置: <ShareSetting />,
  招募海报设置: <PosterSetting />,
};

const renderTabs = Object.keys(tabsObj).map((key) => (
  <TabPane key={key} tab={key}>
    {tabsObj[key]}
  </TabPane>
));

export const RecruitmentPlan = () => {
  return (
    <Tabs defaultActiveKey="分销员招募页设置" type="card" size="small">
      {renderTabs}
    </Tabs>
  );
};
