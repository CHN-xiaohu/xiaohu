import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createFormActions } from '@formily/antd';

import { useMount } from 'ahooks';
import { useState, useEffect } from 'react';

import { getDeptTree, getDictionary, getDeptDetail } from '../Api';

export default function SystemDeptDetail({
  match: {
    params: { id },
  },
}: any) {
  const formActions = createFormActions();
  const [deptTree, setDeptTree] = useState([]);
  const [dictionary, setDictionary] = useState([]);
  const [initDetail, setInitDetail] = useState({} as any);

  useMount(() => {
    getDeptTree().then((res) => {
      setDeptTree(res.data);
    });
    getDictionary().then((res) => {
      const deptList = res.data.map((item: any) => ({
        value: Number(item.dictKey),
        label: item.dictValue,
      }));
      setDictionary(deptList);
    });
  });

  const getDetail = () => {
    getDeptDetail(id).then((res) => {
      res.data.remark = res.data.remark ? res.data.remark : ' ';
      setInitDetail(res.data);
    });
  };

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id]);

  const props: NormalFormProps = {
    actions: formActions,
    labelCol: 5,
    wrapperCol: 16,
    initialValues: initDetail,
    editable: false,
    schema: {
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
                  deptName: {
                    title: '机构简称',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '请输入机构简称',
                    },
                    'x-rules': {
                      required: true,
                      message: '机构简称不能为空',
                    },
                  },
                  fullName: {
                    title: '机构全称',
                    type: 'string',
                    width: '25%',
                    'x-component-props': {
                      placeholder: '请输入机构全称',
                    },
                    'x-rules': {
                      required: true,
                      message: '机构全称不能为空',
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
                    title: '上级机构',
                    type: 'treeSelect',
                    'x-component-props': {
                      placeholder: '请选择上级机构',
                      treeData: [...deptTree],
                      // treeDefaultExpandAll: true,
                      showSearch: true,
                      treeNodeFilterProp: 'title',
                    },
                  },
                  deptCategory: {
                    title: '机构类型',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '请选择机构类型',
                    },
                    enum: dictionary,
                    'x-rules': {
                      required: true,
                      message: '机构类型为必填',
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
              sort: {
                title: '机构排序',
                type: 'number',
                'x-rules': {
                  required: true,
                  message: '机构排序不能为空',
                },
                'x-component-props': {
                  placeholder: '请输入机构排序',
                  style: {
                    width: '100%',
                  },
                },
                'x-props': {
                  labelCol: 3,
                  wrapperCol: 18,
                },
              },
              remark: {
                title: '机构备注',
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
    },
  };

  return (
    <>
      <SchemaForm {...props} />
    </>
  );
}
