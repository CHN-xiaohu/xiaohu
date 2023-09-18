import {
  GeneralTableLayout,
  useGeneralTableActions,
  convenientDateRangeSchema,
} from '@/components/Business/Table';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { memo, useCallback } from 'react';

import { history } from 'umi';

import { getShareProducts } from '../Api/share';

import { showPriceOrBetween } from '../Manager/Common';

type Props = {
  // 审核状态 ：-1：未提交过审核；0：待审核（审核中）；1审核通过；2审核不通过
  auditStatus?: number;
  brands: {
    value: string;
    label: string;
  }[];
};

export const Share = memo(({ auditStatus = 0, brands }: Props) => {
  const { categories } = useStoreState('productCategory');
  const { actionsRef } = useGeneralTableActions();

  const goToViewPage = (id: string) => {
    history.push(`/shareMarketing/productDetail/${id}`);
  };

  const handleSelectChange = useCallback((_pagination: any, _filters: any, sorter: any) => {
    let searchFormData = {
      sortFields: '',
    } as AnyObject;

    if (sorter.order && sorter.columnKey) {
      searchFormData = {
        sortFields: sorter.order === 'descend' ? 'createTime,DESC' : 'createTime,ASC',
      };
    }

    actionsRef.current.reload({
      temporarySearchFormData: {
        current: _pagination.current,
      },
      searchFormData,
    });
  }, []);

  return (
    <GeneralTableLayout
      {...{
        request: (params) =>
          getShareProducts({
            sortFields: auditStatus === 0 ? 'createTime,ASC' : 'createTime,DESC',
            ...params,
            status: auditStatus,
          }),
        getActions: actionsRef,
        searchProps: {
          minItem: 3,
          items: [
            {
              productInfoName: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '商品名称',
                },
              },
              categoryId: {
                title: '商品类目',
                type: 'treeSelect',
                'x-component-props': {
                  placeholder: '请选择商品类目',
                  treeData: categories,
                  showSearch: true,
                  treeNodeFilterProp: 'title',
                  allowClear: true,
                },
              },
            },
            {
              brandId: {
                title: '商品品牌',
                type: 'string',
                'x-component-props': {
                  dataSource: brands,
                  placeholder: '请选择商品品牌',
                },
              },
              '[startDate,endDate]': convenientDateRangeSchema({ title: '申请时间' }),
            },
          ],
        },
        operationButtonListProps: false,
        columns: [
          {
            title: '首图',
            width: 72,
            dataIndex: 'image',
            image: true,
          },
          {
            title: '商品名称',
            dataIndex: 'productInfoName',
            ellipsisProps: true,
          },
          {
            title: '类目',
            dataIndex: 'categoryNamePath',
            ellipsisProps: true,
          },
          {
            title: '供货价',
            dataIndex: 'minSalePrice',
            render: (_, item) => showPriceOrBetween(item.minSupplyPrice, item.maxSupplyPrice),
          },
          {
            title: '建议零售价',
            dataIndex: 'minSalePrice',
            render: (_, item) =>
              showPriceOrBetween(item.minSuggestSalePrice, item.maxSuggestSalePrice),
          },
          {
            title: '所属供应商',
            dataIndex: 'supplyName',
          },
          {
            title: '申请时间',
            dataIndex: 'createTime',
            width: 184,
            sorter: true,
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 110,
            buttonListProps: {
              list: ({ row }) => [{ text: '查看', onClick: () => goToViewPage(row.id) }],
            },
          },
        ],
        tableProps: {
          onChange: handleSelectChange,
        },
      }}
    />
  );
});
