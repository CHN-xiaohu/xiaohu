import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useState } from 'react';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { RelatedModel } from '../component/RelatedModel';

import type { ModelColumns } from '../Api';
import { getAdminPage, getPurchaseProducts, getSupplyProducts } from '../Api';

export function ModelList({ productType }: any) {
  const { categories } = useStoreState('productCategory');
  const [isOpenRelated, setOpenRelated] = useState(false);
  const [productInfoId, setProductInfoId] = useState('');

  const relatedObj = {
    title: '关联商品模型',
    visible: isOpenRelated,
    width: 900,
    productType,
    productInfoId,
    footer: null,
    onCancel() {
      setOpenRelated(false);
    },
  };

  const handleRequestUrl = (params: any) => {
    if (productType === '2') {
      return getSupplyProducts({ ...params, sharePool: 1 });
    }
    if (productType === '1') {
      return getAdminPage({ ...params, miniProductState: params.productState });
    }
    return getPurchaseProducts({ ...params });
  };

  const handleOpenRelated = (id: string) => {
    setOpenRelated(true);
    setProductInfoId(id);
  };

  return (
    <>
      {isOpenRelated && <RelatedModel {...relatedObj} />}
      <GeneralTableLayout<ModelColumns>
        request={(params) => handleRequestUrl(params) as any}
        searchProps={{
          minItem: 3,
          items: [
            {
              name: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '商品名称',
                },
              },
              '[startDate,endDate]': convenientDateRangeSchema({ title: '添加时间' }),
            },
            {
              categoryId: {
                title: '商品类目',
                type: 'treeSelect',
                col: 8,
                'x-component-props': {
                  placeholder: '请选择商品类目',
                  treeData: categories,
                  showSearch: true,
                  treeNodeFilterProp: 'title',
                  allowClear: true,
                },
              },
              productState: {
                title: '商品状态',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions([
                    { label: '已上架', value: 1 },
                    { label: '未上架', value: 2 },
                  ]),
                },
              },
              bind: {
                title: '关联模型',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions([
                    { label: '未关联', value: 0 },
                    { label: '已关联', value: 1 },
                  ]),
                },
              },
            },
          ],
        }}
        operationButtonListProps={false}
        columns={[
          {
            title: '商品首图',
            dataIndex: 'image',
            image: true,
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            ellipsisProps: true,
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }: any) => [
                {
                  text: '关联模型',
                  onClick: () => {
                    handleOpenRelated(row.id);
                  },
                },
              ],
            },
          },
        ]}
      />
    </>
  );
}
