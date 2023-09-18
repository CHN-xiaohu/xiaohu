import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { createAccountProduct } from '../Api';

const formActions = createAsyncFormActions();

type Props = {
  onAddSuccess: () => void;
  downServices: any[];
  id: string;
};

export const ServiceForm = ({ onAddSuccess, downServices, id }: Props) => {
  const handleCreateService = (values: any) => {
    const [defProductId, defProductPriceId] = values.services;
    const param = {
      defProductId,
      defProductPriceId,
      identityId: values.identityId,
    };
    return createAccountProduct(param).then(onAddSuccess);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateService,
    onUpdate: handleCreateService,
    actions: formActions,
    schema: {
      services: {
        type: 'cascader',
        'x-component-props': {
          options: [],
          fieldNames: { label: 'title', value: 'id', children: 'defProductPriceDTOS' },
        },
      },
    },
  });

  const handleOpenService = (
    initialValues = {
      identityId: id,
    } as any,
  ) => {
    setTimeout(() => {
      formActions.setFieldState('services', (fieldState) => {
        fieldState.props['x-component-props']!.options = [...downServices];
      });
    });

    openModalForm({
      title: '开通、编辑服务',
      initialValues,
    });
  };
  return {
    openForm: handleOpenService,
    ModalFormElement,
  };
};
