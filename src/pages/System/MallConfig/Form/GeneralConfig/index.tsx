import { memo, useState } from 'react';
import { useMount } from 'ahooks';
import { message } from 'antd';

import { registerFormField, connect, mapStyledProps } from '@formily/antd';

import { SchemaForm } from '@/components/Business/Formily';

import { updateSaaSMallSiteSettings } from '@/services/Api/Global';

import { getPcMallDeploy, addPcMallDeploy } from '../../Api';

import { ChooseColor } from '../../../MiniDeploy/component/ChooseColor';

// 注册组件
registerFormField(
  'chooseColor',
  connect({
    getProps: mapStyledProps,
  })(ChooseColor),
);

export const GeneralConfig = memo(() => {
  // 存储表单初始值
  const [initialValues, setInitialValues] = useState({});

  useMount(() => {
    // 获取表PC商城配置
    getPcMallDeploy().then((res) => {
      setInitialValues(res.data);
    });
  });

  const handleSubmit = (value: AnyObject) => {
    return addPcMallDeploy(value).then(() => {
      message.success('设置成功！');
      return updateSaaSMallSiteSettings();
    });
  };

  return (
    <SchemaForm
      {...{
        onSubmit: handleSubmit,
        initialValues,
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
        schema: {
          name: {
            title: '商城名称',
            type: 'string',
            'x-rules': [
              {
                required: true,
                message: '请输入商城名称',
              },
              {
                max: 20,
                message: '商城名称最长为 20 位',
              },
            ],
          },
          mainColor: {
            title: '主色',
            type: 'chooseColor',
            'x-component-props': {
              placeholder: '请选择或输入主色',
            },
            'x-rules': [
              {
                required: true,
                message: '请填写主题颜色',
              },
            ],
          },
          logoPath: {
            title: '应用图标',
            'x-component': 'uploadFile',
            description: '只能上传png文件，尺寸1024*1024',
            'x-component-props': {
              maxSize: 0.5,
              accept: '.png,.jpg,jpeg',
              placeholder: '1024*1024',
              rule: {
                maxImageWidth: 1024,
                maxImageHeight: 1024,
              },
            },
            'x-rules': {
              required: true,
              message: '请上传应用图标',
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
                  children: '重置',
                  style: {
                    marginTop: '4px',
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
});
