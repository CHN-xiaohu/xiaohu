import { useMemo } from 'react';
import { createAsyncFormActions } from '@formily/antd';

import { useDebounceEffect, usePersistFn } from 'ahooks';

import type { SchemaFormProps } from '@app_components/Business/Formily/SchemaForm';
import { SchemaForm } from '@app_components/Business/Formily/SchemaForm';
import { useSetBreadcrumbTextToCreateOrUpdate } from '@/foundations/hooks';
import { isObj } from '@/utils';

export type NormalFormProps<V = any, S = Record<string, any>> = {
  primaryKey?: string;
  breadcrumbText?: string;
  onCreate?: (values: V) => Promise<any> | any;
  onUpdate?: (values: V) => Promise<any> | any;
  onSubmit?: (values: V) => Promise<any> | any;
} & SchemaFormProps<S>;

export const NormalForm = <V extends any>(props: NormalFormProps<V>) => {
  const {
    primaryKey = 'id',
    onUpdate,
    breadcrumbText,
    initialValues,
    onCreate,
    actions,
    onSubmit = () => Promise.resolve(),
    ...last
  } = props;

  const realFormActions = useMemo(() => actions || createAsyncFormActions(), [actions]);

  useSetBreadcrumbTextToCreateOrUpdate(breadcrumbText);

  const handleInitialValues = (initValue: AnyObject) => {
    for (const [k, v] of Object.entries(initValue)) {
      (realFormActions || props.actions).setFieldValue(k, v);
    }
  };

  useDebounceEffect(
    () => {
      if (isObj(initialValues)) {
        handleInitialValues(initialValues);
      }
    },
    [initialValues],
    { wait: 300 },
  );

  const handleSubmit = usePersistFn(
    initialValues?.[primaryKey] && onUpdate ? onUpdate : onCreate || onSubmit,
  );

  return (
    <SchemaForm
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 18 }}
      className="baseForm"
      actions={realFormActions}
      {...last}
      onSubmit={handleSubmit}
    />
  );
};
