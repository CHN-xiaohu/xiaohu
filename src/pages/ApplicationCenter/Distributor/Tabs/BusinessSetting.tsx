import { createFormActions } from '@formily/antd';
import { createLinkageUtils, SchemaForm } from '@/components/Business/Formily';
import { Spin } from 'antd';
import { useRequest } from 'ahooks';

import { MathCalcul } from '@/foundations/Support/Math';

import { getDistributorSetting, saveOrUpdateDistributorSetting } from '../api';

const formActions = createFormActions();

export const commissionProps = () => ({
  addonAfter: '%',
  min: 0.0,
  max: 100,
  precision: 2,
  step: 0.01,
});

const switchProps = () => ({
  type: 'number',
  default: 0,
  'x-component': 'switch',
  'x-component-props': {
    activeValue: 0,
    inactiveValue: 1,
  },
});

export function BusinessSetting() {
  const { loading } = useRequest(getDistributorSetting, {
    formatResult: (res) => {
      formActions.setFormState((state) => {
        state.value = res.data;
        state.values = res.data;
      });
    },
  });

  return (
    <Spin spinning={loading}>
      <div style={{ padding: '0 24px' }}>
        <SchemaForm
          {...{
            actions: formActions,
            labelCol: { span: 3 },
            wrapperCol: { span: 6 },
            onSubmit: saveOrUpdateDistributorSetting,
            effects: ($, { getFieldValue }) => {
              const linkage = createLinkageUtils();

              const commissionBlurField = '*(extensionCommission,invitationCommission)';
              $('onFieldInputChange', commissionBlurField).subscribe(() => {
                const extensionCommissionValue = getFieldValue('extensionCommission') || 0;
                const invitationCommissionValue = getFieldValue('invitationCommission') || 0;
                const sum = new MathCalcul(extensionCommissionValue)
                  .plus(invitationCommissionValue)
                  .toNumber();

                // 推广分佣比例 + 邀请分佣比例 >= 100% （错误提示：分佣比例不能大于100%）
                if (sum > 100) {
                  linkage.errors(commissionBlurField, '分佣比例不能大于100%');
                } else {
                  linkage.errors(commissionBlurField, '');
                }

                // 邀请分佣比例大于 0，则推广分佣必须大于0，否则不合法
                if (invitationCommissionValue > 0 && extensionCommissionValue <= 0) {
                  linkage.errors('extensionCommission', '请输入推广分佣的比例');
                }
              });
            },
            schema: {
              basicLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  type: 'inner',
                  title: '分销员基础配置',
                },
                properties: {
                  name: {
                    title: '分销员名称',
                    type: 'string',
                    default: '顾问',
                    'x-component': 'input',
                    'x-component-props': {
                      showLengthCount: true,
                      maxLength: 6,
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: '请输入分销员名称',
                      },
                    ],
                  },
                  isRecruit: {
                    title: '分销员招募',
                    ...switchProps(),
                    'x-props': {
                      addonAfter:
                        "{{ help('开启分销员招募，APP-我的-分销员中心，消费者可申请成为分销员') }}",
                    },
                  },
                  auditType: {
                    title: '分销员审核',
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
                    ...switchProps(),
                    'x-props': {
                      addonAfter: "{{ help('开启自购分佣，分销员自行购买订单可获得订单分佣') }}",
                    },
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
                        （分佣比例为 0%，则不进行分佣）
                      </span>
                    </span>
                  ),
                  type: 'inner',
                },
                properties: {
                  extensionCommission: {
                    title: '推广分佣',
                    type: 'inputNumber',
                    'x-component-props': commissionProps(),
                    'x-props': {
                      addonAfter: "{{ help('推广分佣即为一级分佣') }}",
                    },
                  },
                  invitationCommission: {
                    title: '邀请分佣',
                    type: 'inputNumber',
                    'x-component-props': commissionProps(),
                    'x-props': {
                      addonAfter: "{{ help('邀请分佣即为二级分佣') }}",
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
                },
              },
            },
          }}
        />
      </div>
    </Spin>
  );
}
