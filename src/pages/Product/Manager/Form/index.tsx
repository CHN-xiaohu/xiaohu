/* eslint-disable prefer-const */
import { useRef } from 'react';

import * as React from 'react';
import { history } from 'umi';
import { FormEffectHooks, createAsyncFormActions } from '@formily/antd';
import { FormStep } from '@formily/antd-components';
import { Spin, Tooltip } from 'antd';
import { useUnmount, useDebounceEffect } from 'ahooks';
import { SchemaForm } from '@/components/Business/Formily';
import type { RouteChildrenProps } from '@/typings/basis';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useSetBreadcrumbTextToCreateOrUpdate } from '@/foundations/hooks';

import { icons } from '@/components/Library/Icon';

import { useMount } from 'ahooks';

import styles from './index.less';

import { useProductInfoLayoutBySchema } from './Fields/ProductInfoLayout';
import { useParamsLayoutBySchema } from './Fields/ParamsLayout';
import { useSkuLayoutBySchema } from './Fields/SkuLayout';
import { usePriceLayoutBySchema, usePriceLayoutEffects } from './Fields/PriceLayout';
import { useDetailLayoutBySchema } from './Fields/DetailLayout';
import { useCategoryLayoutBySchema } from './Fields/CategoryLayout';
import { useFields } from './components/FormFields';
import { useSkuLayoutEffects } from './Fields/SkuLayout/effects';

import { formatFormData } from './TransformData';

import { useStepButtonList } from './Hooks/useStepButtonList';
import { useReRequestProductParamsAndAttributes } from './Hooks/useReRequestProductParamsAndAttributes';

import { GroupSelect } from '../../components/GroupsSelect';

import { addOrUpdateProduct, addOrUpdateMiniprogramProduct } from '../../Api';
import { goFirstStep } from '../Common';
import {
  ChargeUnitCascader,
  useChargeUnitCascaderEffects,
} from '../../components/ChargeUnitCascader';

export const formActions = createAsyncFormActions();

