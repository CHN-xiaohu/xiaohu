import { useModalForm } from '@/components/Business/Formily';
import { stringFilterOption } from '@/pages/Coupon/Util';
import { ButtonList } from '@/components/Library/ButtonList';
import type { ISchemaFieldComponentProps } from '@formily/antd';
import { createAsyncFormActions } from '@formily/antd';

import { setOrCancelRecommends } from '../Api';

type Props = {
  onAddSuccess: () => void;
  storeSelectOptions: any;
};

const formActions = createAsyncFormActions();

const StoreRemarks = ({ value }: ISchemaFieldComponentProps) => {
  return <div>{value}</div>;
};

export const useMerchantForm = ({ onAddSuccess, storeSelectOptions }: Props) => {
  const handleSubmitUpdate = (values: any) => {
    return setOrCancelRecommends(values).then(() => onAddSuccess());
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    onSubmit: handleSubmitUpdate,
    isNativeAntdStyle: true,
    components: {
      StoreRemarks,
    },
    footer: ({ onCancel, onOk }) => (
      <ButtonList
        align="center"
        list={[
          {
            text: '取消',
            onClick: onCancel,
          },

          {
            text: '确定',
            type: 'primary',
            onClick: onOk,
          },
        ]}
      />
    ),
    schema: {
      storeId: {
        title: '关联商家',
        type: 'string',
        enum: [],
        'x-component-props': {
          placeholder: '请选择商家',
          showSearch: true,
          filterOption: stringFilterOption,
        },
        'x-rules': [
          {
            required: true,
            message: '请选择商家',
          },
        ],
      },
      remarks: {
        title: '注',
        type: 'string',
        'x-component': 'StoreRemarks',
        default: '小程序展示方案，用户选中方案，默认下单给关联商家',
        'x-rules': {
          required: true,
        },
      },
    },
  });

  const handleOpenSelectedForm = (initialValues: AnyObject = { designIds: [], recommend: 1 }) => {
    openModalForm({
      title: '关联商家',
      initialValues: { ...initialValues },
    });

    setTimeout(() => {
      formActions.setFieldState('storeId', (state) => {
        state.props.enum = storeSelectOptions;
      });
    });
  };

  return {
    openForm: handleOpenSelectedForm,
    ModalFormElement,
  };
};
