import { useCallback } from 'react';
import { Card, message, Spin } from 'antd';
import { useImmer } from 'use-immer';
import { createFormActions } from '@formily/antd';
import { history } from 'umi';
import { useMount } from 'ahooks';

import { useDebounceWatch, useLoadingWrapper } from '@/foundations/hooks';
import type { RouteChildrenProps } from '@/typings/basis';

import { NormalForm } from '@/components/Business/Formily';
import { composeNewObjectFromDataSourceByFields } from '@/utils';

import { useFields } from './components/Fields';
import { AddDiscountModal } from './components/AddDiscountModal';

import type { IStoredValueColumn } from '../Api';
import { addStoredValue, updateStoredValue, showStoredValue } from '../Api';

import { disableUpdateStartTimeAndEndTime } from '../Constant';

const formActions = createFormActions();

export default function StoredValueForm({ match }: RouteChildrenProps) {
  const [state, setState] = useImmer({
    initialValues: {} as IStoredValueColumn,
    discounts: [] as any,
  });

  const { isLoading, runRequest } = useLoadingWrapper();

  const fields = useFields();

  useMount(() => {
    if (!match.params.id) {
      return;
    }

    runRequest(() =>
      showStoredValue(match.params.id).then((res) => {
        setState((draft) => {
          const { data } = res;

          draft.discounts = data.lists;
          draft.initialValues = data;

          formActions.setFieldState('[startTime,endTime]', (fieldState) => {
            fieldState.value = [data.startTime, data.endTime];

            fieldState.editable = !disableUpdateStartTimeAndEndTime(Number(data.activeStatus));
            (fieldState.props as any).description = '';
          });
        });
      }),
    );
  });

  useDebounceWatch(() => {
    formActions.setFieldValue('lists', state.discounts);
  }, [state.discounts]);

  const handleAddDiscountSuccess = useCallback(
    (values: any) => {
      const { discountList, overAmount } = values;

      let discount = { overAmount };
      Object.keys(discountList).forEach((type) => {
        discount = { ...discount, ...discountList[type] };
      });

      setState((draft) => {
        draft.discounts.push(discount);
      });
    },
    [state.discounts],
  );

  const handleSubmit = useCallback((values: any) => {
    values.isUsing = Number(values.isUsing);

    // 本来是无需添加的，都是后端没做，还是传吧
    values.activeStatus = 1;

    values.lists = (values.lists as any[]).map((item) => {
      if (item.couponLists) {
        item.couponLists = (item.couponLists as any[]).map((v) => {
          delete v.name;

          return v;
        });
      }

      return composeNewObjectFromDataSourceByFields(item, ['overAmount', 'amount', 'couponLists']);
    });

    let method = addStoredValue;
    if (match.params.id) {
      method = updateStoredValue;
      values.id = match.params.id;
    }

    return method(values).then(() => history.push('/stored-values'));
  }, []);

  return (
    <Spin spinning={isLoading}>
      <Card>
        <NormalForm
          {...{
            actions: formActions,
            labelCol: { span: 2 },
            wrapperCol: { span: 15 },
            fields,
            initialValues: state.initialValues,
            onSubmit: handleSubmit,
            effects: ($) => {
              $('onFieldValueChange', 'lists').subscribe((fieldState) => {
                setState((draft) => {
                  draft.discounts = fieldState.value;
                });
              });
            },
            schema: {
              basicLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  type: 'inner',
                  title: '基本信息',
                },
                properties: {
                  isUsing: {
                    title: '启用',
                    type: 'boolean',
                    default: true,
                  },
                  name: {
                    title: '活动名称',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '请输入活动名称',
                    },
                    'x-rules': [
                      { required: true, message: '请输入活动名称' },
                      { range: [1, 15], message: '活动名称不超过 15 个字' },
                    ],
                  },
                },
              },

              discountLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  type: 'inner',
                  title: '活动优惠',
                  extra: (
                    <AddDiscountModal
                      lists={state.discounts}
                      addDiscountSuccess={handleAddDiscountSuccess}
                    />
                  ),
                },
                properties: {
                  '[startTime,endTime]': {
                    title: '生效时间',
                    type: 'convenientDateRange',
                    description: '同一时间周期内，只能存在一个有效的活动',
                    // 'x-component-props': {
                    //   placeholder: '请选择生效周期',
                    // },
                    'x-rules': [{ required: true, message: '请选择生效周期' }],
                  },
                  content: {
                    title: '优惠规则',
                    type: 'textarea',
                    'x-component-props': {
                      placeholder: '请输入优惠规则（展示给商家端查看）',
                      rows: 4,
                      style: { marginTop: 12 },
                    },
                    'x-rules': [{ max: 50, message: '优惠规则不超过 50 个字' }],
                  },

                  lists: {
                    type: 'discountList' as any,
                    'x-props': {
                      itemClassName: 'full-width__form-item-control',
                    },
                    'x-rules': {
                      validator: (value) => {
                        if (!value || (Array.isArray(value) && !value.length)) {
                          message.warning('至少需要添加一条活动优惠');

                          return '至少需要添加一条活动优惠';
                        }

                        return '';
                      },
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
          }}
        />
      </Card>
    </Spin>
  );
}
