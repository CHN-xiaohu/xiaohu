import { useModalForm } from '@/components/Business/Formily';
import { UserInfoCache } from '@/services/User';

import { createAsyncFormActions } from '@formily/antd';

import { createOrUpdateDomainName } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const useDomainNameForm = ({ onAddSuccess }: Props) => {
  const handleSave = async (values: AnyObject) => {
    createOrUpdateDomainName({
      id: values.id,
      domainUrl: values.domainUrl,
      port: values.port,
      type: 1,
      isHttps: values.isHttps ? 1 : 0,
      privateKey: values.privateKey,
      publicKey: values.publicKey,
      tenantCode: UserInfoCache.get().tenantCode,
    }).then(onAddSuccess);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    onSubmit: handleSave,
    isNativeAntdStyle: true,
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
      isHttps: {
        title: 'Https协议',
        type: 'boolean',
        default: false,
        'x-props': {
          checkedChildren: '开',
          unCheckedChildren: '关',
        },
        'x-linkages': [
          {
            type: 'value:visible',
            condition: '{{ !!$self.value }}',
            target: '*(publicKey,privateKey)',
          },
        ],
      },
      domainUrl: {
        title: '域名地址',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入自定域名域名',
        },
        'x-rules': [
          {
            required: true,
            message: '请输入自定域名域名',
          },
          {
            pattern:
              /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
            message: '域名格式不合法',
          },
        ],
      },
      publicKey: {
        title: '证书内容',
        type: 'textarea',
        visible: false,
        'x-component-props': {
          placeholder: '请将证书内容（包含证书链）复制粘贴到此处',
        },
        'x-rules': {
          required: true,
          message: '将证书内容（包含证书链）复制粘贴到此处',
        },
      },
      privateKey: {
        title: '证书私钥',
        type: 'textarea',
        visible: false,
        'x-component-props': {
          placeholder: '请将证书私钥复制粘贴到此处',
        },
        'x-rules': {
          required: true,
          message: '请将证书私钥复制粘贴到此处',
        },
      },
    },
  });

  const handleOpenEditorForm = (initialValues: AnyObject = {}) => {
    formActions.setFieldState('*(publicKey,privateKey)', (fieldState) => {
      fieldState.visible = !!initialValues.isHttps;
    });

    openModalForm({
      title: `${initialValues.id ? '编辑' : '新增'}域名`,
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenEditorForm,
    ModalFormElement,
  };
};
