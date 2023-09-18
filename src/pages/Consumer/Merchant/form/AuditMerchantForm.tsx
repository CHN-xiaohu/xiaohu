import { useModalForm } from '@/components/Business/Formily';

import { auditStatus } from '../Constants';

import { updateAuditStatus } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

export const useAuditMerchantForm = ({ onAddSuccess }: Props) => {
  const handleSumbit = (values: any) =>
    updateAuditStatus({
      id: values.id,
      auditStatus: values.auditStatus,
      auditLog: values.auditLog || undefined,
    }).then(onAddSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSumbit,
    isNativeAntdStyle: true,
    schema: {
      auditStatus: {
        title: '审核状态',
        type: 'string',
        enum: auditStatus?.map((value, index) => ({ value: index, label: value })),
        'x-component-props': {
          placeholder: '请选择审核状态',
        },
        'x-rules': { required: true, message: '请选择审核状态' },
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === 2 }}',
            target: 'auditLog',
          },
        ],
      },
      auditLog: {
        title: '拒绝原因',
        type: 'string',
        display: false,
        'x-component-props': {
          placeholder: '审核不通过原因',
        },
        'x-rules': {
          required: true,
          range: [1, 20],
          message: '请输入拒绝原因, 上限 20 个字符',
        },
      },
    },
  });

  const handleOpenForm = (initialValues: any = {}) => {
    openModalForm({
      title: '商家审核',
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
