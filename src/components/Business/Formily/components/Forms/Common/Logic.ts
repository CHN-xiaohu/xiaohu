import type { IFormAsyncActions, IFormActions, IFormResetOptions } from '@formily/antd';
import { createAsyncFormActions } from '@formily/antd';
import { cloneDeep } from 'lodash';
import { useMemo, useRef } from 'react';

import { usePersistFn, useUnmount } from 'ahooks';

import type { FormGraph } from '@formily/antd';

import { useLoadingWrapper, useWatch } from '@/foundations/hooks';
import { isNotEmptyObj } from '@/utils';

export const resetFormByFormActions = (
  formActions: UseLayerFormLogicProps['actions'],
  opts?: IFormResetOptions,
) => {
  formActions!.reset(opts).then(() => {
    // https://github.com/alibaba/formily/blob/a6da3eb0c44967f65d38c7cb250c5705351f91a4/packages/core/src/externals.ts#L818
    // 重置的时候，还需要重置掉 field 的 visibleCacheValue
    formActions!.getFormGraph().then((graph: FormGraph) => {
      formActions!.hostUpdate(() => {
        Object.keys(graph).forEach((fieldPath) => {
          formActions!.setFieldState(fieldPath, (state) => {
            state.visibleCacheValue = undefined;
          });
        });
      });
    });
  });
};

export const resetForm = (formActions: UseLayerFormLogicProps['actions']) => {
  formActions!.setFormState((state) => {
    const values = isNotEmptyObj(state.initialValues)
      ? cloneDeep(state.initialValues)
      : Object.create({});

    state.value = values;
    state.values = values;

    setTimeout(() => {
      formActions!.clearErrors();
    }, 16);
  });
};

// 取消
export const handleLayerCancel = ({
  formActions,
  onCancel,
  isAutoResetForm,
  isUnmount,
}: {
  formActions: UseLayerFormLogicProps['actions'];
  onCancel?: UseLayerFormLogicProps['onCancel'];
  isAutoResetForm?: UseLayerFormLogicProps['isAutoResetForm'];
  isUnmount?: UseLayerFormLogicProps['isAutoResetForm'];
}) => {
  onCancel?.();

  if (isAutoResetForm) {
    requestAnimationFrame(() => {
      if (isUnmount) {
        return;
      }

      resetFormByFormActions(formActions, { validate: false, forceClear: true });
      // resetForm(formActions);
    });
  }
};

export const defaultCustomizeEffectHookMap = {
  onOpenForm: 'onOpenModalForm',
  onCloseForm: 'onCloseModalForm',
  onFormSubmitSuccess: 'onModalFormSubmitSuccess',
  onFormSubmitError: 'onModalFormSubmitError',
};

export type UseLayerFormLogicProps<V = any> = {
  actions?: IFormAsyncActions | IFormActions;
  visible: boolean;
  title?: string;
  isOnReset?: boolean;
  initialValues?: V;
  primaryKey?: string;
  isAutoResetForm?: boolean;
  onCancel?: () => void;
  onUpdate?: (id: string, values: V) => Promise<any>;
  onCreate?: (values: V) => Promise<any>;
  onSubmit?: (values: V) => Promise<any>;
  customizeEffectHookMap?: typeof defaultCustomizeEffectHookMap;
};

export const useLayerFormLogic = ({
  actions,
  visible,
  isAutoResetForm,
  initialValues,
  primaryKey = 'id',
  onCancel,
  onCreate,
  onUpdate,
  onSubmit,
  customizeEffectHookMap = defaultCustomizeEffectHookMap,
}: UseLayerFormLogicProps) => {
  const formActions = useMemo(() => actions || createAsyncFormActions(), [actions]);
  const { isLoading, runRequest } = useLoadingWrapper({ seconds: 0.2 });
  const isAutoResetFormRef = useRef<boolean>();
  const isUnmount = useRef<boolean>(false);

  isAutoResetFormRef.current = isAutoResetForm;

  useWatch(() => {
    if (isNotEmptyObj(initialValues)) {
      Promise.resolve().then(() => {
        formActions.setFormState((formState) => {
          const values = { ...formState.initialValues, ...initialValues };

          formState.value = values;
          formState.values = values;
        });
      });
    }
  }, [initialValues]);

  useWatch(() => {
    formActions.dispatch!(
      visible ? customizeEffectHookMap.onOpenForm : customizeEffectHookMap.onCloseForm,
    );
  }, [visible]);

  useUnmount(() => {
    isUnmount.current = true;
  });

  // 取消
  const handleCancel = usePersistFn(() => {
    handleLayerCancel({
      onCancel,
      isAutoResetForm: isAutoResetFormRef.current,
      isUnmount: isUnmount.current,
      formActions,
    });
  });

  /**
   * 表单处理
   */
  const handleSubmit = usePersistFn((values) => {
    let PromiseFC = Promise.resolve();
    const newValues = { ...initialValues, ...values };
    const primaryKeyValue = newValues[primaryKey];

    // 更新
    if (primaryKeyValue && onUpdate) {
      PromiseFC = onUpdate(primaryKeyValue, newValues);
    } else if (onCreate) {
      // 创建
      PromiseFC = onCreate(newValues);
    } else if (onSubmit) {
      // 更新 or 创建
      PromiseFC = onSubmit(newValues);
    }

    return runRequest(() =>
      PromiseFC.then(() => {
        handleCancel();
        formActions.dispatch!(customizeEffectHookMap.onFormSubmitSuccess);
      }).catch((err) => {
        formActions.dispatch!(customizeEffectHookMap.onFormSubmitError);
        console.error(err);
      }),
    );
  });

  return {
    isLoading,
    handleCancel,
    handleSubmit,
    formActions,
  };
};
