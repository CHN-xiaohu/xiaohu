import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { FormEffectHooks, createFormActions } from '@formily/antd';

import { useState } from 'react';
import { history } from 'umi';
import { useDebounce } from 'ahooks';

import { getProduct, addNews } from '../Api';

const { onFormInit$ } = FormEffectHooks;

export default function NewsForm() {
  const formActions = createFormActions();

  const [currentSearch, setCurrentSearch] = useState('');
  const [currentProductsList, setCurrentProductsList] = useState([] as any);
  const [isProduct, setIsProduct] = useState('');

  useDebounce(
    async () => {
      if (currentSearch) {
        const { data } = await getProduct({ name: currentSearch });
        const list = data.records.map((items: any) => ({ label: items.name, value: items.id }));
        setCurrentProductsList(list);
      }
    },
    200,
    [currentSearch],
  );

  const handleChange = (e: any) => {
    setCurrentSearch(e);
  };

  const handleCreateOrUpdate = (values: any) => {
    values.deviceType = values.deviceType.length === 1 ? values.deviceType[0] : '3';
    values.userType = 1;
    // values.receiverIds = sureMerchant.current
    return addNews(values).then(() => {
      history.push('/app/news');
    });
  };

  const itemss =
    isProduct === 'PRODUCT_DETAIL'
      ? {
          type: 'string',
          'x-component-props': {
            placeholder: '请输入关键字进行搜索',
            showSearch: true,
            filterOption: false,
            onSearch: (e: any) => handleChange(e),
          },
          enum: currentProductsList,
          'x-rules': {
            required: true,
            message: '请输入选择商品',
          },
        }
      : {
          type: 'string',
          'x-component-props': {
            placeholder: isProduct === 'NEWS' ? '请输入消息通知' : '请输入跳转地址',
          },
          'x-rules': {
            required: true,
            message: '请输入',
          },
        };

  const props: NormalFormProps = {
    actions: formActions,
    onSubmit: handleCreateOrUpdate,
    effects: ($, { setFieldState }) => {
      $('onFieldInputChange', 'bizType').subscribe((fieldState) => {
        setIsProduct(fieldState.value);
        setFieldState('inputs', (state: any) => {
          state.value = '';
        });
        if (fieldState.value === 'PRODUCT_DETAIL') {
          setFieldState('description', (state: any) => {
            state.visible = false;
          });
          setFieldState('bizData', (state: any) => {
            state.visible = true;
            state.value = undefined;
          });
        } else if (fieldState.value === 'NEWS') {
          setFieldState('description', (state: any) => {
            state.visible = fieldState.value === 'NEWS';
          });
          setFieldState('bizData', (state: any) => {
            state.visible = false;
          });
        } else if (fieldState.value === 'COUPON_PAGE') {
          setFieldState('bizData', (state: any) => {
            state.visible = false;
          });
          setFieldState('bizData', (state: any) => {
            state.visible = false;
          });
        } else {
          setFieldState('description', (state: any) => {
            state.visible = false;
          });
          setFieldState('bizData', (state: any) => {
            state.value = '';
            state.visible = true;
          });
        }
      });

      $('onFieldInputChange', 'sendWay').subscribe((fieldState) => {
        setFieldState('beginDate', (state: any) => {
          state.visible = fieldState.value === 'SCHEDULE';
        });
      });
      $('onFieldInputChange', 'receiverType').subscribe((fieldState) => {
        setFieldState('receiverIds', (state: any) => {
          state.visible = fieldState.value === '1';
        });
      });
      $('onFieldChange', 'sendWay').subscribe((fieldState) => {
        setFieldState('beginDate', (state: any) => {
          state.visible = fieldState.value === 'SCHEDULE';
        });
      });
      onFormInit$().subscribe(() => {
        setFieldState('description', (state: any) => {
          state.visible = false;
        });
        setFieldState('bizData', (state: any) => {
          state.visible = false;
        });
      });
    },
    schema: {
      formLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          size: 'default',
        },
        properties: {
          informationLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '消息信息',
              type: 'inner',
              className: 'product-category-container',
            },
            properties: {
              title: {
                title: '消息标题',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入消息标题（推送展示）',
                },
                'x-props': {
                  labelCol: 2,
                  wrapperCol: 6,
                },
                'x-rules': [
                  {
                    required: true,
                    message: '请输入消息标题（推送展示）',
                  },
                  {
                    notEmpty: true,
                    message: '请输入消息标题（推送展示）',
                  },
                  {
                    range: [0, 20],
                    message: '长度为20个字符',
                  },
                ],
              },
              items1: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 12,
                  cols: [7, 5],
                },
                properties: {
                  bizType: {
                    title: '消息跳转',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '请选择',
                    },
                    'x-props': {
                      labelCol: 7,
                      wrapperCol: 16,
                    },
                    enum: [
                      {
                        label: '商品详情页面',
                        value: 'PRODUCT_DETAIL',
                      },
                      {
                        label: '消息通知',
                        value: 'NEWS',
                      },
                      {
                        label: '外部链接',
                        value: 'EXTERNAL_LINKS',
                      },
                      {
                        label: '领券中心',
                        value: 'COUPON_PAGE',
                      },
                    ],
                    'x-rules': [
                      {
                        required: true,
                        message: '请选择消息跳转',
                      },
                    ],
                  },
                  bizData: itemss,
                },
              },
              serial: {
                title: '推广排序',
                type: 'number',
                'x-component-props': {
                  placeholder: '请输入1-999的数字',
                  min: 1,
                  max: 999,
                  precision: 0,
                  className: 'ant-form-explain__font-size',
                  style: {
                    width: '300px',
                  },
                },
                'x-props': {
                  labelCol: 2,
                  wrapperCol: 6,
                  description:
                    '当同时有多个消息时，会根据排序号来调整展示的前后顺序，数字越大排越前',
                },
                'x-rules': [
                  {
                    required: true,
                    message: '请输入1-999的数字',
                  },
                  {
                    notEmpty: true,
                    message: '推广序号不能为空字符',
                  },
                ],
              },
              shortDescription: {
                title: '消息简介',
                type: 'textarea',
                'x-component-props': {
                  placeholder: '请输入消息简介（推送展示）',
                },
                'x-props': {
                  labelCol: 2,
                  wrapperCol: 8,
                },
                'x-rules': [
                  {
                    required: true,
                    message: '请输入消息简介（推送展示）',
                  },
                  {
                    notEmpty: true,
                    message: '请输入消息简介（推送展示）',
                  },
                  {
                    range: [0, 50],
                    message: '长度为50个字符',
                  },
                ],
              },
              description: {
                type: 'ckEditor',
                title: '消息内容',
                'x-rules': {
                  required: true,
                  message: '消息通知不能为空',
                },
                'x-component-props': {
                  height: 400,
                },
                'x-props': {
                  labelCol: 2,
                  wrapperCol: 20,
                },
              },
            },
          },
          platformLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '推送目标平台',
              type: 'inner',
              className: 'product-category-container',
            },
            properties: {
              deviceType: {
                type: 'checkbox',
                'x-rules': [
                  {
                    required: true,
                    message: '请选择推送平台',
                  },
                ],
                enum: [
                  {
                    label: 'IOS',
                    value: '2',
                  },
                  {
                    label: 'Android',
                    value: '1',
                  },
                ],
              },
            },
          },

          timeLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '推送时间',
              type: 'inner',
              className: 'product-category-container',
            },
            properties: {
              items1: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [5, 5],
                },
                properties: {
                  sendWay: {
                    type: 'radio',
                    default: 'IMMEDIATELY',
                    enum: [
                      {
                        label: '立即发送',
                        value: 'IMMEDIATELY',
                      },
                      {
                        label: '定时发送',
                        value: 'SCHEDULE',
                      },
                    ],
                    'x-rules': [
                      {
                        required: true,
                        message: '请选择推送方式',
                      },
                    ],
                  },
                  beginDate: {
                    type: 'date',
                    'x-component-props': {
                      showTime: true,
                      format: 'YYYY-MM-DD HH:mm:ss',
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: '请选择推送日期',
                      },
                    ],
                  },
                },
              },
            },
          },

          consumerLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '推送目标用户',
              type: 'inner',
              className: 'product-category-container',
            },
            properties: {
              receiverType: {
                type: 'radio',
                default: '0',
                enum: [
                  {
                    label: '所有用户',
                    value: '0',
                  },
                ],
              },
            },
          },

          // button group
          formButtonList: {
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
