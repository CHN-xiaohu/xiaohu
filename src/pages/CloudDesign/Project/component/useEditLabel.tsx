import type { TSchema } from '@/components/Business/Formily';
import { useModalForm } from '@/components/Business/Formily';
import { useRef } from 'react';

import { createAsyncFormActions } from '@formily/antd';

import { settleTags } from '../Api';

type Props = {
  onAddSuccess: () => void;
  tags: any[];
  designId: string;
};

const formActions = createAsyncFormActions();

export const useEditLabel = ({ tags, designId, onAddSuccess }: Props) => {
  const tagsRef = useRef([] as any);
  tagsRef.current = tags;

  const designIdRef = useRef([] as any);
  designIdRef.current = designId;

  const handleSubmitLabel = (values: any) => {
    const radios = [] as any;
    let checkboxs = [] as any;
    const valuesList = Object.values(values).filter((items) => items !== undefined);
    valuesList?.forEach((items: any) => {
      if (typeof items === 'string') {
        radios.push(items);
        return;
      }
      checkboxs = [...items];
    });
    const lists = new Set([...radios, ...checkboxs]);
    const array = Array.from(lists);
    return settleTags({
      designId: designIdRef.current,
      tagIds: array,
    }).then(onAddSuccess);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmitLabel,
    actions: formActions,
  });

  const handleEditLabel = (initialValues: any = {}) => {
    const types = {
      false: 'radio',
      true: 'checkbox',
    };

    const schemas = (tagsRef.current as any[]).reduce((schema: any, current) => {
      schema[current.tagCategoryName] = {
        type: types[current.isMultipleSelected],
        title: current.tagCategoryName,
        'x-component-props': {
          disabled: current.isDisabled || current.type === 1,
          dataSource: current.tags?.map((item: any) => ({ label: item.name, value: item.id })),
        },
      } as TSchema;

      return schema;
    }, {});

    openModalForm({
      title: '方案标签',
      initialValues,
      isNativeAntdStyle: true,
      schema: schemas,
    });
  };

  return {
    openForm: handleEditLabel,
    ModalFormElement,
  };
};
