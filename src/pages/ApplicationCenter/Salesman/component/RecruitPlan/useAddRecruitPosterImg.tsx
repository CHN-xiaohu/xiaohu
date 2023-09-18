import { useRef } from 'react';
import { useModalForm } from '@/components/Business/Formily';
import { createAsyncFormActions } from '@formily/antd';

import { modelNamespace } from '../../Constants';

import { useFields } from '../useFields';

const formActions = createAsyncFormActions();

type Props = {
  posterList: any[];
};

export const useAddRecruitPoster = ({ posterList }: Props) => {
  const rePosterList = useRef([] as any);
  rePosterList.current = posterList;

  const promise = new Promise((resolve) => {
    resolve(undefined);
  });

  const handleSubmit = (values: any) => {
    return promise.then(() => {
      rePosterList.current.forEach((items: any) => {
        if (values.title === items.title) {
          items.backgroundImg = values.backgroundImg;
        }
      });
      return window.$fastDispatch((model) => model[modelNamespace].updateState, {
        posterList: rePosterList.current,
      });
    });
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmit,
    actions: formActions,
    fields: { ...useFields() },
    isNativeAntdStyle: true,
    schema: {
      backgroundImg: {
        type: 'uploadFile',
        title: '选择文件',
        description: '请参考该风格海报模板的设计要求，海报图片大小不能超过1M，建议尺寸：720*1280px',
        'x-rules': {
          required: true,
        },
        'x-component-props': {
          rule: {
            maxImageWidth: 720,
            maxImageHeight: 1280,
          },
        },
      },
      download: {
        title: '',
        type: 'downloadTemplate',
      },
    },
  });

  const handleOpenForm = (initialValues: any = {}) => {
    openModalForm({
      title: `自定义背景图（${initialValues?.title}）`,
      initialValues,
    });

    setTimeout(() => {
      formActions.setFieldValue('download', initialValues.title);
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
