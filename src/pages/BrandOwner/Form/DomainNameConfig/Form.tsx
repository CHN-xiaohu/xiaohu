import { useCallback } from 'react';
import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { history } from 'umi';

import { updatePcDomainName } from '../../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

const { tenantCode } = history.location.query;

const domainNameSuffix = `.mall${
  process.env.APP_NODE_ENV === 'production' ? '' : '-dev'
}.zazfix.com`;

export const useDomainNameForm = ({ onAddSuccess }: Props) => {
  const handleSave = useCallback(
    (values) =>
      updatePcDomainName({
        tenantCode,
        id: values.id,
        domainUrl: `${values.domainUrl}${domainNameSuffix}`,
        port: values.port,
      }).then(onAddSuccess),
    [],
  );

  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    onSubmit: handleSave,
    className: 'common-ant-modal',
    schema: {
      port: {
        title: '端口',
        type: 'string',
        default: 0,
        enum: [
          { value: 0, label: 'pc商城' },
          // { value: 1, label: '设计平台' },
        ],
        'x-component-props': {
          placeholder: '请选择端口',
        },
        'x-rules': {
          required: true,
          message: '请选择端口',
        },
      },
      domainUrl: {
        title: '域名地址',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入域名前缀',
          addonAfter: domainNameSuffix,
        },
        'x-rules': [
          {
            required: true,
            message: '请输入域名前缀',
          },
        ],
      },
    },
  });

  const handleOpenEditorForm = (initialValues: AnyObject = {}) => {
    const domainUrl =
      initialValues.domainUrl && (initialValues.domainUrl as string).replace(domainNameSuffix, '');

    openModalForm({
      title: `${initialValues.id ? '编辑' : '新增'}域名`,
      initialValues: { ...initialValues, domainUrl },
    });
  };

  return {
    openForm: handleOpenEditorForm,
    ModalFormElement,
  };
};
