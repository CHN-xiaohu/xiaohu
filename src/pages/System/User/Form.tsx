import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { FormEffectHooks, createFormActions } from '@formily/antd';
import { useMount } from 'ahooks';

import { history } from 'umi';
import { TreeSelect } from 'antd';

import { useState, useEffect } from 'react';

import { getRoleTree, getDeptDownList, addUser, getUserDetail, updateUser } from './Api';

const { SHOW_PARENT } = TreeSelect;
const { onFormInit$ } = FormEffectHooks;

export default function SystemUserForm({
  match: {
    params: { id },
  },
}: any) {
  const formActions = createFormActions();
  const [roleTrees, setRoleTree] = useState([] as any);
  const [deptList, setDeptList] = useState([] as any);
  const [userDetail, setUserDetail] = useState({} as any);
  const [isDetail, setIsDetail] = useState(false);

  useMount(() => {
    const iisDetail = window.location.pathname.split('/').includes('detail');
    setIsDetail(iisDetail);
    getRoleTree().then((res) => {
      setRoleTree(res.data);
    });
    getDeptDownList().then((res) => {
      const lists = res.data.map((items: any) => ({ label: items.title, value: items.id }));
      setDeptList(lists);
    });
  });

  const handleGeDetail = () => {
    getUserDetail(id).then((res) => {
      res.data.roleId = res.data.roleId.split(',');
      res.data.deptId = res.data.deptId.split(',');
      setUserDetail(res.data);
    });
  };

  useEffect(() => {
    if (id) {
      handleGeDetail();
    }
  }, [id]);

  const handleSubmit = (values: any) => {
    let role = '';
    values.roleId.forEach((item) => {
      role += `${item},`;
    });
    let dept = '';
    values.deptId.forEach((item) => {
      dept += `${item},`;
    });
    values.roleId = role;
    values.deptId = dept;
    if (id) {
      values.id = id;
      updateUser(values).then(() => {
        history.push('/system/user');
      });
    } else {
      addUser(values).then(() => {
        history.push('/system/user');
      });
    }
  };

  const basicProps = {
    type: 'object',
    'x-component': 'card',
    'x-component-props': {
      size: 'default',
    },
    properties: {
      basicLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '基本信息',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          items1: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 24,
              cols: [23, 1],
            },
            properties: {
              account: {
                title: '登录账号',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入登录账号',
                },
                'x-props': {
                  labelCol: 2,
                  wrapperCol: 21,
                },
                'x-rules': {
                  required: true,
                  message: '登录账号不能为空',
                },
              },
            },
          },
          items2: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 24,
              cols: [12, 12],
            },
            properties: {
              password: {
                title: '密码',
                type: 'password',
                'x-component-props': {
                  placeholder: '请输入密码',
                  style: {
                    width: '26.8vw',
                  },
                },
                'x-rules': {
                  required: true,
                  message: '请输入密码',
                },
              },
              password2: {
                title: '确认密码',
                type: 'password',
                'x-component-props': {
                  placeholder: '请输入确认密码',
                  style: {
                    width: '26.8vw',
                  },
                },
                'x-rules': {
                  required: true,
                  message: '请输入确认密码',
                },
              },
            },
          },
          items3: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 24,
              cols: [12, 12],
            },
            properties: {
              name: {
                title: '用户昵称',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入用户昵称',
                },
                'x-rules': {
                  required: true,
                  message: '请输入用户昵称',
                },
              },
              realName: {
                title: '用户姓名',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入用户姓名',
                },
                'x-rules': {
                  required: true,
                  message: '请输入用户姓名',
                },
              },
            },
          },
          items4: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 24,
              cols: [12, 12],
            },
            properties: {
              roleId: {
                title: '所属角色',
                type: 'treeSelect',
                'x-component-props': {
                  placeholder: '请选择所属角色',
                  treeData: [...roleTrees],
                  showSearch: true,
                  showCheckedStrategy: SHOW_PARENT,
                  treeCheckable: true,
                  treeNodeFilterProp: 'title',
                },
                'x-rules': {
                  required: true,
                  message: '请选择所属角色',
                },
              },
              deptId: {
                title: '所属机构',
                type: 'string',
                enum: deptList,
                'x-component-props': {
                  placeholder: '请选择所属机构',
                  mode: 'multiple',
                },
                'x-rules': {
                  required: true,
                  message: '请选择所属机构',
                },
              },
            },
          },
          items5: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 24,
              cols: [12, 12],
            },
            properties: {
              phone: {
                title: '手机号码',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入手机号码',
                },
                'x-rules': [
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: '请输入正确的手机号码',
                  },
                ],
              },
              email: {
                title: '电子邮箱',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入电子邮箱',
                },
                'x-rules': [
                  {
                    pattern: /^([a-zA-Z\d])(\w|)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/,
                    message: '请输入正确的邮箱格式',
                  },
                ],
              },
            },
          },
          items6: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 24,
              cols: [12, 12],
            },
            properties: {
              sex: {
                title: '用户性别',
                type: 'string',
                'x-component-props': {
                  placeholder: '请选择用户性别',
                },
                enum: [
                  {
                    value: 1,
                    label: '男',
                  },
                  {
                    value: 2,
                    label: '女',
                  },
                  {
                    value: 3,
                    label: '未知',
                  },
                ],
              },
              birthday: {
                title: '用户生日',
                type: 'date',
                'x-component-props': {
                  placeholder: '请选择用户生日',
                  style: {
                    width: '26.8vw',
                  },
                },
              },
            },
          },
          items7: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 24,
              cols: [12, 12],
            },
            properties: {
              status: {
                title: '用户状态',
                type: 'radio',
                enum: [
                  {
                    value: 1,
                    label: '启用',
                  },
                  {
                    value: 0,
                    label: '禁用',
                  },
                ],
              },
            },
          },
        },
      },
    },
  };

  const buttons = {
    type: 'object',
    'x-component': 'formButtonGroup',
    properties: {
      buttonGroup: {
        type: 'submitButton',
        'x-component-props': {
          children: '提交数据',
        },
      },
    },
  };

  const editProps = {
    formLayout: basicProps,
    formButtonList: buttons,
  };

  const detailProps = {
    formLayout: basicProps,
  };

  const props: NormalFormProps = {
    actions: formActions,
    onSubmit: handleSubmit,
    labelCol: 4,
    wrapperCol: 16,
    editable: !isDetail,
    initialValues: userDetail,
    effects: ($, { setFieldState, getFieldState }) => {
      $('onFieldInputChange', '*(password,password2)').subscribe((fieldState) => {
        const selfName = fieldState.name;
        const selfValue = fieldState.value;
        const otherName = selfName === 'password' ? 'password2' : 'password';
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

      onFormInit$().subscribe(() => {
        setFieldState('password', (state: any) => {
          state.visible =
            !window.location.pathname.split('/').includes('edit') &&
            !window.location.pathname.split('/').includes('detail');
        });

        setFieldState('password2', (state: any) => {
          state.visible =
            !window.location.pathname.split('/').includes('edit') &&
            !window.location.pathname.split('/').includes('detail');
        });
      });
    },
    schema: isDetail ? detailProps : editProps,
  };

  return <SchemaForm {...props} />;
}
