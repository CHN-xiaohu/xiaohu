import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createFormActions } from '@formily/antd';

import { createElement, useState } from 'react';
import { Card } from 'antd';
import { useMount } from 'ahooks';

import { getNewDetail } from '../Api';
import { deviceType, getBizType, receiverType } from '../Util';

const NewsDetail = ({
  match: {
    params: { id },
  },
}: any) => {
  const formActions = createFormActions();

  const [detail, setDetail] = useState({} as any);

  useMount(() => {
    getNewDetail(id).then((res) => {
      res.data.deviceType = deviceType[Number(res.data.deviceType)];
      res.data.bizType = getBizType(res.data.bizType);
      res.data.receiverType = receiverType[Number(res.data.receiverType)];
      setDetail(res.data);
    });
  });

  const createRichTextUtils = () => ({
    text(...args: any) {
      return createElement('span', {}, ...args);
    },
    red(text: any) {
      return createElement('span', { style: { color: 'red', margin: '0 3px' } }, text);
    },
    link(text: any, href: any, target: any) {
      console.log('ttttext', text);
      return createElement('a', { href, target }, text);
    },
  });

  const props: NormalFormProps = {
    actions: formActions,
    initialValues: detail,
    editable: false,
    labelCol: 6,
    wrapperCol: 18,
    expressionScope: createRichTextUtils(),
    effects: ($, { setFieldState }) => {
      $('onFieldChange', 'bizType').subscribe((fieldState) => {
        setFieldState('description', (state: any) => {
          state.visible = fieldState.value === '消息通知';
        });
      });
      $('onFieldChange', 'receiverType').subscribe((fieldState) => {
        setFieldState('receiverIds', (state: any) => {
          state.visible = fieldState.value === '指定商家';
        });
      });
    },
    schema: {
      newInfo: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '消息信息',
          type: 'inner',
        },
        properties: {
          items1: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 16,
              cols: [8, 8],
            },
            properties: {
              title: {
                title: '消息标题',
                type: 'string',
                required: true,
              },
              deviceType: {
                title: '推送平台',
                type: 'string',
                required: true,
              },
            },
          },
          items2: {
            type: 'object',
            'x-component': 'grid',
            'x-component-props': {
              gutter: 16,
              cols: [8, 8],
            },
            properties: {
              bizType: {
                title: '消息跳转',
                type: 'string',
                required: true,
                'x-props': {
                  addonAfter:
                    detail.bizType === '商品详情页面'
                      ? `{{ link("（${detail.bizDataName}）", "/product/manager/view/${detail.bizData}", "_blank") }}`
                      : detail.bizType === '外部链接'
                      ? `（${detail.bizData}）`
                      : '',
                },
              },
              beginDate: {
                title: '推送时间',
                type: 'string',
                required: true,
              },
            },
          },
          serial: {
            title: '推广排序',
            type: 'number',
            'x-props': {
              labelCol: 2,
              wrapperCol: 6,
            },
            required: true,
          },
          shortDescription: {
            title: '消息简介',
            type: 'textarea',
            'x-props': {
              labelCol: 2,
              wrapperCol: 8,
            },
          },
          description: {
            type: 'ckEditor',
            title: '消息内容',
            required: true,
            'x-props': {
              isDetail: true,
              editable: false,
              height: 400,
              labelCol: 2,
              wrapperCol: 20,
            },
          },
        },
      },
      receiverInfo: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '推送目标用户',
          type: 'inner',
        },
        properties: {
          receiverType: {
            title: '用户群体',
            type: 'number',
            'x-props': {
              labelCol: 2,
              wrapperCol: 6,
            },
            required: true,
          },
        },
      },
    },
  };

  return (
    <Card>
      <SchemaForm {...props} />
    </Card>
  );
};

export default NewsDetail;
