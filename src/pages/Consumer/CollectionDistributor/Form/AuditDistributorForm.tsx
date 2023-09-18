import { useModalForm } from '@/components/Business/Formily';

import { auditStatus } from '../Constants';

import { setBatchAuditDistributor } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

export const useAuditDistributorForm = ({ onAddSuccess }: Props) => {
  const { openModalForm, ModalFormElement } = useModalForm({
    onSubmit: (values) => setBatchAuditDistributor(values as any).then(onAddSuccess),
    isNativeAntdStyle: true,
    schema: {
      auditStatus: {
        title: '审核状态',
        type: 'string',
        enum: auditStatus?.map((status, index) => ({ value: index + 1, label: status })),
        'x-component-props': {
          placeholder: '请选择审核状态',
        },
        'x-rules': { required: true, message: '请选择审核状态' },
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === 2 }}',
            target: 'refuseReason',
          },
        ],
      },
      refuseReason: {
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
      title: '分销商审核',
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
