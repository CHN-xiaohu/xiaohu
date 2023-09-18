import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createFormActions } from '@formily/antd';

import { Tabs, Card, message } from 'antd';

import { useMount } from 'ahooks';
import { useState } from 'react';

import { UserInfoCache } from '@/services/User';

import {
  addMiniDeploy,
  getMiniDeploy,
  addPayDeploy,
  getPayDeploy,
  getFunctionalSwitch,
} from '../Api';

import { MiniAppUse } from '../component/MiniAppUse/MiniAppUse';
import { AllUsed } from '../component/AllUse';
import { PayUse } from '../component/PayUse';

import { ChooseColor } from '../component/ChooseColor';
import { FunctionSwitchSeted } from '../component/FunctionSwitchSet';

const { TabPane } = Tabs;

export default function SystemMiniDeployForm() {
  const formActions = createFormActions();
  const { name } = UserInfoCache.get({});

  const [miniDeploy, setMiniDeploy] = useState({} as any);
  const [miniPay, setMiniPay] = useState({} as any);
  const [minFunctionSwitch, setMinFunctionSwitch] = useState({} as any);

  const handleGetMiniDeploy = () => {
    getMiniDeploy().then((res) => {
      setMiniDeploy(res.data);
    });
  };

  const handleGetMiniPay = () => {
    getPayDeploy().then((res) => {
      res.data.remoteCertUrl = res.data.privateCert ? 'https://show.p12' : '';
      setMiniPay(res.data);
    });
  };

  useMount(() => {
    handleGetMiniDeploy();
  });

  const handleAddAppSumbit = (values: any) => {
    addMiniDeploy(values).then(() => {
      message.success('配置成功！');
      handleGetMiniDeploy();
    });
  };

  const handleSumbit = (payValues: any) => {
    payValues.tenantFlag = true;
    payValues.storeFlag = false;
    payValues.isTest = false;
    payValues.configName = name;
    payValues.remoteCertUrl = payValues.remoteCertUrl.length === 16 ? '' : payValues.remoteCertUrl;

    addPayDeploy(payValues).then(() => {
      handleGetMiniDeploy();
    });
  };

  const handleGetMinFunctionSwitch = () => {
    getFunctionalSwitch({ configType: 1 }).then((res) => {
      setMinFunctionSwitch(res.data);
    });
  };

  const handleChangeTabs = (e: any) => {
    if (e === '2') {
      handleGetMiniDeploy();
    } else if (e === '3') {
      handleGetMiniPay();
    } else if (e === '4') {
      handleGetMinFunctionSwitch();
    }
  };

  const allUseProps: NormalFormProps = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
    actions: formActions,
    initialValues: miniDeploy,
    schema: AllUsed,
    onSubmit: handleAddAppSumbit,
    components: {
      ChooseColor,
    },
  };

  const miniPayProps: NormalFormProps = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
    actions: formActions,
    initialValues: miniPay,
    schema: PayUse,
    onSubmit: handleSumbit,
  };

  return (
    <Card>
      <Tabs defaultActiveKey="1" onChange={handleChangeTabs}>
        <TabPane tab="微信小程序" key="1">
          <MiniAppUse />
        </TabPane>
        <TabPane tab="通用配置" key="2">
          <SchemaForm {...allUseProps} />
        </TabPane>
        <TabPane tab="支付配置" key="3">
          <SchemaForm {...miniPayProps} />
        </TabPane>
        <TabPane tab="功能开关设置" key="4">
          <FunctionSwitchSeted
            minFunctionSwitch={minFunctionSwitch}
            handleGetMinFunctionSwitch={handleGetMinFunctionSwitch}
            config={1}
            schemaProps={{
              isShowOnlineOrder: {
                title: '线上订单',
                type: 'number',
                default: 1,
                'x-component': 'switch',
                'x-component-props': {
                  activeValue: 1,
                  inactiveValue: 0,
                  checkedChildren: '显示',
                  unCheckedChildren: '隐藏',
                },
              },
              isLive: {
                title: '直播组件',
                type: 'number',
                default: 0,
                'x-component': 'switch',
                'x-component-props': {
                  activeValue: 1,
                  inactiveValue: 0,
                  checkedChildren: '显示',
                  unCheckedChildren: '隐藏',
                },
              },
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}
