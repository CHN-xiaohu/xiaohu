import { useModalForm } from '@/components/Business/Formily';
import type { ISchemaFieldComponentProps } from '@formily/antd';
import { createAsyncFormActions } from '@formily/antd';
import { ButtonList } from '@/components/Library/ButtonList';

import { cancelStoreVip } from '../Api';

const formActions = createAsyncFormActions();

type Props = {
  handleCreateAdSuccess: () => void;
  storeId: string;
  vipName: string;
};

const StockRemarks = ({ value }: ISchemaFieldComponentProps) => {
  return <div>{value}</div>;
};

export const useCancelMemberForm = ({ storeId, vipName, handleCreateAdSuccess }: Props) => {
  const handleSubmit = (values: any) =>
    cancelStoreVip({ storeId, vipName, reason: values.reason }).then(handleCreateAdSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    onSubmit: handleSubmit,
    actions: formActions,
    components: {
      StockRemarks,
    },
    isNativeAntdStyle: true,
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
      reason: {
        title: '取消备注',
        type: 'textarea',
        'x-component-props': {
          placeholder: '请输入取消原因',
          row: 4,
          maxLength: 30,
        },
        'x-rules': [
          {
            required: true,
            message: '请输入取消原因, 上限30个字',
          },
          {
            range: [1, 30],
            message: '请输入取消原因, 上限30个字',
          },
        ],
      },
      remarks: {
        title: '注',
        type: 'string',
        'x-component': 'StockRemarks',
        default: '取消会员不涉及会员费退款，若需退款请线下自行处理',
        'x-rules': {
          required: true,
        },
      },
    },
  });

  const handleOpenForm = () => {
    openModalForm({
      title: '取消会员',
    });
  };
  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
