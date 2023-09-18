import { SchemaForm } from '@/components/Business/Formily';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';

import { RecruitDistributorRuleType } from './constants';

import { getRecruitDistributorRule, saveOrUpdateDistributorRules } from '../../api';

import { registerFields } from '../../registerFields';

// eslint-disable-next-line react-hooks/rules-of-hooks
const fields = registerFields();

export const RecruitPageSetting = () => {
  const { loading, data, run } = useRequest(
    () => getRecruitDistributorRule(RecruitDistributorRuleType.RECRUIT_DISTRIBUTOR_RULE),
    {
      formatResult: (res) => res.data,
    },
  );

  return (
    <Spin spinning={loading}>
      <SchemaForm
        labelCol={{ span: 5 }}
        fields={fields}
        initialValues={data}
        onSubmit={(values) =>
          saveOrUpdateDistributorRules({
            ...values,
            type: RecruitDistributorRuleType.RECRUIT_DISTRIBUTOR_RULE,
          }).then(() => run())
        }
        schema={{
          id: {
            type: 'string',
            display: false,
          },
          layout: {
            type: 'layout',
            'x-props': {
              style: {
                width: 550,
                padding: 24,
              },
            },
            properties: {
              title: {
                type: 'string',
                title: '招募标题',
                'x-component': 'input',
                'x-component-props': {
                  showLengthCount: true,
                  maxLength: 8,
                  style: {
                    width: 375,
                  },
                },
                'x-rules': [{ required: true, message: '请输入招募标题' }],
              },
              content: {
                type: 'detailEditor',
                title: '招募内容',
                'x-component-props': {
                  style: {
                    margin: 'unset',
                  },
                },
                'x-rules': {
                  required: true,
                  message: '请编辑招募内容',
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
        }}
      />
    </Spin>
  );
};
