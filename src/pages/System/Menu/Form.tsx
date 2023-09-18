import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import IconFromIconfontList from '@/components/Library/Icon/Icons/IconFromIconfontList';

import { createFormActions, registerFormField, connect, mapStyledProps } from '@formily/antd';
import { history } from 'umi';

import { useMount } from 'ahooks';
import { useState } from 'react';

import IconPreview from './component/iconPreview';

import { getMenuTree, addMenu, getMenuDetail } from './Api';

registerFormField(
  'iconPreview',
  connect({
    getProps: mapStyledProps,
  })(IconPreview as any),
);

export default function SystemMenuForm({
  match: {
    params: { id },
  },
}: any) {
  const formActions = createFormActions();
  const [menuTree, setMenuTree] = useState([]);
  const [menuDetail, setMenuDetail] = useState({} as any);
  const [isDetail, setIsDetail] = useState(false);

  useMount(() => {
    const iisDetail = window.location.pathname.split('/').includes('detail');
    setIsDetail(iisDetail);
    getMenuTree().then((res) => {
      setMenuTree(res.data);
    });
    if (id) {
      getMenuDetail(id).then((res) => {
        setMenuDetail(res.data);
      });
    }
  });

  const handleSubmit = (values: any) => {
    values.id = id;
    addMenu(values).then(() => {
      history.push('/system/menu');
    });
  };

  const basicProps = {
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
          name: {
            title: '菜单名称',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入菜单名称',
            },
            'x-rules': {
              required: true,
              message: '请输入菜单名称',
            },
          },
          path: {
            title: '路由地址',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入路由地址',
            },
            'x-rules': {
              required: true,
              message: '请输入路由地址',
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
            title: '上级菜单',
            type: 'treeSelect',
            'x-component-props': {
              placeholder: '请输入上级菜单',
              treeData: [...menuTree],
              showSearch: true,
              treeNodeFilterProp: 'title',
            },
          },
          source: {
            title: '菜单图标',
            type: 'iconPreview',
            'x-component-props': {
              placeholder: '请输入菜单图标',
            },
            'x-props': {
              dataSource: IconFromIconfontList,
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
          code: {
            title: '菜单编号',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入菜单编号',
            },
            'x-rules': {
              required: true,
              message: '请输入菜单编号',
            },
          },
          category: {
            title: '菜单类型',
            type: 'radio',
            'x-component-props': {
              placeholder: '请输入菜单类型',
            },
            default: 1,
            enum: [
              {
                value: 1,
                label: '菜单',
              },
              {
                value: 2,
                label: '按钮',
              },
            ],
            'x-rules': {
              required: true,
              message: '请输入菜单类型',
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
          alias: {
            title: '菜单别名',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入菜单别名',
            },
            'x-rules': {
              required: true,
              message: '请输入菜单别名',
            },
          },
          action: {
            title: '按钮功能',
            type: 'radio',
            'x-component-props': {
              placeholder: '请选择按钮功能',
            },
            default: 1,
            enum: [
              {
                value: 1,
                label: '工具栏',
              },
              {
                value: 2,
                label: '操作栏',
              },
              {
                value: 3,
                label: '工具操作栏',
              },
            ],
            'x-rules': {
              required: true,
              message: '请输入按钮功能',
            },
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
          sort: {
            title: '菜单排序',
            type: 'number',
            'x-component-props': {
              placeholder: '请输入菜单排序',
              style: {
                width: '100%',
              },
            },
            'x-rules': {
              required: true,
              message: '请输入菜单排序',
            },
          },
          isOpen: {
            title: '新窗口打开',
            type: 'radio',
            'x-component-props': {
              placeholder: '请选择新窗口打开',
            },
            default: 1,
            enum: [
              {
                value: 1,
                label: '否',
              },
              {
                value: 2,
                label: '是',
              },
            ],
            'x-rules': {
              required: true,
              message: '请选择新窗口打开',
            },
          },
        },
      },
    },
  };

  const orthesProps = {
    type: 'object',
    'x-component': 'card',
    'x-component-props': {
      title: '其它信息',
      type: 'inner',
      className: 'product-category-container',
    },
    properties: {
      remark: {
        title: '菜单备注',
        type: 'textarea',
        'x-component-props': {
          placeholder: '请输入菜单备注',
          rows: 4,
        },
        'x-props': {
          labelCol: 3,
          wrapperCol: 19,
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
    formLayout: {
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        size: 'default',
      },
      properties: {
        basicLayout: basicProps,
        othersLayout: orthesProps,
        formButtonList: buttons,
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
        basicLayout: basicProps,
        othersLayout: orthesProps,
        formButtonList: buttons,
      },
    },
  };

  const props: NormalFormProps = {
    actions: formActions,
    onSubmit: handleSubmit,
    labelCol: 5,
    wrapperCol: 16,
    editable: !isDetail,
    initialValues: menuDetail,
    schema: isDetail ? detailProps : editProps,
  };

  return (
    <>
      <SchemaForm {...props} />
    </>
  );
}
