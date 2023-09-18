import { createElement, useEffect, useState } from 'react';
import { createFormActions } from '@formily/antd';

import { message, Tooltip, Modal } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

import { NormalForm } from '@/components/Business/Formily';

import { useFields } from '../useFields';

import { salesmanSetting, getSalesmanSetting } from '../../Api';

const formActions = createFormActions();

export function SalesDeployForm() {
  const [salesDeploy, setSalesDeploy] = useState({} as any);
  const [isChangeBusinessType, setChangeBusinessType] = useState(false);
  const [businessTypeValue, setBusinessValue] = useState(0);

  const handleGetSalesDeployDetail = () => {
    getSalesmanSetting().then((res) => {
      const { data } = res;
      data.selfSubCommission = !Number(data.selfSubCommission);
      data.isRecruit = !Number(data.isRecruit);
      setSalesDeploy(data);
    });
  };

  useEffect(() => {
    handleGetSalesDeployDetail();
  }, []);

  const handleSubmit = (values: any) =>
    salesmanSetting({
      ...salesDeploy,
      ...values,
      selfSubCommission: values?.selfSubCommission ? '0' : '1',
      isRecruit: values?.isRecruit ? '0' : '1',
    }).then(() => {
      message.success('保存成功！');
      return handleGetSalesDeployDetail();
    });

  const createRichTextUtils = () => {
    return {
      text([...args]) {
        return createElement('span', {}, ...args);
      },
      help(text: any, offset = 3) {
        return createElement(
          Tooltip,
          { title: text } as any,
          <QuestionCircleOutlined
            style={{ margin: '0 3px', cursor: 'default', marginLeft: offset }}
          />,
        );
      },
      tips(text: any, tips: any) {
        return createElement(
          Tooltip,
          { title: tips } as any,
          <span style={{ margin: '0 3px', cursor: 'default' }}>{text}</span>,
        );
      },
    };
  };

  const handleChangeType = (e: any) => {
    setChangeBusinessType(true);
    setBusinessValue(e.target.value);
    formActions.setFieldValue('businessType', e.target.value === 0 ? 1 : 0);
  };

  const businessTypeObj = {
    title: '提示',
    width: 350,
    visible: isChangeBusinessType,
    onCancel() {
      setChangeBusinessType(false);
    },
    onOk() {
      formActions.setFieldValue('businessType', businessTypeValue);
      setChangeBusinessType(false);
    },
  };

  return (
    <div style={{ padding: '0 24px' }}>
      <Modal {...businessTypeObj}>切换业务模式，新订单分佣将按新模式进行分佣，是否确认切换？</Modal>
      <NormalForm
        {...{
          actions: formActions,
          initialValues: salesDeploy,
          onSubmit: handleSubmit,
          fields: { ...useFields() },
          labelCol: { span: 3 },
          wrapperCol: { span: 6 },
          expressionScope: createRichTextUtils(),
          effects: ($, { setFieldState, getFieldState }) => {
            $('onFieldInputChange', '*(extensionCommission,invitationCommission)').subscribe(
              (fieldState) => {
                const selfName = fieldState.name;
                const selfValue = fieldState.value;
                const otherName =
                  selfName === 'extensionCommission'
                    ? 'invitationCommission'
                    : 'extensionCommission';
                const otherValue = getFieldState(otherName, (state) => state.value);
                setFieldState(otherName, (state) => {
                  if (selfValue && otherValue && Number(selfValue) + Number(otherValue) > 100) {
                    (state as any).errors = '分佣比例不能大于100%';
                  } else {
                    (state as any).errors = '';
                  }
                });
                setFieldState(selfName, (state) => {
                  if (selfValue && otherValue && Number(selfValue) + Number(otherValue) > 100) {
                    (state as any).errors = '分佣比例不能大于100%';
                  } else {
                    (state as any).errors = '';
                  }
                });
              },
            );
            $(
              'onFieldInputChange',
              '*(provinceCommission,cityCommission,areaCommission)',
            ).subscribe(() => {
              const provinceValue = getFieldState('provinceCommission', (state) => state.value);
              const cityValue = getFieldState('cityCommission', (state) => state.value);
              const areaValue = getFieldState('areaCommission', (state) => state.value);
              if (provinceValue && cityValue && Number(provinceValue) < Number(cityValue)) {
                setFieldState('cityCommission', (state) => {
                  (state as any).errors = '比例设置由高级到低级进行递减';
                });
              } else if (cityValue && areaValue && Number(cityValue) < Number(areaValue)) {
                setFieldState('areaCommission', (state) => {
                  (state as any).errors = '比例设置由高级到低级进行递减';
                });
              } else {
                setFieldState('cityCommission', (state) => {
                  (state as any).errors = '';
                });
                setFieldState('areaCommission', (state) => {
                  (state as any).errors = '';
                });
              }
            });
          },
          schema: {
            basicLayout: {
              type: 'object',
              'x-component': 'card',
              'x-component-props': {
                type: 'inner',
                title: '业务员基础配置',
              },
              properties: {
                name: {
                  title: '业务员名称',
                  type: 'string',
                  default: '业务员',
                  'x-rules': [
                    {
                      required: true,
                      message: '业务员名称不能为空',
                    },
                    {
                      message: '业务员名称为必填（1-6个字符）',
                      pattern: /^[^\s]{1,6}$/,
                    },
                  ],
                },
                commissionTotal: {
                  title: '总提成比例',
                  type: 'inputNumber',
                  default: 100,
                  'x-rules': {
                    required: true,
                  },
                  'x-component-props': {
                    addonAfter: '%',
                    min: 0.01,
                    max: 100,
                    precision: 2,
                    step: 0.01,
                  },
                },
                isRecruit: {
                  title: '业务员招募',
                  type: 'boolean',
                  default: true,
                  'x-props': {
                    addonAfter:
                      "{{ help('开启业务员招募，APP-我的-业务员中心，经销商可申请成为业务员',20) }}",
                  },
                },
                applyVipType: {
                  title: '参与业务员申请',
                  type: 'string',
                  default: 0,
                  enum: [
                    {
                      label: '全部会员',
                      value: 2,
                    },
                    {
                      label: '普通会员',
                      value: 1,
                    },
                    {
                      label: '金牌会员',
                      value: 0,
                    },
                  ],
                },
                auditType: {
                  title: '业务员审核',
                  type: 'radio',
                  default: 1,
                  enum: [
                    {
                      label: '自动审核',
                      value: 0,
                    },
                    {
                      label: '人工审核',
                      value: 1,
                    },
                  ],
                },
                selfSubCommission: {
                  title: '自购分佣',
                  type: 'boolean',
                  default: true,
                  'x-props': {
                    addonAfter:
                      "{{ help('开启自购分佣，业务员自行购买订单可获得订单分佣奖励',20) }}",
                  },
                },
                businessType: {
                  title: '业务模式',
                  type: 'radio',
                  default: 0,
                  'x-props': {
                    value: 0,
                    onChange: handleChangeType,
                  },
                  enum: [
                    {
                      label: (
                        <span>
                          二级裂变分销
                          <span style={{ color: '#ccc', marginLeft: '5px' }}>
                            （通过二维码邀请锁定经销商关系，经销商下单获得订单分佣奖励）
                          </span>
                        </span>
                      ),
                      value: 0,
                    },
                    {
                      label: (
                        <span>
                          区域代理
                          <span style={{ color: '#ccc', marginLeft: '5px' }}>
                            （按区域划分经销商归属关系，所属区域下经销商下单获得订单分佣奖励）
                          </span>
                        </span>
                      ),
                      value: 1,
                    },
                  ],
                  'x-linkages': [
                    {
                      type: 'value:display',
                      condition: '{{ $self.value === 0 }}',
                      target: 'commissionLayout',
                    },
                    {
                      type: 'value:display',
                      condition: '{{ $self.value === 1 }}',
                      target: 'areaLayout',
                    },
                  ],
                },
              },
            },
            commissionLayout: {
              type: 'object',
              'x-component': 'card',
              'x-component-props': {
                title: (
                  <span>
                    分佣比例设置
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      （分佣比例为0%，则不进行分佣）
                    </span>
                  </span>
                ),
                type: 'inner',
              },
              properties: {
                extensionCommission: {
                  title: '推广分佣',
                  type: 'inputNumber',
                  'x-component-props': {
                    addonAfter: '%',
                    min: 0.0,
                    max: 100,
                    precision: 2,
                    step: 0.1,
                  },
                  'x-props': {
                    addonAfter: "{{ help('推广分佣即为一级分佣',20) }}",
                  },
                },
                invitationCommission: {
                  title: '邀请分佣',
                  type: 'inputNumber',
                  'x-component-props': {
                    addonAfter: '%',
                    min: 0.0,
                    max: 100,
                    precision: 2,
                    step: 0.1,
                  },
                  'x-props': {
                    addonAfter: "{{ help('邀请分佣即为二级分佣',20) }}",
                  },
                },
              },
            },
            areaLayout: {
              type: 'object',
              'x-component': 'card',
              'x-component-props': {
                title: (
                  <span>
                    区域设置
                    <span style={{ color: 'red', fontSize: '12px' }}>
                      （请根据订单利润空间，谨慎设置分佣比例，避免造成损失！）
                    </span>
                  </span>
                ),
                type: 'inner',
              },
              properties: {
                settingAreaTips: {
                  title: '',
                  type: 'settingAreaTips',
                },
                provinceCommission: {
                  title: '省代',
                  type: 'inputNumber',
                  'x-component-props': {
                    addonAfter: '%',
                    min: 0.0,
                    max: 100,
                    precision: 2,
                    step: 0.1,
                  },
                },
                cityCommission: {
                  title: '市代',
                  type: 'inputNumber',
                  'x-component-props': {
                    addonAfter: '%',
                    min: 0.0,
                    max: 100,
                    precision: 2,
                    step: 0.1,
                  },
                },
                areaCommission: {
                  title: '区代',
                  type: 'inputNumber',
                  'x-component-props': {
                    addonAfter: '%',
                    min: 0.0,
                    max: 100,
                    precision: 2,
                    step: 0.1,
                  },
                },
              },
            },
            formButtonList: {
              type: 'object',
              'x-component': 'formButtonGroup',
              properties: {
                buttonGroup: {
                  type: 'submitButton',
                  'x-component-props': {
                    children: '保存',
                  },
                },
                cancelButton: {
                  type: 'cancelButton',
                  'x-component-props': {
                    style: {
                      marginTop: '4px',
                    },
                    children: '重置',
                  },
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
