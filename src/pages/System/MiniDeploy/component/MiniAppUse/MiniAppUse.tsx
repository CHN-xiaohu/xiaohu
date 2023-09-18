import { memo, useState } from 'react';
import { Spin, Tabs } from 'antd';
import Button from 'antd/es/button';
import { Icons } from '@/components/Library/Icon';

import { useRequest } from 'ahooks';

import { ProfileInformation } from './ProfileInformation/ProfileInformation';
import { BasicInformation } from './BasicInformation';
import { DevelopmentSettings } from './DevelopmentSettings/DevelopmentSettings';

import { obtainTheAuthorizationInformationOfTheAuthorizer } from '../../Api';

import '../../index.less';

const { TabPane } = Tabs;

export const MiniAppUse = memo(() => {
  const [tab, setTab] = useState(1);

  const { data, loading, refresh } = useRequest(
    () => obtainTheAuthorizationInformationOfTheAuthorizer(),
    {
      formatResult: (res) => res,
    },
  );

  const handleChangeTabs = (tabs: any) => {
    if (tabs === '1') {
      setTab(1);
    }
    if (tabs === '2') {
      setTab(2);
    }
    if (tabs === '3') {
      setTab(3);
    }
  };

  return (
    <Spin spinning={loading}>
      <Tabs
        defaultActiveKey="1"
        onChange={handleChangeTabs}
        className="miniAppUse"
        tabBarExtraContent={{
          right: (
            <a href={'https://docs.qq.com/doc/DZHBBRXptRG1rVlZG'} target="_blank">
              <Icons type="QuestionCircleOutlined" />
              &nbsp; 查看帮助文档
            </a>
          ),
        }}
      >
        <TabPane tab={<Button type={tab === 1 ? 'primary' : 'default'}>概况信息</Button>} key={1}>
          <ProfileInformation result={data} refresh={refresh} />
        </TabPane>
        <TabPane tab={<Button type={tab === 2 ? 'primary' : 'default'}>基础信息</Button>} key={2}>
          <BasicInformation result={data} refresh={refresh} />
        </TabPane>
        {data?.success && (
          <TabPane tab={<Button type={tab === 3 ? 'primary' : 'default'}>开发设置</Button>} key={3}>
            <DevelopmentSettings />
          </TabPane>
        )}
      </Tabs>
    </Spin>
  );
});
