import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { useRef, useState } from 'react';
import { useMount } from 'ahooks';
import { Tabs, Card } from 'antd';

import { FunctionSwitchSeted } from '@/pages/System/MiniDeploy/component/FunctionSwitchSet';

import { getFunctionalSwitch } from '@/pages/System/MiniDeploy/Api';

import { Pay } from '../component/Pay';

import { AllUsed } from '../component/allUse';
import { IosUse } from '../component/iosUse';
import { AndroidUse } from '../component/androidUse';
import { CustomerServiceUse } from '../component/customerServiceUse';

import { ChooseColor } from '../../System/MiniDeploy/component/ChooseColor';

import {
  addAppSystem,
  getAppSystem,
  // AddWeChat,
  // getWeChat,
  addConsumerService,
  getConsumerService,
} from '../Api';

const { TabPane } = Tabs;

export default function SystemDeployForm() {
  const appSystem = useRef([] as any);
  const [appSystemState, setAppSystemState] = useState({} as any);
  const [consumerService, setConsumerService] = useState({} as any);
  const [minFunctionSwitch, setMinFunctionSwitch] = useState({} as any);

  const handleGetSystem = () => {
    getAppSystem().then((res) => {
      appSystem.current = res.data;
      res.data.openPush = !!res.data.openPush;
      setAppSystemState(res.data);
    });
  };

  useMount(() => {
    handleGetSystem();
  });

  const handleAddAppSystem = (values: any) => {
    values.openPush = values.openPush ? 1 : 0;
    return addAppSystem(values).then(() => {
      window.location.reload();
    });
  };

  const handleService = (values: any) => {
    addConsumerService(values).then(() => {
      window.location.reload();
    });
  };

  const handleGetMinFunctionSwitch = () => {
    getFunctionalSwitch({ configType: 2 }).then((res) => {
      setMinFunctionSwitch(res.data);
    });
  };

  const handleChangeTabs = (tabs: any) => {
    if (tabs === '1') {
      handleGetSystem();
    } else if (tabs === '5') {
      getConsumerService().then((res) => {
        consumerService.current = res.data;
        setConsumerService(res.data);
      });
    } else if (tabs === '6') {
      handleGetMinFunctionSwitch();
    }
  };

  const allUsedProps: NormalFormProps = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    onSubmit: handleAddAppSystem,
    initialValues: appSystemState,
    schema: AllUsed,
    components: {
      ChooseColor,
    },
  };

  const iosUseProps: NormalFormProps = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    onSubmit: handleAddAppSystem,
    initialValues: appSystemState,
    schema: IosUse,
  };

  const andriodUseProps: NormalFormProps = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    onSubmit: handleAddAppSystem,
    initialValues: appSystemState,
    schema: AndroidUse,
  };

  const customerServiceUseProps: NormalFormProps = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    onSubmit: handleService,
    initialValues: consumerService,
    schema: CustomerServiceUse,
  };

  return (
    <Card>
      <Tabs defaultActiveKey="1" onChange={handleChangeTabs}>
        <TabPane tab="通用配置" key="1">
          <SchemaForm {...allUsedProps} />
        </TabPane>
        <TabPane tab="IOS配置" key="2">
          <SchemaForm {...iosUseProps} />
        </TabPane>
        <TabPane tab="Android配置" key="3">
          <SchemaForm {...andriodUseProps} />
        </TabPane>
        <TabPane tab="支付配置" key="4">
          <Pay />
        </TabPane>
        <TabPane tab="客服配置" key="5">
          <SchemaForm {...customerServiceUseProps} />
        </TabPane>
        <TabPane tab="功能开关配置" key="6">
          <FunctionSwitchSeted
            minFunctionSwitch={minFunctionSwitch}
            handleGetMinFunctionSwitch={handleGetMinFunctionSwitch}
            config={2}
            schemaProps={{
              isShowPurchaseOrder: {
                title: '采购订单',
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
              isShowDetailVipGuide: {
                title: '详情页vip引导',
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
            }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
}
