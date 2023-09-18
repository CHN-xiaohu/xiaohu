import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { addEdition } from './Api';

type Props = {
  onAddSuccess: () => void;
};

export const useEditionForm = ({ onAddSuccess }: Props) => {
  const formActions = createAsyncFormActions();
  // const { open } = useDrawerForm();

  const handleCreateSumbit = (values: any) => addEdition(values).then(onAddSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateSumbit,
    actions: formActions,
    isNativeAntdStyle: true,
    labelCol: { span: 6 },
    schema: {
      mobileSystem: {
        type: 'radio',
        title: '选择系统',
        'x-component-props': {
          options: [
            {
              label: 'IOS',
              value: 1,
            },
            {
              label: 'Android',
              value: 0,
            },
          ],
        },
        'x-rules': [
          {
            required: true,
            message: '请选择系统',
          },
        ],
      },
      forceUpdate: {
        type: 'radio',
        title: '是否强制更新',
        default: 0,
        'x-component-props': {
          options: [
            {
              label: '是',
              value: 1,
            },
            {
              label: '否',
              value: 0,
            },
          ],
        },
      },
      editionCode: {
        type: 'string',
        title: '版本号',
        'x-rules': [
          {
            required: true,
            message: '版本号不能为空',
          },
          {
            pattern: /^\d+\.\d+\.\d+$/,
            message: '请输入正确的格式',
          },
        ],
        'x-component-props': {
          placeholder: '请输入要发布的版本号',
          className: 'product-price__input-number--wrapper ant-form-explain__font-size',
        },
        description: '版本号格式：1.0.0',
      },
      editionSerialCode: {
        type: 'string',
        title: '版本序列号',
        // default: '20191216',
        'x-rules': [
          {
            required: true,
            message: '版本序列号不能为空',
          },
          {
            pattern: /^\d{8}$/,
            message: '请输入数字年月日',
          },
        ],
        'x-component-props': {
          placeholder: '请输入版本序列号',
          className: 'product-price__input-number--wrapper ant-form-explain__font-size',
        },
      },
      lowestEditionCode: {
        type: 'string',
        title: '更新最低版本号',
        default: '1.0.0',
        'x-component-props': {
          placeholder: '请输入最低更新版本号',
          className: 'product-price__input-number--wrapper ant-form-explain__font-size',
        },
        description: '低于此版本号的会受到更新推送，版本号格式：1.0.0',
        'x-rules': {
          pattern: /^\d+\.\d+\.\d+$/,
          message: '请输入正确的格式',
        },
      },
      effectiveTime: {
        type: 'date',
        title: '生效时间',
        'x-component-props': {
          placeholder: '请选择版本生效时间',
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          className: 'ant-form-explain__font-size',
        },
        description: '生效时间小于当前系统时间，系统会自动将生效时间设置为当前时间',
        'x-rules': [
          {
            required: true,
            message: '版本生效时间不能为空',
          },
        ],
      },
      updateContent: {
        type: 'textarea',
        title: '更新内容',
        'x-component-props': {
          placeholder: '请输入更新内容',
        },
        'x-rules': [
          {
            required: true,
            message: '更新内容不能为空',
          },
        ],
      },
    },
  });

  const handleOpenEdition = (initialValues: any = {}) => {
    const myDate = new Date();
    const months =
      Number(myDate.getMonth()) + 1 >= 10
        ? Number(myDate.getMonth()) + 1
        : `0${Number(myDate.getMonth()) + 1}`;
    const days = Number(myDate.getDate()) >= 10 ? myDate.getDate() : `0${myDate.getDate()}`;
    const initTime = `${myDate.getFullYear()}${months}${days}`;
    initialValues.editionSerialCode = initTime;
    openModalForm({
      initialValues,
      title: '添加版本',
    });
  };

  return {
    openForm: handleOpenEdition,
    ModalFormElement,
  };
};
