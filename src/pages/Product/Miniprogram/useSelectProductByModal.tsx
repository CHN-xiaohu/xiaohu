import { useCallback } from 'react';

import { GeneralTableLayout } from '@/components/Business/Table';

import { useModal } from '@/foundations/hooks';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import type { ProductColumns } from '../Api';
import { getSelectMiniprogramProducts } from '../Api';
import { getProducts } from '../Api';

type Props = {
  title?: string;
  onSubmit: (row: ProductColumns) => Promise<any>;
  isMiniProgram?: boolean;
  getProductsDefaultParams?: AnyObject;
};

export const useSelectProductByModal = ({
  title = '同步采购商品至小程序',
  getProductsDefaultParams = { mini: 0, productState: 1 },
  isMiniProgram = false,
  onSubmit,
}: Props) => {
  const { categories } = useStoreState('productCategory');

  const {
    openModal,
    closeModal,
    modalElement: SelectProductElement,
  } = useModal({
    title,
    bodyStyle: {
      height: '75vh',
    },
    footer: false,
  });

  const openSelectProduct = useCallback(
    () =>
      openModal({
        children: (
          <GeneralTableLayout<ProductColumns>
            useTableOptions={{
              cacheKey: undefined,
            }}
            request={(params) =>
              isMiniProgram
                ? getSelectMiniprogramProducts({ ...params, ...getProductsDefaultParams })
                : getProducts({ ...params, ...getProductsDefaultParams })
            }
            searchProps={{
              items: [
                {
                  name: {
                    title: '商品名称',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '商品名称',
                    },
                  },
                  categoryId: {
                    title: '商品类目',
                    type: 'treeSelect',
                    col: 8,
                    'x-component-props': {
                      placeholder: '请选择商品类目',
                      treeData: categories,
                      // treeDefaultExpandAll: true,
                      showSearch: true,
                      treeNodeFilterProp: 'title',
                      allowClear: true,
                    },
                  },
                },
              ],
            }}
            operationButtonListProps={false}
            toolBarProps={false}
            columns={[
              {
                title: '首图',
                width: 72,
                dataIndex: 'image',
                image: true,
              },
              {
                title: '商品名称',
                dataIndex: 'name',
                ellipsisProps: true,
              },
              {
                title: '类目',
                dataIndex: 'categoryNamePath',
                ellipsisProps: true,
              },
              {
                title: '操作',
                width: 100,
                buttonListProps: {
                  list: ({ row }) => [
                    { text: '选择', onClick: () => onSubmit(row).then(() => closeModal()) },
                  ],
                },
              },
            ]}
          />
        ),
      }),
    [categories, closeModal],
  );

  return {
    openSelectProduct,
    closeSelectProduct: closeModal,
    SelectProductElement,
  };
};
