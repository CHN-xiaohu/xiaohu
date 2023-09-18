/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prefer-const */
import { useCallback, useRef } from 'react';
import { history } from 'umi';
import { FormEffectHooks, createAsyncFormActions } from '@formily/antd';
import { FormStep } from '@formily/antd-components';
import { Spin, message } from 'antd';
import { useUnmount, useDebounceEffect } from 'ahooks';
import { SchemaForm } from '@/components/Business/Formily';
import type { RouteChildrenProps } from '@/typings/basis';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useSetBreadcrumbTextToCreateOrUpdate } from '@/foundations/hooks';

import { goFirstStep } from '@/pages/Product/Manager/Common';
import {
  useStepButtonList,
  useReRequestProductParamsAndAttributes,
} from '@/pages/Product/Manager/Form//Hooks';

import { useCategoryLayoutBySchema } from '@/pages/Product/Manager/Form/Fields/CategoryLayout';

import { useFields } from '@/pages/Product/Manager/Form/components/FormFields';

import { GroupSelect } from '@/pages/Product/components/GroupsSelect';

import { useDetailLayoutBySchema } from './Fields/DetailLayout';

import styles from './index.less';

import { useProductInfoLayoutBySchema } from './Fields/ProductInfoLayout';
import { useParamsLayoutBySchema } from './Fields/ParamsLayout';

import { useSkuLayoutBySchema } from './Fields/SkuLayout';

import { formatFormData } from './TransformData';

import { SpecificationTable } from './Fields/SkuLayout/x-components/SpecificationTable';

import { useSkuLayoutEffects } from './Fields/SkuLayout/effects';

import { updateDistributionProduct } from '../../Api';
import { createRichTextUtils } from '../../Manager/Form';

export const formActions = createAsyncFormActions();

const stepList = [
  { title: '选择商品分类', name: 'formLayout.categoryLayout' },
  { title: '填写商品信息', name: 'formLayout.productInfoFullLayout' },
  { title: '填写商品属性', name: 'formLayout.skuFullLayout' },
];

export const modelNamespace = 'distributionProduct';

export default function ProductDistributionForm({
  match,
  location,
}: RouteChildrenProps<{ id?: string }>) {
  const { initialValues, formLoading } = useStoreState(modelNamespace);
  const initialValuesRef = useRef(initialValues);

  const { stepButtonList, switchStepButtonListByFormStepChange } = useStepButtonList({
    formActions,
    modelNamespace,
  });

  const isEdit = !!match.params.id;

  const fieldComponents = useFields({
    // sku table
    specificationTable: SpecificationTable,
  });

  const categoryLayout = useCategoryLayoutBySchema(formActions, modelNamespace);
  const productInfoLayout = useProductInfoLayoutBySchema(formActions);
  const paramsLayout = useParamsLayoutBySchema(formActions);
  const skuLayout = useSkuLayoutBySchema(formActions);
  const detailLayout = useDetailLayoutBySchema(formActions, modelNamespace);

  useSetBreadcrumbTextToCreateOrUpdate();

  useUnmount(() => {
    window.$fastDispatch((model) => model.product.resetInitialValues);
    window.$fastDispatch((model) => model[modelNamespace].resetInitialValues);
    formActions.reset({ validate: false, forceClear: true });
  });

  const {
    previousCategoryIds,
    handleReRequestProductParamsAndAttributes,
  } = useReRequestProductParamsAndAttributes(formActions, modelNamespace);

  useDebounceEffect(
    () => {
      // uform 的 effects 是一个缓存起来的闭包，需要保证引用不变，所以这里需要 ref 来做持久引用、穿透
      initialValuesRef.current = initialValues;

      if (!previousCategoryIds.current.length && initialValues.categoryIds.length) {
        previousCategoryIds.current = initialValues.categoryIds;
      }

      formActions.setFieldValue('productState', Number(initialValues.productState) === 1);
    },
    [initialValues],
    { wait: 300 },
  );

  const handleAddOrUpdate = useCallback(async (values: any) => {
    try {
      const requestBody = await formatFormData({
        formId: match.params.id,
        formActions,
        values,
        initialValues: initialValuesRef.current,
      });
      const goBackPath = '/product/distribution';
      return await updateDistributionProduct(requestBody).then(() => history.push(goBackPath));
    } catch (error) {
      message.error(error.message);
      return Promise.reject();
    }
  }, []);

  const handleFormStepChange = useCallback((currentStep) => {
    switchStepButtonListByFormStepChange({
      currentStep,
      stepList,
      formatter: (data) => {
        // 编辑时，默认将提交按钮给显示出来, 并且不是第一步
        if (isEdit && currentStep) {
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
          previewPlaceholder: ' ',
          fields: fieldComponents,
          components: {
            GroupSelect,
          },
          expressionScope: createRichTextUtils(),
          effects: ($, { dispatch }) => {
            FormEffectHooks.onFormMount$().subscribe(async () => {
              // 修改时，自动跳转到第二 step
              if (isEdit) {
                dispatch!(FormStep.ON_FORM_STEP_GO_TO, { value: 1 });

                window.$fastDispatch((model) => model[modelNamespace].handleInitialValues, {
                  id: location.query?.copyProductId ?? match.params.id,
                });
              } else {
                handleFormStepChange(0);
              }
            });

            // 监听分步表单的变动
            $(FormStep.ON_FORM_STEP_CURRENT_CHANGE).subscribe(({ value }) => {
              handleFormStepChange(value);
            });

            useSkuLayoutEffects(initialValuesRef);
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
                  },
                },
                categoryBreadcrumb: {
                  type: 'categoryBreadcrumb' as any,
                  'x-component-props': {
                    canEditCategory: false,
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
