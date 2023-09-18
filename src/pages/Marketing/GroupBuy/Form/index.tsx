import { useCallback } from 'react';
import { Typography } from 'antd';
import { createAsyncFormActions } from '@formily/antd';
import { useStepModalForm } from '@/components/Business/Formily/components/Forms/StepModalForm';

import {
  bizGroupPurchaseConditionsSchema,
  bizGroupPurchaseConditionsFieldPath,
  useBizGroupPurchaseConditionsEffects,
} from './BizGroupPurchaseConditionsField';

import { ChooseProduct } from '../FormFields/ChooseProduct';
import { addOrUpdateGroupBuy } from '../../Api';

import './index.less';

const fields = {
  ChooseProduct,
};

export const formActions = createAsyncFormActions();

export const useGroupBuyForm = (onSubmitSuccess: () => void) => {
  const handleSubmit = useCallback(
    (values: any) => addOrUpdateGroupBuy(values).then(onSubmitSuccess),
    [],
  );

  const { openForm, FormElement } = useStepModalForm({
    fields,
    actions: formActions,
    onSubmit: handleSubmit,
    effects: ($, { setFieldState }) => {
      $('onFieldValueChange', '[startTime,endTime]').subscribe((fieldState) => {
        setFieldState('productName', (fState) => {
          fState.props!['x-component-props']!.timeRange = fieldState.value;
        });
      });

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useBizGroupPurchaseConditionsEffects({ unitFieldPath: 'unit', priceFieldPath: 'price' });
    },
    stepDataSource: [
      { title: '团购信息', name: 'infoLayout' },
      { title: '团购商品', name: 'productLayout' },
      { title: '团购条件', name: bizGroupPurchaseConditionsFieldPath },
    ],
    schema: {
      infoLayout: {
        type: 'virtualBox',
        properties: {
          activityName: {
            type: 'string',
            title: '活动标题',
            'x-component-props': {
              placeholder: '请输入活动标题',
            },
            'x-rules': [
              { required: true, message: '请输入活动标题' },
              { max: 20, message: '活动标题不能超过 20 个字符' },
            ],
          },
          '[startTime,endTime]': {
            title: '活动时间',
            type: 'convenientDateRange',
            'x-rules': { required: true, message: '请选择活动时间' },
          },
          shareDescribe: {
            type: 'textarea',
            title: '分享描述',
            'x-component-props': {
              placeholder: '请输入分享描述',
            },
            'x-rules': [
              { required: true, message: '请输入分享描述' },
              { max: 20, message: '分享描述不能超过 20 个字符' },
            ],
          },
          imagePath: {
            type: 'uploadFile',
            title: '分享图',
            'x-rules': [{ required: true, message: '请上传分享图' }],
            'x-component-props': {
              placeholder: '670*894',
              rule: {
                maxImageWidth: 670,
                maxImageHeight: 894,
              },
            },
          },
          shareRedirectUrl: {
            type: 'string',
            title: '分享跳转地址',
            'x-component-props': {
              placeholder: '请输入分享跳转地址',
            },
            'x-rules': [{ required: true, message: '请输入分享跳转地址' }, { checkUrl: true }],
          },
        },
      },
      productLayout: {
        type: 'virtualBox',
        properties: {
          productId: {
            type: 'string',
            display: false,
          },
          unit: {
            type: 'string',
            display: false,
          },
          activityProductImg: {
            type: 'string',
            display: false,
          },
          productName: {
            type: 'string',
            title: '商品名称',
            'x-component': 'ChooseProduct',
            'x-component-props': {
              timeRange: [],
            },
            'x-rules': {
              required: true,
              message: '请选择商品',
            },
          },
          price: {
            type: 'inputNumber',
            title: '团购价',
            description: (
              <Typography.Text type="danger">
                如商品存在多规格，则所有规格均是此价售卖，请谨慎设置
              </Typography.Text>
            ),
            'x-component-props': {
              placeholder: '请输入团购价',
              min: 0.01,
              max: 99999,
              precision: 2,
              step: 0.1,
              addonAfter: '元',
              style: {
                width: 160,
              },
            },
            'x-rules': {
              required: true,
              message: '请输入团购价',
            },
          },
        },
      },
      [bizGroupPurchaseConditionsFieldPath]: bizGroupPurchaseConditionsSchema,
    },
  });

  const openGroupBuyForm = useCallback((initialValues: AnyObject = {}) => {
    const isUpdate = !!initialValues.id;

    setTimeout(() => {
      formActions.setFieldState(bizGroupPurchaseConditionsFieldPath, (fieldState) => {
        fieldState.editable = !isUpdate;
      });

      formActions.setFieldState('[startTime,endTime]', (fieldState) => {
        fieldState.editable = !isUpdate;
      });

      formActions.setFieldState(
        `*(productLayout,${bizGroupPurchaseConditionsFieldPath}).*`,
        (fieldState) => {
          fieldState.editable = !isUpdate;
        },
      );
    });

    openForm({
      title: `${isUpdate ? '编辑' : '新增'}团购活动`,
      initialValues: { ...initialValues },
    });
  }, []);

  return {
    openGroupBuyForm,
    GroupBuyFormElement: FormElement,
  };
};
