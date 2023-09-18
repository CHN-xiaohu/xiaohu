import { useModalForm } from '@/components/Business/Formily';
import { download } from '@/utils';
import { createAsyncFormActions } from '@formily/antd';
import { useMemo, useRef } from 'react';

import type { getPosterList } from '.';

const formActions = createAsyncFormActions();

type Poster = ReturnType<typeof getPosterList>[0];

type Props = {
  onSuccess: (v: Poster) => Promise<any>;
};

export const useCustomizeBackgroundImgForm = ({ onSuccess }: Props) => {
  const initialValuesRef = useRef({} as Poster);

  const description = useMemo(
    () => (
      <span>
        <p>请参考该风格海报模板的设计要求，海报图片大小不能超过1M，建议尺寸：750*1334px</p>
        <a
          onClick={() => {
            download(
              initialValuesRef.current.defaultBackgroundImg ||
                initialValuesRef.current.backgroundImg,
              initialValuesRef.current.title,
            );
          }}
        >
          下载模板
        </a>
      </span>
    ),
    [],
  );

  const { openModalForm, ModalFormElement } = useModalForm({
    onSubmit: onSuccess,
    actions: formActions,
    isNativeAntdStyle: true,
    schema: {
      backgroundImg: {
        type: 'uploadFile',
        title: '选择文件',
        'x-rules': {
          required: true,
          message: description,
        },
        description,
        'x-component-props': {
          rule: {
            maxImageWidth: 750,
            maxImageHeight: 1334,
          },
        },
      },
    },
  });

  const handleOpenForm = (initialValues = {} as typeof initialValuesRef.current) => {
    initialValuesRef.current = initialValues;

    openModalForm({
      title: `自定义背景图（${initialValues?.title}）`,
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
