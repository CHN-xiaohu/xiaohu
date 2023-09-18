import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { Image } from '@/components/Business/Table/Image';

import { useState, useEffect } from 'react';

import { Modal } from 'antd';

import { loopModelCategories } from './Utils';

import type { ModelColumns } from '../Api';
import { searchProductModels, addBindRelated, getModelBrands, getModelCategories } from '../Api';

export const stringFilterOption = (input: string, option: { props: { children: string } }) =>
  option.props.children.indexOf(input) > -1;

export function ModelRelated({
  productType,
  selectProducts,
  modalOnCancel,
  ...modelRelatedObj
}: any) {
  const [brands, setBrands] = useState([] as any);
  const [productRecord, setProductRecord] = useState({} as any);
  const [isOpenRelated, setOpenRelated] = useState(false);
  const [categories, setCategories] = useState([] as any);

  const { actionsRef } = useGeneralTableActions<ModelColumns>();

  useEffect(() => {
    getModelBrands().then((res: any) => {
      const brandList = res.data.map((item: any) => ({
        value: item.brand.brandId,
        label: item.brand.name,
      }));
      setBrands(brandList);
    });
    getModelCategories().then((categoryRes) => {
      setCategories(loopModelCategories(categoryRes?.data?.model));
    });
  }, []);

  const handleSetProducts = (values: any) => {
    setProductRecord(values);
    setOpenRelated(true);
  };

  const relatedObj = {
    title: '提示',
    visible: isOpenRelated,
    width: 300,
    onCancel() {
      setOpenRelated(false);
    },
    onOk() {
      const params = {
        productIds: selectProducts,
        productType,
        commodifyId: productRecord?.id,
        commodifyName: productRecord?.name,
      };
      addBindRelated(params).then(() => {
        setOpenRelated(false);
        modalOnCancel();
        actionsRef.current.reload();
      });
    },
  };

  return (
    <>
      <Modal {...relatedObj}>确定选择该商品关联？</Modal>
      <Modal {...modelRelatedObj}>
        <GeneralTableLayout<ModelColumns>
          request={(params = {} as AnyObject) =>
            searchProductModels({
              ...params,
              productType,
              productIds: selectProducts.join(','),
            }) as any
          }
          getActions={actionsRef}
          searchProps={{
            items: [
              {
                q: {
                  title: '模糊查询',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '模型名称',
                  },
                },
                catId: {
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
                brandIds: {
                  title: '商品品牌',
                  type: 'string',
                  'x-component-props': {
                    dataSource: brands || [],
                    showSearch: true,
                    filterOption: stringFilterOption,
                    placeholder: '请选择商品品牌',
                  },
                },
              },
            ],
          }}
          operationButtonListProps={false}
          columns={[
            {
              title: '模型图',
              dataIndex: 'imgUrl',
              render: (src: string) => <Image src={src} />,
            },
            {
              title: '模型名称',
              dataIndex: 'brandName',
              render: (data: any, records: any) => (
                <span>
                  {data} {records.name}
                </span>
              ),
            },
            {
              title: '操作',
              dataIndex: 'id',
              buttonListProps: {
                list: ({ row }: any) => [
                  row?.bindProductId !== '0'
                    ? {
                        text: '已关联商品',
                        disabled: true,
                        onClick: () => {
                          handleSetProducts(row);
                        },
                      }
                    : {
                        text: '选择',
                        onClick: () => {
                          handleSetProducts(row);
                        },
                      },
                ],
              },
            },
          ]}
        />
      </Modal>
    </>
  );
}
