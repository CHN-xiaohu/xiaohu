import { useMemo } from 'react';
import { Typography } from 'antd';
import type { ISchemaFormAsyncActions } from '@formily/antd';

import type { TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { formatTabelDataSourceToDescarteData } from '@/pages/Product/Manager/Form/Utils/Specification';

import {
  useHandleAttributeFormField,
  useResetSkuValues,
  useFormatTableDataSourceToDescarteData,
} from '@/pages/Product/Manager/Form/Fields/SkuLayout';

import { useLayoutFieldVisibleSwitch } from '@/pages/Product/Manager/Form/Fields/SkuLayout/useLayoutFieldVisibleSwitch';

import { expandColumnsFieldMap, generateColumnToFormField } from '../../Utils/TableColumns';
import { modelNamespace } from '../..';

export type ISpecificationOption = {
  label: string;
  value: string;
  parent_id: string;
  parent_name: string;
};

export const useSkuLayoutBySchema = (formActions: ISchemaFormAsyncActions): TSchemas => {
  const { attributes, initialValues } = useStoreState(modelNamespace);

  // 根据接口返回的数据来还原被选中的规格属性值
  const { setDefaultCheckAttributes, realAttributes } = useHandleAttributeFormField({
    formActions,
    modelNamespace,
  });

  // 重置 sku table 相关处理
  const formatTabelDataSourceToDescarteDataOnce = useResetSkuValues({
    formActions,
    modelNamespace,
    setDefaultCheckAttributes,
  });

  // 将后端返回的 sku 数据转化为笛卡尔积的相关处理
  useFormatTableDataSourceToDescarteData({
    formActions,
    modelNamespace,
    onceRef: formatTabelDataSourceToDescarteDataOnce,
    setDefaultCheckAttributes,
    formatTabelDataSourceToDescarteDataFC: (products, specificationKeyValuePairs) =>
      formatTabelDataSourceToDescarteData(
        products,
        specificationKeyValuePairs,
        generateColumnToFormField as any,
      ),
  });

  useLayoutFieldVisibleSwitch({
    formActions,
    attributes,
    realAttributes,
    initialValues,
  });

  return useMemo(() => {
    return {
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        title: (
          <div>
            商品属性
            <Typography.Text type="secondary" style={{ marginLeft: 6 }}>
              错误填写宝贝属性，可能会引起宝贝下架或搜索流量减少，影响您的正常销售，请认真准确填写！
            </Typography.Text>
          </div>
        ),
        type: 'inner',
      },
      properties: {
        specificationAttributes: {
          type: 'array',
          'x-component': 'specificationGroups',
          'x-component-props': {
            dataSource: [],
          },
        },

        specificationTable: {
          type: 'array',
          'x-component': 'specificationTable',
          editable: true,
          'x-component-props': {
            initialValue: [],
          },
          items: {
            type: 'object',
            properties: expandColumnsFieldMap(),
          },
        },
      },
    } as TSchemas;
  }, []);
};
