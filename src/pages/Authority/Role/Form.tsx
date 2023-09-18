import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createFormActions } from '@formily/antd';

import { useState, useEffect } from 'react';
import { history } from 'umi';
import { useMount } from 'ahooks';

import { downTree, addRole, getRoleDetail } from './Api';

export default function AuthorityRoleForm({
  match: {
    params: { id },
  },
}: any) {
  const formActions = createFormActions();
  const [deptTree, setDeptTree] = useState([]);
  const [roleDetail, setRoleDetail] = useState({});
  const [isDetail, setIsDetail] = useState(false);

  useMount(() => {
    const iisDetail = window.location.pathname.split('/').includes('detail');
    setIsDetail(iisDetail);
    downTree().then((res) => {
      setDeptTree(res.data);
    });
  });

  const getDetail = () => {
    getRoleDetail(id).then((res) => {
      setRoleDetail(res.data);
    });
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id]);

  const handleCreateOrUpdate = (values: any) => {
    values.id = id;
    addRole(values).then(() => {
      history.push('/authority/role');
    });
  };

  const editProps = {
    formLayout: {
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
                cols: [12, 12],
              },
              properties: {
                roleName: {
                  title: '角色名称',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入角色名称',
                  },
                  'x-rules': {
                    required: true,
                    message: '角色名称不能为空',
                  },
                },
                roleAlias: {
                  title: '角色别名',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入角色别名',
                  },
                  'x-rules': {
                    required: true,
                    message: '角色别名不能为空',
                  },
                },
              },
            },
            items2: {
              type: 'string',
              'x-component': 'grid',
              'x-component-props': {
                gutter: 24,
                cols: [12, 12],
              },
              properties: {
                parentId: {
                  title: '上级角色',
                  type: 'treeSelect',
                  'x-component-props': {
                    placeholder: '请选择上级角色',
                    treeData: [...deptTree],
                    showSearch: true,
                    treeNodeFilterProp: 'title',
                  },
                },
                sort: {
                  title: '角色排序',
                  type: 'number',
                  'x-component-props': {
                    placeholder: '请选择角色排序',
                    style: {
                      width: '100%',
                    },
                  },
                  'x-rules': {
                    required: true,
                    message: '角色排序为必填',
                  },
                },
              },
            },
          },
        },
        othersLayout: {
          type: 'object',
          'x-component': 'card',
          'x-component-props': {
            title: '其它信息',
            type: 'inner',
            className: 'product-category-container',
          },
          properties: {
            remark: {
              title: '角色备注',
              type: 'textarea',
              'x-props': {
                labelCol: 3,
                wrapperCol: 18,
              },
              'x-component-props': {
                placeholder: '请输入机构备注',
              },
            },
          },
        },
        formButtonList: {
          type: 'object',
          'x-component': 'formButtonGroup',
          properties: {
            buttonGroup: {
              type: 'string',
              'x-component': 'submitButton',
              'x-component-props': {
                children: '提交数据',
              },
            },
          },
        },
      },
    },
  };

  const detailProps = {
    formLayout: {
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
                cols: [12, 12],
              },
              properties: {
                roleName: {
                  title: '角色名称',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入角色名称',
                  },
                  'x-rules': {
                    required: true,
                    message: '角色名称不能为空',
                  },
                },
                roleAlias: {
                  title: '角色别名',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入角色别名',
                    width: '25%',
                  },
                  'x-rules': {
                    required: true,
                    message: '角色别名不能为空',
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
                parentId: {
                  title: '上级角色',
                  type: 'treeSelect',
                  'x-component-props': {
                    placeholder: '请选择上级角色',
                    treeData: [...deptTree],
                    showSearch: true,
                    treeNodeFilterProp: 'title',
                  },
                },
                sort: {
                  title: '角色排序',
                  type: 'number',
                  'x-component-props': {
                    placeholder: '请选择角色排序',
                    style: {
                      width: '100%',
                    },
                  },
                  'x-rules': {
                    required: true,
                    message: '角色排序为必填',
                  },
                },
              },
            },
          },
        },
        othersLayout: {
          type: 'object',
          'x-component': 'card',
          'x-component-props': {
            title: '其它信息',
            type: 'inner',
            className: 'product-category-container',
          },
          properties: {
            remark: {
              title: '角色备注',
              type: 'textarea',
              'x-component-props': {
                placeholder: '请输入机构备注',
              },
              'x-props': {
                labelCol: 3,
                wrapperCol: 18,
              },
            },
          },
        },
      },
    },
  };

  const props: NormalFormProps = {
    actions: formActions,
    onSubmit: handleCreateOrUpdate,
    labelCol: 5,
    wrapperCol: 16,
    editable: !isDetail,
    initialValues: roleDetail,
    schema: isDetail ? detailProps : editProps,
  };

  return <SchemaForm {...props} />;
}
