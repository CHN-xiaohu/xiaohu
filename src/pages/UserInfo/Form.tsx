import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createFormActions } from '@formily/antd';

import { useState } from 'react';
import { useMount } from 'ahooks';
import { Tabs, Card } from 'antd';

import { UserInfoCache } from '@/services/User';

import { getUserInfo, updateUserInfo, updateSonPassword, updatePassword } from './Api';

const { TabPane } = Tabs;

export default function UserInfoForm() {
  const formActions = createFormActions();

  const { userId, isSubAccount } = UserInfoCache.get({});
  const [userMessage, setUserMessage] = useState({} as any);
  const [keyValue, setKeyValue] = useState('1');

  useMount(() => {
    setKeyValue(window.location.pathname.split('/').includes('password') ? '2' : '1');
    if (isSubAccount === 'YES') {
      getUserInfo(userId).then((res: any) => {
        setUserMessage(res.data);
      });
    }
  });

  const handleUpdate = (values: any) => {
    values.id = userId;
    return updateUserInfo(values).then(() => {
      window.location.reload();
    });
  };

  const handleUpdatePassword = (values: any) => {
    values.userId = userId;
    const url = isSubAccount === 'YES' ? updateSonPassword : updatePassword;
    return url(values).then(() => {
      window.location.reload();
    });
  };

  const handleChangeTab = (e: any) => {
    setKeyValue(e);
  };

  const infoProps: NormalFormProps = {
    actions: formActions,
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
    initialValues: userMessage,
    onSubmit: handleUpdate,
    schema: {
      formLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          // title: '个人信息',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          avatar: {
            title: '头像',
            'x-component': 'uploadFile',
          },
          realName: {
            title: '姓名',
            type: 'string',
            'x-rules': [
              {
                required: true,
                message: '请输入姓名',
              },
              {
                range: [0, 10],
                message: '姓名不能超过十个字',
              },
            ],
          },
          name: {
            title: '用户名',
            type: 'string',
            'x-rules': [
              {
                required: true,
                message: '请输入用户名',
              },
              {
                range: [0, 10],
                message: '用户名不能超过十个字',
              },
            ],
          },
          phone: {
            title: '手机号',
            type: 'string',
            'x-rules': [
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '联系人手机号不能为空',
              },
            ],
          },
          email: {
            title: '邮箱',
            type: 'string',
            'x-rules': [
              {
                pattern: /^([a-zA-Z\d])(\w|)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/,
                message: '请输入正确的邮箱格式',
              },
            ],
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
            type: 'reset',
            'x-component-props': {
              children: '清空',
              style: {
                marginTop: '4px',
              },
            },
          },
        },
      },
    },
  };

  const passwordProps: NormalFormProps = {
    actions: formActions,
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
    onSubmit: handleUpdatePassword,
    effects: ($, { setFieldState, getFieldState }) => {
      $('onFieldChange', '*(newPassword,checkPassword)').subscribe((fieldState) => {
        const selfName = fieldState.name;
        const selfValue = fieldState.value;
        const otherName = selfName === 'newPassword' ? 'checkPassword' : 'newPassword';
        const otherValue = getFieldState(otherName, (state) => state.value);
        setFieldState(otherName, (state) => {
          if (selfValue && otherValue && selfValue !== otherValue) {
            state.errors = '两次密码输入不一致';
          } else {
            state.errors = '';
          }
        });
        setFieldState(selfName, (state) => {
          if (selfValue && otherValue && selfValue !== otherValue) {
            state.errors = '两次密码输入不一致';
          } else {
            state.errors = '';
          }
        });
      });
    },
    schema: {
      passwordLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          oldPassword: {
            title: '原密码',
            type: 'password',
            'x-component-props': {
              placeholder: '请输入原密码',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入原密码',
              },
              {
                pattern: /^[^\s]{6,16}$/,
                message: '6-16位（英文、数字、其他字符）',
              },
            ],
          },
          newPassword: {
            title: '新密码',
            type: 'password',
            'x-component-props': {
              placeholder: '请输入新密码',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入新密码',
              },
              {
                pattern: /^[^\s]{6,16}$/,
                message: '6-16位（英文、数字、其他字符）',
              },
            ],
          },
          checkPassword: {
            title: '确认密码',
            type: 'password',
            'x-component-props': {
              placeholder: '请输入确认密码',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入确认密码',
              },
              {
                pattern: /^[^\s]{6,16}$/,
                message: '6-16位（英文、数字、其他字符）',
              },
            ],
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
              children: '清空',
              style: {
                marginTop: '4px',
              },
            },
          },
        },
      },
    },
  };

  return (
    <Card>
      <Tabs activeKey={keyValue} onChange={handleChangeTab}>
        <TabPane tab="个人信息" disabled={isSubAccount === 'NO'} key="1">
          <SchemaForm {...infoProps} />
        </TabPane>
        <TabPane tab="修改密码" key="2">
          <SchemaForm {...passwordProps} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
