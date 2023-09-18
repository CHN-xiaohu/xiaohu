import { useEffect } from 'react';
import type { TSchemas } from '@/components/Business/Formily';
import type { IFormAsyncActions } from '@formily/antd';
import {
  //
  useDetailLayoutBySchema as useDetailLayoutBySchemaOrg21312321312312,
} from '@/pages/Product/Manager/Form/Fields/DetailLayout';
import type { TModelNamespace } from '@/pages/Product/index.d';

export const useDetailLayoutBySchema = (
  formActions: IFormAsyncActions,
  modelNamespace: TModelNamespace,
): TSchemas => {
  const detailLayout = useDetailLayoutBySchemaOrg21312321312312(formActions, modelNamespace);

  useEffect(() => {
    formActions.setFieldState('*.*.detailLayout.introductions', (fieldState) => {
      fieldState.editable = false;
    });
  }, []);

  return detailLayout;
};
