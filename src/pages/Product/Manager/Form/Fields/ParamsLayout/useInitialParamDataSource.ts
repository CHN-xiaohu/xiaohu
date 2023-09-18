import { useState } from 'react';
import { useDebounceEffect } from 'ahooks';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { useDebounceWatch } from '@/foundations/hooks';

import { resetFieldValueByFormGraph } from '@/components/Business/Formily';

import { paramsLayoutFieldFormPath } from './schema';

import type { UseResetSkuValuesProps } from '../SkuLayout';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Props extends Pick<UseResetSkuValuesProps, 'formActions' | 'modelNamespace'> {}

export const useInitialParamDataSource = ({ formActions, modelNamespace = 'product' }: Props) => {
  const [initialParamDataSourceMap, setParamDataSourceMap] = useState({});

  const { initialValues, reselectCategory } = useStoreState(modelNamespace as 'product');

  useDebounceWatch(() => {
    formActions.setFormState((formState: any) => {
      if (formState.values.skuFullLayout) {
        formState.values.skuFullLayout.paramsList = {};
      }
    });

    resetFieldValueByFormGraph({
      formActions,
      matchPath: paramsLayoutFieldFormPath,
    });
  }, [reselectCategory]);

  useDebounceEffect(
    () => {
      const temp = {};
      if (initialValues.paramPropKeyIds.length) {
        initialValues.paramPropKeyIds.forEach((id, index) => {
          temp[id] = {
            id: initialValues.paramValIds[index] || '',
            value: initialValues.paramVals[index] || '',
          };
        });
      }

      setParamDataSourceMap(temp);
    },
    [initialValues.paramPropKeyIds, initialValues.paramValIds, initialValues.paramVals],
    { wait: 60 },
  );

  return {
    initialParamDataSourceMap,
  };
};
