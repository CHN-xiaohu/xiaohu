import { useEffect } from 'react';
import type { IFormAsyncActions } from '@formily/antd';

export const useSyncSchemaValues = (
  formActions: IFormAsyncActions,
  initialValues: AnyObject,
  extraConventionalFields = [] as string[],
) => {
  useEffect(() => {
    if (!initialValues.name) {
      return;
    }

    [
      'name',
      'virtualUrl',
      'serial',
      'supplierId',
      'brandId',
      'storeId',
      ...extraConventionalFields,
    ].forEach((name) => {
      formActions.setFieldValue(`*.*.productInfoLayout.*.${name}`, initialValues[name]);
    });

    ['images', 'videoUrl'].forEach((name) => {
      formActions.setFieldValue(`*.*.productInfoLayout.${name}`, initialValues[name]);
    });
  }, [initialValues.name]);
};
