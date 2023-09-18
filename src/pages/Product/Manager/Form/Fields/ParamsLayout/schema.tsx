import { useCallback, useMemo, useEffect } from 'react';
import { Typography } from 'antd';
import type { TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import type { IFormAsyncActions } from '@formily/antd';

import { useInitialParamDataSource } from './useInitialParamDataSource';

import { handleFormatDefaultValue } from '../../components/FormFields/ParamsList/help';

const { Text } = Typography;

export const paramsLayoutFieldFormPath = 'formLayout.skuFullLayout.paramsLayout.paramsList';

export const useParamsLayoutBySchema = (
  formActions: IFormAsyncActions,
  isImportFromProduct: boolean,
): TSchemas => {
  const { params } = useStoreState('product');

  const { initialParamDataSourceMap } = useInitialParamDataSource({ formActions });

  const switchLayoutVisible = useCallback((visible: boolean) => {
    formActions.setFieldState('formLayout.skuFullLayout.paramsLayout', (fState) => {
      fState.visible = visible;
    });
  }, []);

  useEffect(() => {
    if (params.length) {
      let dataSource = params;

      if (isImportFromProduct) {
        // 在导入的时候，不显示没有默认值的参数项
        dataSource = Object.keys(initialParamDataSourceMap).length
          ? params.filter(
              (item) => !!handleFormatDefaultValue(initialParamDataSourceMap[item.id] || {}),
            )
          : [];
      }

      switchLayoutVisible(!!dataSource.length);

      formActions.setFieldState(paramsLayoutFieldFormPath, (fieldState) => {
        fieldState.props!['x-component-props']!.dataSource = dataSource;
        fieldState.props![
          'x-component-props'
        ]!.initialParamDataSourceMap = initialParamDataSourceMap;
      });
    } else {
      switchLayoutVisible(false);
    }
  }, [params, initialParamDataSourceMap]);

  return useMemo(() => {
    return {
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        title: (
          <div>
            商品参数
            <Text type="secondary" style={{ marginLeft: 6 }}>
              错误填写宝贝属性，可能会引起宝贝下架或搜索流量减少，影响您的正常销售，请认真准确填写！
            </Text>
          </div>
        ),
        type: 'inner',
        id: 'product-params-layout__form',
      },
      properties: {
        paramsList: {
          'x-component': 'paramsList',
          'x-props': {
            itemClassName: 'full-width__form-item-control',
          },
          'x-component-props': {
            dataSource: [],
          },
        },
      },
    };
  }, []);
};
