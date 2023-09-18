import { useCallback } from 'react';
import { useModalForm } from '@/components/Business/Formily';
import { ButtonList } from '@/components/Library/ButtonList';
import { message } from 'antd';

import { createAsyncFormActions } from '@formily/antd';

import { saveOrUpdatePrinterSet, testPrinter } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const usePrinterForm = ({ onAddSuccess }: Props) => {
  // 测试打印
  const handleTest = () =>
    formActions.validate().then(() =>
      formActions.getFormState().then((formState) => {
        const { machineCode, privateKey, brand } = formState.values;
        testPrinter({ machineCode, privateKey, brand, platform: 2 })
          .then((res) => {
            message.info(res.msg);
          })
          .catch((err) => {
            console.log(err);
          });
      }),
    );

  // 保存打印设置
  const handleSave = useCallback(
    (values) =>
      saveOrUpdatePrinterSet(values)
        .then(onAddSuccess)
        .catch((err) => {
          console.log(err);
        }),
    [],
  );

  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    onSubmit: handleSave,
    isNativeAntdStyle: true,
    footer: ({ onCancel, onOk }) => (
      <ButtonList
        align="right"
        list={[
          {
            text: '取消',
            onClick: onCancel,
          },
          {
            text: '打印测试',
            onClick: handleTest,
          },
          {
            text: '保存',
            type: 'primary',
            onClick: onOk,
          },
        ]}
      />
    ),
    schema: {
      brand: {
        title: '设备品牌',
        type: 'radio',
        enum: [{ label: '易联云', value: 0 }],
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      name: {
        title: '备注名称',
        type: 'string',
        'x-component-props': {
          placeholder: '如订单打印机',
        },
        'x-rules': [
          {
            required: true,
            message: '设备名称唯一',
          },
        ],
      },
      machineCode: {
        title: '设备号码',
        type: 'string',
        'x-component-props': {
          placeholder: '输入打印机底部的机器码/终端号',
        },
        'x-rules': [
          {
            required: true,
            message: '设备号码不能为空',
          },
        ],
      },
      privateKey: {
        title: '设备密钥',
        type: 'string',
        'x-component-props': {
          placeholder: '输入打印机底部的设备密钥',
        },
        'x-rules': [
          {
            required: true,
            message: '设备密钥不能为空',
          },
        ],
      },
      platform: {
        title: '自动打印',
        type: 'radio',
        enum: [
          { label: '采购单', value: 0 },
          // { label: '供货单', value: 1 },
        ],
        'x-rules': [
          {
            required: true,
            message: '请选择打印的类型',
          },
        ],
      },
    },
  });

  const handleOpenEditorForm = (initialValues: AnyObject = { brand: 0, platform: 0 }) => {
    openModalForm({
      title: `${initialValues.id ? '编辑' : '新增'}打印机`,
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenEditorForm,
    ModalFormElement,
  };
};

// 设备号码：4004569544，设备密钥：	yabrexxw6mzq，设备名称：采购单