const stepList = [
  { title: '选择商品分类', name: 'formLayout.categoryLayout' },
  { title: '填写商品信息', name: 'formLayout.productInfoFullLayout' },
  { title: '填写商品属性', name: 'formLayout.skuFullLayout' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// let cacheStepData = {}

// 缓存第一步的数据，用于点击修改类目时候，回滚到第一步
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// let cacheFirstStep = {}

export const createRichTextUtils = () => {
  return {
    help(text: string | React.ReactNode, offset = 8) {
      return React.createElement(
        Tooltip,
        // antd v4 类型异常
        { title: text } as any,
        <icons.QuestionCircleOutlined
          style={{ marginLeft: offset, marginRight: '-8px', cursor: 'pointer' }}
        />,
      );
    },
    supplierHelp(wrapper: Function) {
      return wrapper(
        <span>
          前往 <a onClick={() => history.push('/consumer/supplier')}>用户管理/供应商列表</a>
          ，添加供应商，如平台自营
        </span>,
      );
    },
    storeHelp(wrapper: Function) {
      return wrapper(
        <span>
          前往 <a onClick={() => history.push('/consumer/merchant')}>用户管理/商家列表</a>
          ，商家来源：添加供应商、app 注册商家
        </span>,
      );
    },
  };
};

const modelNamespace = 'product';

// eslint-disable-next-line func-names
export default function ProductManagerForm({
  match,
  location,
  route,
}: RouteChildrenProps<{ id?: string }>) {
  const { initialValues, formLoading, buttonGroupDisabled, isImportFromProduct } =
    useStoreState(modelNamespace);
  const initialValuesRef = useRef(initialValues);
  const isImportFromProductRef = useRef(isImportFromProduct);
  isImportFromProductRef.current = isImportFromProduct;

  const { stepButtonList, switchStepButtonListByFormStepChange } = useStepButtonList({
    formActions,
    modelNamespace,
  });

  const isEdit = !!match.params.id;

  const isMiniprogramProduct = route.miniprogram;

  // 是否显示小程序拿货价
  const isMiniprogramShowTakeProductsPrice =
    Number(initialValuesRef.current?.fromType) === 1 &&
    !initialValuesRef.current?.salePropKeyNames?.length;

  const fieldComponents = useFields();
  const categoryLayout = useCategoryLayoutBySchema(formActions);
  const productInfoLayout = useProductInfoLayoutBySchema(
    formActions,
    isImportFromProduct,
    isMiniprogramProduct,
  );
  const paramsLayout = useParamsLayoutBySchema(formActions, isImportFromProduct);
  const skuLayout = useSkuLayoutBySchema(formActions, isImportFromProduct, isMiniprogramProduct);
  const priceLayout = usePriceLayoutBySchema(
    formActions,
    isImportFromProduct,
    isMiniprogramProduct,
    isMiniprogramShowTakeProductsPrice,
  );
  const detailLayout = useDetailLayoutBySchema(formActions);

  useSetBreadcrumbTextToCreateOrUpdate();

  useMount(() => {
    window.$fastDispatch((model) => model.product.setIsImportFromProduct, {
      type: location.query?.isImportFromProduct,
    });
  });

  useUnmount(() => {
    window.$fastDispatch((model) => model.product.resetInitialValues);
    formActions.reset({ validate: false, forceClear: true });
  });

  const { previousCategoryIds, handleReRequestProductParamsAndAttributes } =
    useReRequestProductParamsAndAttributes(formActions);

  useDebounceEffect(
    () => {
      // uform 的 effects 是一个缓存起来的闭包，需要保证引用不变，所以这里需要 ref 来做持久引用、穿透
      initialValuesRef.current = initialValues;

      if (!previousCategoryIds.current.length && initialValues.categoryIds.length) {
        previousCategoryIds.current = initialValues.categoryIds;
      }

      formActions.setFieldValue(
        'productState',
        Number(initialValues.productState || initialValues.miniProductState) === 1,
      );
    },
    [initialValues],
    { wait: 300 },
  );

  const handleAddOrUpdate = React.useCallback(async (values: any) => {
    const requestBody = await formatFormData({
      formId: match.params.id,
      formActions,
      values,
      initialValues: initialValuesRef.current,
      isMiniprogramProduct,
    });

    const method = isMiniprogramProduct ? addOrUpdateMiniprogramProduct : addOrUpdateProduct;

    const goBackPath = isMiniprogramProduct ? '/product/miniprogram' : '/product/manager';

    return method(requestBody).then(() => history.push(goBackPath));
  }, []);

  const handleFormStepChange = React.useCallback((currentStep) => {
    switchStepButtonListByFormStepChange({
      currentStep,
      stepList,
      formatter: (data) => {
        // 编辑时，默认将提交按钮给显示出来, 并且不是第一步
        if (isEdit && !location.query?.isImportFromProduct && currentStep) {
          data.submit = '';
        }

        return data;
      },
    });

    if (currentStep === 1) {
      handleReRequestProductParamsAndAttributes();
    }
  }, []);

  return (
    <Spin spinning={formLoading}>
      <SchemaForm
        {...{
          actions: formActions,
          initialValues: {
            shareProfit: Boolean(Number(initialValues.shareProfit)),
          },
          onSubmit: handleAddOrUpdate,
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
          editable: !isImportFromProduct,
          previewPlaceholder: ' ',
          components: {
            GroupSelect,
            ChargeUnitCascader,
          },
          fields: fieldComponents,
          expressionScope: createRichTextUtils(),
          effects: ($, { dispatch }) => {
            FormEffectHooks.onFormMount$().subscribe(async () => {
              if (isEdit) {
                // 修改时，自动跳转到第二 step
                dispatch!(FormStep.ON_FORM_STEP_GO_TO, { value: 1 });

                window.$fastDispatch((model) => model.product.handleInitialValues, {
                  id: match.params.id,
                  isMiniprogramProduct,
                  isImportFromProduct: !!location.query?.isImportFromProduct,
                });
              } else {
                handleFormStepChange(0);
              }
            });

            // 监听分步表单的变动
            $(FormStep.ON_FORM_STEP_CURRENT_CHANGE).subscribe(({ value }) => {
              handleFormStepChange(value);
            });

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useChargeUnitCascaderEffects();
            // eslint-disable-next-line react-hooks/rules-of-hooks
            usePriceLayoutEffects({ isImportFromProductRef });
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useSkuLayoutEffects();
          },
          className: styles.wrapper,
          schema: {
            formStep: {
              'x-component': 'step',
              'x-component-props': {
                style: {
                  marginBottom: 20,
                },
                dataSource: stepList,
              },
            },
            formLayout: {
              type: 'object',
              'x-component': 'card',
              'x-component-props': {
                size: 'default',
                id: 'rootLayout',
              },
              properties: {
                switchGroup: {
                  type: 'object',
                  'x-component': 'layout',
                  'x-component-props': {
                    className: 'switch-group-wrapper',
                  },
                  properties: {
                    productState: {
                      title: '立即上架',
                      type: 'boolean',
                      editable: true,
                    },
                    // shareProfit: {
                    //   title: '合伙人分润',
                    //   type: 'boolean',
                    // },
                  },
                },
                categoryBreadcrumb: {
                  type: 'categoryBreadcrumb' as any,
                  'x-component-props': {
                    canEditCategory: !isImportFromProduct,
                    onClickEdit: () => goFirstStep(formActions),
                  },
                },

                // 选择商品分类
                ...categoryLayout,

                // 填写商品信息
                productInfoFullLayout: {
                  type: 'object',
                  properties: {
                    productInfoLayout,
                    detailLayout,
                  },
                },

                // 填写商品属性
                skuFullLayout: {
                  type: 'object',
                  properties: {
                    paramsLayout,
                    skuLayout,
                    priceLayout,
                  },
                },

                // button group
                formButtonList: {
                  type: 'object',
                  'x-component': 'formButtonGroup',
                  properties: {
                    buttonGroup: {
                      type: 'buttonList',
                      'x-component-props': {
                        isDisabled: buttonGroupDisabled,
                        list: stepButtonList,
                      },
                    },
                  },
                },
              },
            },
          },
        }}
      />
    </Spin>
  );
}
