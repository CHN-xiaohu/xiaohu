import type { TSchema } from '@/components/Business/Formily';
import { useModalForm } from '@/components/Business/Formily';
import { useRef } from 'react';
import { message } from 'antd';

import { createAsyncFormActions } from '@formily/antd';

type Props = {
  tags: any[];
};

const formActions = createAsyncFormActions();

export const useLabelForm = ({ tags }: Props) => {
  const tagsRef = useRef([] as any);
  tagsRef.current = tags;
  const chooseTagValue = useRef([] as any);

  const promise = new Promise<void | void>((resolve) => {
    resolve();
  });

  const handleSubmitLabel = (values: any) => {
    const radios = [] as any;
    const valuesList = Object.values(values).filter((items) => items !== undefined);

    if (valuesList?.length < 1) {
      message.warning('至少选一个！');
    } else {
      return promise.then(() => {
        valuesList?.forEach((items: any) => {
          if (typeof items === 'string') {
            radios.push(items);
          }
        });
        const listLabel = [] as any;
        let listLabelObj = {} as any;
        const lists = new Set([...radios]);
        const array = Array.from(lists);
        tagsRef.current?.forEach((items: any) => {
          items.tags?.forEach((iii: any) => {
            if (array.includes(iii.id)) {
              listLabelObj = {
                name: iii.name,
                id: iii.id,
              };
              listLabel.push(listLabelObj);
            }
          });
        });

        const tagsValue = [
          {
            name: listLabel.map((item: { name: any }) => item.name)?.join(','),
            id: listLabel.map((item: { id: any }) => item.id)?.join(','),
          },
        ];
        chooseTagValue.current = tagsValue;
      });
    }
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmitLabel,
    isOnReset: true,
    actions: formActions,
  });

  const handleEditLabel = (initialValues: any = {}) => {
    const schemas = (tagsRef.current as any[]).reduce((schema: any, current) => {
      schema[current.tagCategoryName] = {
        type: 'radio',
        title: current.tagCategoryName,
        'x-component-props': {
          // disabled: current.isDisabled || current.type === 1,
          dataSource: current.tags?.map((item: any) => ({ label: item.name, value: item.id })),
        },
        // 'x-rules': {
        //   required: true,
        //   message: '请选择标签',
        // },
      } as TSchema;

      return schema;
    }, {});

    openModalForm({
      title: '选择方案标签',
      initialValues,
      isNativeAntdStyle: true,
      schema: schemas,
    });
  };

  return {
    openForm: handleEditLabel,
    ModalFormElement,
    chooseTagValue: chooseTagValue.current,
  };
};
