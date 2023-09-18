import { Drawer } from 'antd';
import { Submit, createEffectHook } from '@formily/antd';
import type { DrawerProps } from 'antd/es/drawer';
import type { SchemaFormProps } from '@app_components/Business/Formily/SchemaForm';
import { SchemaForm } from '@app_components/Business/Formily/SchemaForm';

import { Cancel } from '@app_components/Business/Formily/components/Schemas/Form/Buttons/Cancel';

import type { UseLayerFormLogicProps } from '../Common';
import { useLayerFormLogic } from '../Common';

export type DrawerFormProps<V = any> = {
  title: string;
  drawerProps?: Omit<DrawerProps, 'visible' | 'onClose'>;
} & Pick<SchemaFormProps, 'children'> &
  Omit<SchemaFormProps, 'onSubmit' | 'children' | 'initialValues' | 'actions'> &
  UseLayerFormLogicProps<V>;

const defaultCustomizeEffectHookMap = {
  onOpenForm: 'onOpenDrawerForm',
  onCloseForm: 'onCloseDrawerForm',
  onFormSubmitSuccess: 'onDrawerFormSubmitSuccess',
  onFormSubmitError: 'onDrawerFormSubmitError',
};

// 自定义声明周期
export const onOpenDrawerForm$ = createEffectHook(defaultCustomizeEffectHookMap.onOpenForm);
export const onCloseDrawerForm$ = createEffectHook(defaultCustomizeEffectHookMap.onCloseForm);
export const onDrawerFormSubmitSuccess$ = createEffectHook(
  defaultCustomizeEffectHookMap.onFormSubmitSuccess,
);
export const onDrawerFormSubmitError$ = createEffectHook(
  defaultCustomizeEffectHookMap.onFormSubmitError,
);

export const DrawerForm = <V extends any>({
  children,
  onSubmit,
  onCreate,
  onUpdate,
  onCancel,
  actions,
  title = '表单',
  visible = false,
  primaryKey = 'id',
  initialValues,
  drawerProps,
  isAutoResetForm = true,
  ...props
}: DrawerFormProps<V>) => {
  const { formActions, handleCancel, handleSubmit } = useLayerFormLogic({
    actions,
    visible,
    onSubmit,
    onCreate,
    onUpdate,
    onCancel,
    primaryKey,
    initialValues,
    isAutoResetForm,
    customizeEffectHookMap: defaultCustomizeEffectHookMap,
  });

  return (
    <Drawer
      {...{
        width: 500,
        ...drawerProps,
        visible,
        title,
        onClose: handleCancel,
      }}
    >
      <SchemaForm
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        {...(props as any)}
        actions={formActions}
        onSubmit={handleSubmit}
        style={{ paddingBottom: 80 }}
      >
        {children}

        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'center',
          }}
        >
          <Cancel style={{ marginRight: 8 }} showLoading onClick={handleCancel} />

          <Submit type="primary" showLoading>
            确认
          </Submit>
        </div>
      </SchemaForm>
    </Drawer>
  );
};
