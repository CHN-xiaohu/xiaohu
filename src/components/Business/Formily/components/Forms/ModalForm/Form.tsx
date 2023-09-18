import { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { Modal, Button } from 'antd';
import type { ModalProps } from 'antd/es/modal';
import type { SchemaFormProps } from '@app_components/Business/Formily/SchemaForm';
import { SchemaForm } from '@app_components/Business/Formily/SchemaForm';
import { createEffectHook } from '@formily/antd';
import { nanoid } from 'nanoid';

import '../Common/index.less';

import type { UseLayerFormLogicProps } from '../Common';
import { resetFormByFormActions } from '../Common';
import {
  useLayerFormLogic,
  defaultCustomizeEffectHookMap,
  useAppMainBodySamaSizeLayerFormStyle,
} from '../Common';

export type ModalFormProps<V = any> = {
  title?: string;
  isOnReset?: boolean;
  modalProps?: Omit<ModalProps, 'visible' | 'onCancel' | 'onOk'>;
  isNativeAntdStyle?: boolean;
  footer?: (props: Pick<ModalProps, 'onOk' | 'onCancel'>) => React.ReactNode;
} & Pick<SchemaFormProps, 'children'> &
  Omit<SchemaFormProps, 'onSubmit' | 'children' | 'initialValues' | 'actions'> &
  UseLayerFormLogicProps<V>;

// 自定义声明周期
export const onOpenModalForm$ = createEffectHook(defaultCustomizeEffectHookMap.onOpenForm);
export const onCloseModalForm$ = createEffectHook(defaultCustomizeEffectHookMap.onCloseForm);
export const onModalFormSubmitSuccess$ = createEffectHook(
  defaultCustomizeEffectHookMap.onFormSubmitSuccess,
);
export const onModalFormSubmitError$ = createEffectHook(
  defaultCustomizeEffectHookMap.onFormSubmitError,
);

export const ModalForm = <V extends any>({
  children,
  onSubmit,
  onCreate,
  onUpdate,
  onCancel,
  actions,
  title = '表单',
  visible = false,
  isOnReset = false,
  primaryKey = 'id',
  initialValues,
  modalProps,
  isAutoResetForm = true,
  isNativeAntdStyle = false,
  footer,
  ...props
}: ModalFormProps<V>) => {
  const modalId = useMemo(() => nanoid(), []);

  const { isLoading, formActions, handleCancel, handleSubmit } = useLayerFormLogic({
    actions,
    visible,
    onSubmit,
    onCreate,
    onUpdate,
    onCancel,
    isOnReset,
    primaryKey,
    initialValues,
    isAutoResetForm,
  });

  const appMainBodySamaSizeLayerFormStyle = useAppMainBodySamaSizeLayerFormStyle(modalProps || {}, {
    reduceHeight: 53,
  });

  const onOk = useCallback(() => {
    formActions.submit();
  }, [formActions]);

  const handleCancelWrap = useCallback(() => {
    handleCancel();

    // 滚动回顶部
    requestAnimationFrame(() => {
      document
        .querySelector(`.layer-form-${modalId}`)
        ?.querySelector('.ant-modal-body')
        ?.scrollTo({ top: 0 });
    });
  }, [modalId, handleCancel]);

  const handleResetWrap = useCallback(() => {
    resetFormByFormActions(formActions);
  }, [formActions]);

  // const realFooter = React.useMemo(
  //   () => footer?.({ onOk, onCancel: handleCancelWrap }),
  //   [footer, handleCancelWrap, onOk],
  // );

  const realFooter = useMemo(
    () => (
      <>
        {isOnReset && (
          <Button key="reset" onClick={handleResetWrap}>
            重置
          </Button>
        )}
        <Button key="cancel" onClick={handleCancelWrap}>
          取消
        </Button>
        <Button loading={isLoading} onClick={onOk} key="submit" type="primary">
          确定
        </Button>
      </>
    ),
    [footer, handleCancelWrap, onOk, handleResetWrap],
  );

  return (
    <Modal
      {...{
        ...modalProps,
        className: classNames('layer-form-wrap', `layer-form-${modalId}`, modalProps?.className),
        ...(isNativeAntdStyle ? {} : appMainBodySamaSizeLayerFormStyle),
        id: modalId,
        visible,
        title,
        confirmLoading: isLoading,
        footer: realFooter,
        onOk,
        onCancel: handleCancelWrap,
      }}
    >
      <SchemaForm
        {...{
          labelCol: { span: isNativeAntdStyle ? 4 : 3 },
          wrapperCol: { span: 16 },
          ...(props as any),
          actions: formActions,
          onSubmit: handleSubmit,
        }}
      >
        {children}
      </SchemaForm>
    </Modal>
  );
};
