import { useModalForm } from '@/components/Business/Formily';
import { createAsyncFormActions } from '@formily/antd';
import { useMount, usePersistFn } from 'ahooks';
import { message } from 'antd';

import { getAListOfOfficialCodeBaseTemplates, submitReview } from '../../../Api';

const formActions = createAsyncFormActions();

export const useMallTemplateForm = (refresh: any) => {
  const handleSubmitReview = usePersistFn((values: any) =>
    submitReview({ id: values.storeVersion }).then((res) => {
      switch (res.data?.errCode) {
        case 0:
          message.success('上传成功');
          refresh();
          return null;
        case 201:
          message.warning('必须配置小程序的域名才能进行代码上传审核');
          return null;
        case 998:
          message.warning('您还存在处于审核中的模板，不允许再次提交');
          return null;
        case 999:
          message.error('上传失败');
          return null;
        case 9400001:
          message.warning(
            '该开发小程序已开通小程序直播权限，不支持发布版本。如需发版，请解绑开发小程序后再操作',
          );
          return null;
        default:
          return null;
      }
    }),
  );

  useMount(() => {
    getAListOfOfficialCodeBaseTemplates().then((res) => {
      formActions.setFieldState('storeVersion', (state) => {
        state.props.enum = res.data?.list?.map((template: any) => ({
          label: template.userDesc,
          value: template.id,
        }));
      });
    });
  });

  const { openModalForm, ModalFormElement } = useModalForm({
    isNativeAntdStyle: true,
    onSubmit: handleSubmitReview,
    title: '小程序版本',
    actions: formActions,
    schema: {
      storeVersion: {
        title: '商城模板',
        type: 'string',
        enum: [],
        'x-component-props': {
          placeholder: '请选择商城模板',
        },
        'x-rules': {
          required: true,
          message: '请选择商城模板',
        },
      },
    },
  });

  return {
    openForm: openModalForm,
    ModalFormElement,
  };
};
