import { useState, useRef } from 'react';
import { history } from 'umi';
import { useMount } from 'ahooks';
import { message } from 'antd';
import { NormalForm } from '@app_business/Formily';
import { ButtonList } from '@/components/Library/ButtonList';

import type { RouteChildrenProps } from '@/typings/basis';
import { isStr } from '@/utils';

import './index.less';

import {
  productTypeMapTransformToSelectOptions,
  belongsToMapTransformToSelectOptions,
  virtualServeTypeMap,
  disableSaleStatus,
} from '../Constant';

import { addServices, updateServices, delServicePrice, addServicePrice } from '../Api';

// 后端不提供详情接口，只能这样做，优化体验
const getStateCache = () => JSON.parse(window.localStorage.getItem('server_form_state') || `${{}}`);
const setStateCache = (value: object) =>
  window.localStorage.setItem('server_form_state', JSON.stringify(value));

const isPriceRangeRepeat = (ranges: any[]) => {
  let errorMessage;
  try {
    ranges.reduce((previous: string[], current) => {
      if (previous.includes(current.priceInterval)) {
        throw new Error(`计价区间值不能重复，${current.priceInterval} 值已重复`);
      }

      return [...previous, current.priceInterval];
    }, [] as string[]);
  } catch (error) {
    errorMessage = error.message;
  }

  return errorMessage;
};

