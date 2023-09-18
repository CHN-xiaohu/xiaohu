import { Card, Spin } from 'antd';
import { useImmer } from 'use-immer';
import { history } from 'umi';
import { createFormActions } from '@formily/antd';

import { useLoadingWrapper } from '@/foundations/hooks';
import type { RouteChildrenProps } from '@/typings/basis';

import { NormalForm } from '@/components/Business/Formily';
import { useMount } from 'ahooks';

import { getCustomerPageDetail, updateCustomerPage } from '../Api';

const formActions = createFormActions();

type IValues = {
  pageName: string;
  keyword: string;
  pageDescribe: string;
  editor: string;
};

export default function CustomPageForm({
  match: {
    params: { id },
  },
}: RouteChildrenProps) {
  const [state, setState] = useImmer({
    initialValues: {},
    contentId: '',
  });

  const { isLoading, runRequest } = useLoadingWrapper();

  const handleSubmit = (values: IValues) => {
    return updateCustomerPage({
      id: id || '',
      pageName: values.pageName,
      keyword: values.keyword,
      pageDescribe: values.pageDescribe,
      sysCustomPageContent: {
        content: values.editor,
        contentId: state.contentId,
      },
    }).then(() => {
      history.push('/pc/customPage');
    });
  };

  useMount(() => {
    if (id) {
      runRequest(() =>
        getCustomerPageDetail({ id }).then((res) => {
          const { contentId } = res.data.sysCustomPageContent;

          setState((draft) => {
            draft.initialValues = {
              ...res.data,
              editor: res.data.sysCustomPageContent.content,
            };

            draft.contentId = contentId;
          });
        }),
      );
    }
  });

  return (
    <Spin spinning={isLoading}>
      <Card>
        <NormalForm
          {...{
            actions: formActions,
            initialValues: state.initialValues,
            onSubmit: handleSubmit,
            labelCol: { span: 3 },
            wrapperCol: { span: 10 },
            schema: {
              basicLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  type: 'inner',
                  title: '页面信息',
                },
                properties: {
                  pageName: {
                    title: '页面名称',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '请输入页面名称',
                    },

                    'x-rules': [
                      { required: true, message: '请输入页面名称' },
                      { max: 10, message: '页面名称不超过 10 个字' },
                    ],
                  },
                  keyword: {
                    title: '页面关键字',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '请输入页面关键字',
                      maxLength: 30,
                    },
                    description: '用于页面SEO优化',
                  },
                  pageDescribe: {
                    title: '页面描述',
                    type: 'textarea',
                    'x-component-props': {
                      placeholder: '请输入页面描述',
                      maxLength: 100,
                    },
                    description: '用于页面SEO优化',
                  },
                },
              },
              detailLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  title: '页面详情',
                  type: 'inner',
                  className: 'product-category-container',
                },
                properties: {
                  editor: {
                    type: 'ckEditor',
                    'x-props': {
                      itemClassName: 'full-width__form-item-control',
                    },
                    'x-component-props': {
                      height: 400,
                    },
                    'x-rules': [{ required: true, message: '请输入页面内容' }],
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
      </Card>
    </Spin>
  );
}
