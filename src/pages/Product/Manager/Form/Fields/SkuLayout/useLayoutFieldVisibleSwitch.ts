import { useEffect } from 'react';

import type { ISchemaFormAsyncActions } from '@formily/antd';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { specificationFormPath } from './schema';

type Props = {
  formActions: ISchemaFormAsyncActions;
  attributes: any[];
  realAttributes: any[];
  initialValues: AnyObject;
  isImportFromProduct?: boolean;
};

export const useLayoutFieldVisibleSwitch = ({
  formActions,
  attributes,
  realAttributes,
  initialValues,
  isImportFromProduct,
}: Props) => {
  const { reselectCategory } = useStoreState('product');

  useEffect(() => {
    formActions.setFieldState(specificationFormPath, (fieldState) => {
      let visible = Boolean(attributes.length || realAttributes.length);
      const isExtSkuItem = !!initialValues.products?.[0]?.salePropValIds.length;

      const defaultVisibleContion =
        reselectCategory === 0 && initialValues.id && !isExtSkuItem && !realAttributes.length;

      // 编辑时，以 initialValues.products?.[0]?.salePropValIds 为准
      // 如果是从采购商品导入的话，只需要判断是否存在 sku 项
      if (defaultVisibleContion || (isImportFromProduct && !isExtSkuItem)) {
        visible = false;
      }

      fieldState.visible = visible;
    });
  }, [attributes, realAttributes]);
};
