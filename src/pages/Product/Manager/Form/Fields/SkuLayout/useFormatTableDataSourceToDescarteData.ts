import { useDebounceEffect } from 'ahooks';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useUnmount } from 'ahooks';

import {
  setSpecificationTable,
  clearSkuTableAllCache,
  dispatchSKUTableDataSourceChange,
} from './effects';

import type { UseResetSkuValuesProps } from './useResetSkuValues';

import { skuCacheManage, formatTabelDataSourceToDescarteData } from '../../Utils/Specification';

type Props = {
  onceRef: React.MutableRefObject<boolean>;
  formatTabelDataSourceToDescarteDataFC?: typeof formatTabelDataSourceToDescarteData;
} & Pick<UseResetSkuValuesProps, 'formActions' | 'setDefaultCheckAttributes' | 'modelNamespace'>;

const cacheInitialSpecificationMap = new Map<string, any>();

export const useFormatTableDataSourceToDescarteData = ({
  formActions,
  onceRef,
  modelNamespace = 'product',
  setDefaultCheckAttributes,
  formatTabelDataSourceToDescarteDataFC = formatTabelDataSourceToDescarteData,
}: Props) => {
  const { currentStep, initialValues } = useStoreState(modelNamespace as 'product');

  useUnmount(() => {
    clearSkuTableAllCache();

    cacheInitialSpecificationMap.clear();
  });

  useDebounceEffect(
    () => {
      // 减少不必要的数据处理，减少渲染压力
      if (onceRef.current) {
        return;
      }

      if (currentStep !== 2) {
        return;
      }

      if (!initialValues.products?.[0]?.salePropValIds.length) {
        onceRef.current = true;
        dispatchSKUTableDataSourceChange(formActions.dispatch, []);

        return;
      }

      // 初次计算完成
      onceRef.current = true;

      const specificationKeyValuePairs = {};
      initialValues.salePropKeyIds.forEach((id, index) => {
        specificationKeyValuePairs[id] = initialValues.salePropKeyNames[index];
      });

      const { dataSource, columns } = formatTabelDataSourceToDescarteDataFC(
        initialValues.products,
        specificationKeyValuePairs,
      );

      initialValues.products.map((item) =>
        cacheInitialSpecificationMap.set(item.salePropValIds.join(''), item),
      );

      setSpecificationTable({
        columns,
        dataSource,
        setFieldState: formActions.setFieldState,
        isInit: true,
      });

      dispatchSKUTableDataSourceChange(formActions.dispatch, dataSource);

      setDefaultCheckAttributes((draft) => {
        for (const [
          idVal,
          childbeds,
        ] of skuCacheManage.cacheCheckAttributesByIdResultMap.entries()) {
          draft.defaultCheckAttributes[idVal] = childbeds.map((item) => item.value);
        }
      });
    },
    [currentStep, initialValues.products],
    { wait: 16 },
  );
};