export default function ServiceForm({ location, match }: RouteChildrenProps) {
  const [priceIntervalTitle, setPriceIntervalTitle] = useState('计价区间');
  const [initialValues, setInitialValues] = useState({
    defProductPriceDTOS: [],
    productType: undefined,
    belongsTo: undefined as any,
  });

  const delIdsRef = useRef<string[]>([]);

  const handleAddPrices = (list: any[]) => {
    const result = list
      .filter((item) => !item.id)
      .map((item) => ({ ...item, defProductId: match.params.id }));

    if (result.length) {
      addServicePrice(result);
    }
  };

  const cacheDelPriceId = (id?: string) => {
    if (id) {
      delIdsRef.current.push(id);
    }
  };

  const handleCreateOrUpdate = async (values: any) => {
    values.saleStatus = values.saleStatus ? 'YES' : 'NO';
    values.status = Number(values.status);

    // 判断重复
    const errorMessage = isPriceRangeRepeat(values.defProductPriceVOList);
    if (errorMessage) {
      return message.error(errorMessage);
    }

    if (match.params.id && values.defProductPriceVOList.length) {
      values.id = match.params.id;

      handleAddPrices(values.defProductPriceVOList);

      if (delIdsRef.current.length) {
        await Promise.all(delIdsRef.current.map((id) => delServicePrice(id)));
      }
    }

    const method = match.params.id ? updateServices : addServices;

    if (!isStr(values.virtualServeType)) {
      delete values.virtualServeType;
    }

    return method(values).then(() => {
      history.push('/service');
    });
  };

  useMount(() => {
    if (match.params.id) {
      if (!location.state && getStateCache()) {
        location.state = getStateCache();
      } else {
        setStateCache(location.state);
      }

      setPriceIntervalTitle(`计价区间（${location.state.priceUnit}）`);
      setInitialValues(
        !location.state
          ? {}
          : {
              ...location.state,
              saleStatus: location.state.saleStatus === 'YES',
              status: Boolean(location.state.status),
            },
      );
    }
  });

  return (
    <NormalForm
      {...{
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
        onSubmit: handleCreateOrUpdate,
        initialValues,
        effects: ($, { setFieldState }) => {
          $('onFieldInputChange', 'priceUnit').subscribe((fieldState) => {
            setPriceIntervalTitle(`计价区间（${fieldState.value}）`);
          });

          $('onFieldInputChange', 'productType').subscribe((state) => {
            setFieldState('virtualServeType', (fieldState) => {
              fieldState.display = state.value === 'VIRTUAL_SERVE';

              // 在编辑的时候，必须这样设置，不然会导致 value = {} 从而使组件报错，这里应该是 uform 的 bug
              fieldState.value = undefined;
              fieldState.values = [];
            });
          });

          $('onFieldInputChange', 'belongsTo').subscribe((state) => {
            const isDisable = disableSaleStatus(state.value);
            setFieldState('saleStatus', (fieldState) => {
              if (isDisable) {
                fieldState.value = false;
              }

              fieldState.editable = !isDisable;
            });
          });
        },
        schema: {
          formLayout: {
            type: 'object',
            'x-component': 'card',
            // 'x-component-props': {
            //   size: 'default',
            // },
            properties: {
              infoLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  title: '服务信息',
                  type: 'inner',
                  className: 'product-category-container',
                },
                properties: {
                  item1: {
                    type: 'object',
                    'x-component': 'grid',
                    'x-component-props': {
                      gutter: 24,
                      cols: [8, 8, 8],
                    },
                    properties: {
                      productName: {
                        title: '服务名称',
                        type: 'string',
                        'x-component-props': {
                          placeholder: '请输入 服务名称',
                        },
                        'x-rules': [
                          {
                            required: true,
                            message: '请输入 服务名称',
                          },
                          {
                            notEmpty: true,
                            message: '请输入 服务名称',
                          },
                          {
                            range: [3, 14],
                            message: '长度为 4 ~ 15 个字符',
                          },
                        ],
                      },
                      belongsTo: {
                        title: '项目标识',
                        type: 'string',
                        enum: belongsToMapTransformToSelectOptions,
                        'x-component-props': {
                          placeholder: '请选择 项目标识',
                        },
                        'x-rules': {
                          required: true,
                          message: '请选择 项目标识',
                        },
                      },

                      productType: {
                        title: '服务类型',
                        type: 'string',
                        enum: productTypeMapTransformToSelectOptions,
                        'x-component-props': {
                          placeholder: '请选择 服务类型',
                        },
                        'x-rules': {
                          required: true,
                          message: '请选择 服务类型',
                        },
                      },
                    },
                  },

                  item2: {
                    type: 'object',
                    'x-component': 'grid',
                    'x-component-props': {
                      gutter: 12,
                      cols: [8, 8],
                    },
                    properties: {
                      priceUnit: {
                        title: '计价单位',
                        type: 'string',
                        enum: ['天', '条', '个'].map((value) => ({ label: value, value })),
                        'x-component-props': {
                          placeholder: '请选择 计价单位',
                        },
                        'x-rules': {
                          required: true,
                          message: '请选择 计价单位',
                        },
                      },
                      sort: {
                        title: '排序',
                        type: 'number',
                        'x-component-props': {
                          placeholder: '请输入 排序',
                          min: 0,
                          max: 99999,
                          style: {
                            width: 160,
                          },
                        },
                        'x-rules': {
                          required: true,
                          message: '请输入 排序',
                        },
                      },
                      virtualServeType: {
                        title: '虚拟标识',
                        type: 'string',
                        display: initialValues.productType === 'VIRTUAL_SERVE',
                        enum: ['短信', '金牌商家'].map((name, index) => ({
                          label: name,
                          value: virtualServeTypeMap[index],
                        })),
                        'x-component-props': {
                          placeholder: '请选择虚拟服务标识',
                        },
                        'x-rules': {
                          required: true,
                          message: '请选择虚拟服务标识',
                        },
                      },
                    },
                  },

                  item3: {
                    type: 'object',
                    'x-component': 'grid',
                    'x-component-props': {
                      gutter: 12,
                      cols: [8, 8],
                    },
                    properties: {
                      saleStatus: {
                        title: '销售状态',
                        type: 'boolean',
                        default: false,
                        editable: !disableSaleStatus(initialValues.belongsTo),
                      },

                      status: {
                        title: '服务状态',
                        type: 'boolean',
                        display: false,
                        default: false,
                      },
                    },
                  },

                  item4: {
                    type: 'object',
                    'x-component': 'grid',
                    'x-component-props': {
                      gutter: 12,
                      cols: [8],
                    },
                    properties: {
                      image: {
                        title: '商品图片',
                        type: 'uploadFile',
                        'x-rules': {
                          required: true,
                          message: '请上传服务图片',
                        },
                      },
                    },
                  },
                },
              },

              priceLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  title: '服务价格',
                  type: 'inner',
                  className: 'product-category-container',
                },
                properties: {
                  defProductPriceVOList: {
                    type: 'customizeTable',
                    maxItems: 8,
                    'x-rules': {
                      required: true,
                      message: '请添加服务价格',
                    },
                    'x-props': {
                      itemClassName: 'full-width__form-item-control',
                    },
                    'x-component-props': {
                      defaultValue: initialValues.defProductPriceDTOS,
                      tableProps: {
                        bordered: true,
                      },
                      renderHeader: ({ add }) => (
                        <div style={{ marginBottom: 15, marginTop: 5 }}>
                          <ButtonList
                            list={[{ type: 'primary', text: '添加价格', onClick: () => add() }]}
                          />
                        </div>
                      ),
                      renderOperation: ({ remove, currentItemData }) => (
                        <ButtonList
                          isLink
                          list={[
                            {
                              text: '删除',
                              popconfirmProps: {
                                title: '确定需要删除嘛？',
                                okText: '确定',
                                cancelText: '取消',
                                onConfirm: () => {
                                  cacheDelPriceId(currentItemData.id);
                                  remove();
                                },
                              },
                            },
                          ]}
                        />
                      ),
                    },
                    items: {
                      type: 'object',
                      properties: {
                        priceInterval: {
                          title: (
                            <span className="ant-form-item-required">{priceIntervalTitle}</span>
                          ),
                          type: 'number',
                          required: true,
                          'x-props': {
                            itemClassName: 'full-width__form-item-control__input-number',
                          },
                          'x-component-props': {
                            min: 0,
                            max: 9999,
                            formatter: (value: string) => (value ? parseInt(value, 10) : value),
                          },
                        },

                        price: {
                          title: <span className="ant-form-item-required">价格（元）</span>,
                          type: 'number',
                          required: true,
                          'x-props': {
                            itemClassName: 'full-width__form-item-control__input-number',
                          },
                          'x-component-props': {
                            min: 0,
                            max: 999999,
                            precision: 2,
                            step: 0.1,
                          },
                        },
                      },
                    },
                  },
                },
              },

              detailLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  title: '服务详情',
                  type: 'inner',
                  className: 'product-category-container',
                },
                properties: {
                  productDetail: {
                    type: 'ckEditor',
                    'x-props': {
                      itemClassName: 'full-width__form-item-control',
                    },
                    'x-component-props': {
                      height: 400,
                    },
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
      }}
    />
  );
}
