import classNames from 'classnames';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/es/modal';
import type { SchemaFormProps } from '@app_components/Business/Formily/SchemaForm';
import { SchemaForm } from '@app_components/Business/Formily/SchemaForm';
import { createEffectHook, FormSpy, FormProvider, LifeCycleTypes } from '@formily/antd';

import { FormStep } from '@formily/antd-components';

import { ButtonList } from '@/components/Library/ButtonList';

import type { StepsProps } from 'antd/lib/steps';

import styles from './index.less';

import type { UseLayerFormLogicProps } from '../Common';
import { useLayerFormLogic } from '../Common';

export type FormProps<V = any> = {
  title?: string;
  modalProps?: Omit<ModalProps, 'visible' | 'onCancel' | 'onOk'>;
  stepDataSource?: { title: string; name: string; disabled?: boolean }[];
  stepProps?: Omit<StepsProps, 'dataSource'>;
  isAutoShowSubmitBtn?: boolean;
  whenEditingStepIsClickable?: boolean;
} & Pick<SchemaFormProps, 'children'> &
  Omit<SchemaFormProps, 'onSubmit' | 'children' | 'initialValues' | 'actions'> &
  UseLayerFormLogicProps<V>;

const defaultCustomizeEffectHookMap = {
  onOpenForm: 'onOpenStepModalForm',
  onCloseForm: 'onCloseStepModalForm',
  onFormSubmitSuccess: 'onStepModalFormSubmitSuccess',
  onFormSubmitError: 'onStepModalFormSubmitError',
};

// 自定义声明周期
export const onOpenModalForm$ = createEffectHook(defaultCustomizeEffectHookMap.onOpenForm);
export const onCloseModalForm$ = createEffectHook(defaultCustomizeEffectHookMap.onCloseForm);
export const onModalFormSubmitSuccess$ = createEffectHook(
  defaultCustomizeEffectHookMap.onFormSubmitError,
);
export const onModalFormSubmitError$ = createEffectHook(
  defaultCustomizeEffectHookMap.onFormSubmitError,
);

const paddingSize = 24;
const bodyTop = (document.querySelector('#globalHeader')?.clientHeight || 0) + paddingSize + 2;

export const Form = <V extends any>({
  children,
  onSubmit,
  onCreate,
  onUpdate,
  onCancel,
  actions,
  title = '表单',
  visible = false,
  primaryKey = 'id',
  stepDataSource = [],
  stepProps = {},
  initialValues,
  modalProps,
  isAutoResetForm = true,
  isAutoShowSubmitBtn = true,
  whenEditingStepIsClickable = true,
  ...props
}: FormProps<V>) => {
  const { isLoading, formActions, handleCancel, handleSubmit } = useLayerFormLogic({
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

  const isEditing = Boolean(initialValues?.[primaryKey]);
  // 只有编辑时并且开启了 whenEditingStepIsClickable
  // 或者自动传递 onChange 的时候，才可以点击
  const stepIsClickable = (whenEditingStepIsClickable && isEditing) || stepProps.onChange;

  return (
    <Modal
      {...{
        ...modalProps,
        footer: null,
        className: styles.wrapper,
        width: (document.querySelector('#app-main-body')?.clientWidth || 0) + 4,
        maskStyle: {
          zIndex: 900,
        },
        style: {
          top: bodyTop,
          // 边距
          marginLeft:
            window.innerWidth -
            (document.querySelector('#app-main-body')?.clientWidth || 0) -
            paddingSize -
            4,
          marginBottom: 0,
          paddingBottom: 0,
          height: `calc(100vh - ${bodyTop}px - ${paddingSize}px)`,
          ...modalProps?.style,
        },
        bodyStyle: modalProps?.bodyStyle,
        visible,
        title,
        confirmLoading: isLoading,
        onOk: () => formActions.submit(),
        onCancel: handleCancel,
      }}
    >
      <FormProvider>
        <SchemaForm
          {...{
            labelCol: { span: 3 },
            wrapperCol: { span: 16 },
            ...((props as any) || {}),
            effects: ($, innerActions) => {
              if (props.effects) {
                props.effects($, innerActions);
              }

              $(defaultCustomizeEffectHookMap.onCloseForm).subscribe(() => {
                innerActions.dispatch!(FormStep.ON_FORM_STEP_GO_TO, { value: 0 });
              });
            },
            schema: {
              formStep: {
                'x-component': 'step',
                'x-component-props': {
                  ...(!stepIsClickable
                    ? {}
                    : {
                        onChange: (value: number) => {
                          formActions.dispatch!(FormStep.ON_FORM_STEP_GO_TO, { value });
                        },
                      }),
                  ...stepProps,
                  className: classNames('step__form-item', {
                    'step__form-item--clickable': stepIsClickable,
                  }),
                  dataSource: stepDataSource,
                },
              },
              ...(props?.schema || {}),
            },
            actions: formActions,
            onSubmit: handleSubmit,
          }}
        />

        <div className={styles.footer}>
          <FormSpy
            selector={FormStep.ON_FORM_STEP_CURRENT_CHANGE}
            reducer={(state, action) => {
              switch (action.type) {
                case FormStep.ON_FORM_STEP_CURRENT_CHANGE:
                  return { ...state, step: action.payload };
                case LifeCycleTypes.ON_FORM_SUBMIT_START:
                  return { ...state, submitting: true };
                case LifeCycleTypes.ON_FORM_SUBMIT_END:
                  return { ...state, submitting: false };
                default:
                  return { step: { value: 0 } };
              }
            }}
          >
            {({ state }) => {
              const formStepState = state.step ? state : { step: { value: 0 } };
              const { value: currentStep } = formStepState.step;

              const firstStep = formStepState.step.value === 0;
              const isLastStep = currentStep === stepDataSource.length - 1;

              const prevStep = stepDataSource[currentStep - 1];
              const nextStep = stepDataSource[currentStep + 1];

              const prevText = `上一步，${prevStep?.title || ''}`;
              const nextText = `下一步，${nextStep?.title || ''}`;

              const showSubmitBtn = isAutoShowSubmitBtn ? isLastStep || isEditing : isLastStep;

              return (
                <ButtonList
                  maxCount={10}
                  list={[
                    {
                      text: '取消',
                      onClick: handleCancel,
                    },
                    {
                      text: prevText,

                      style: {
                        display: prevStep?.disabled || firstStep ? 'none' : '',
                      },
                      onClick: () => {
                        formActions.dispatch!(FormStep.ON_FORM_STEP_PREVIOUS);
                      },
                    },
                    {
                      text: nextText,
                      type: 'primary',
                      style: {
                        display: nextStep?.disabled || isLastStep ? 'none' : '',
                      },
                      onClick: () => {
                        formActions.dispatch!(FormStep.ON_FORM_STEP_NEXT);
                      },
                    },
                    {
                      text: '提交数据',
                      type: 'primary',
                      disabled: state.submitting,
                      loading: state.submitting,
                      style: {
                        display: showSubmitBtn ? '' : 'none',
                      },
                      onClick: (e: { stopPropagation: () => void; preventDefault: () => void }) => {
                        e.stopPropagation();
                        e.preventDefault();

                        formActions.submit();
                      },
                    },
                  ]}
                />
              );
            }}
          </FormSpy>
        </div>
      </FormProvider>
    </Modal>
  );
};
