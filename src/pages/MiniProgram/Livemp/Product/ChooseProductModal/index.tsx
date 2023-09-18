import { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { useGeneralTableActions, GeneralTableLayout } from '@/components/Business/Table';

import { useWatch } from '@/foundations/hooks';

import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

import type { MiniprogramProductColumns } from '@/pages/Product/Api';

import { isEmpty } from '@spark-build/web-utils';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import type { StoreUserColumns } from '@/pages/Consumer/Supplier/Api';

import { SelectByLoadMore } from '@/components/Library/Select';

import { getMerchantList } from '@/pages/Consumer/Merchant/Api';

import { useLiveGoodModalForm } from './Form';

import { getLiveStreamPage } from '../../api';
import { priceTypeInvertMap } from '../../constants';

type Props = {
  onSuccess: () => void;
};

export const ChooseProduct = ({ children, onSuccess }: React.PropsWithChildren<Props>) => {
  const [visible, setVisible] = useState(false);
  const { actionsRef } = useGeneralTableActions<MiniprogramProductColumns>();
  const selectedRowKeyRef = useRef('');
  const { categories } = useStoreState('productCategory');

  const handleCancel = () => {
    setVisible(false);
  };

  const { openLiveProductForm, ModalFormElement } = useLiveGoodModalForm(() => {
    onSuccess();
    handleCancel();
  });

  useWatch(() => {
    if (visible) {
      actionsRef.current.reload?.();
    }
  }, [visible]);

  const handleOk = () => {
    const current = actionsRef.current.dataSource.find(
      (item) => item.id === selectedRowKeyRef.current,
    );

    if (!current) {
      message.error('查找不到选择的商品数据');

      return;
    }

    const isOnePrice = current.minSalePrice === current.maxSalePrice;

    const initialValues = {
      name: current.name,
      url: `pages/Product/Detail/index?id=${current.id}`,
      coverImgUrl: `${current.image}?imageView2/0/w/300/h/300/q/100`,
      productInfoId: current.id,
      price: undefined as undefined | number,
      priceRange: undefined as undefined | number[],
      priceType: isOnePrice ? priceTypeInvertMap.一口价 : priceTypeInvertMap.价格区间,
    };

    if (isOnePrice) {
      initialValues.price = current.minSalePrice!;
    } else {
      initialValues.priceRange = [current.minSalePrice!, current.maxSalePrice!].filter(
        (v) => !isEmpty(v),
      );
    }

    openLiveProductForm(initialValues);
  };

  return (
    <>
      {ModalFormElement}

      <Button type="primary" onClick={() => setVisible(true)}>
        {children}
      </Button>

      <ModalWrapper
        {...{
          title: '选择商品',
          visible,
          bodyStyle: {
            backgroundColor: '#f0f2f5',
          },
          onCancel: handleCancel,
          onOk: handleOk,
          children: (
            <GeneralTableLayout
              request={getLiveStreamPage}
              useTableOptions={{
                manual: true,
              }}
              getActions={actionsRef}
              placeholder="--"
              searchProps={{
                minItem: 3,
                components: {
                  SelectByLoadMore,
                },
                items: [
                  {
                    name: {
                      title: '商品名称',
                      type: 'string',
                      'x-component-props': {
                        placeholder: '请输入商品名称',
                      },
                    },
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
                    storeId: {
                      title: '所属商家',
                      type: 'string',
                      'x-component': 'SelectByLoadMore' as any,
                      'x-component-props': {
                        placeholder: '请输入商家名称进行搜索',
                        request: (params: AnyObject) =>
                          getMerchantList({
                            ...params,
                            content: params.searchValue,
                            auditStatus: 1,
                          }).then((res) => ({
                            data: (res.data.records as StoreUserColumns[]).map((item) => ({
                              value: item.id,
                              label: `${item.storeName}(${item.linkPhone})`,
                            })),
                            total: res.data.total,
                          })),
                      },
                    },
                  },
                ],
              }}
              operationButtonListProps={false}
              tableProps={{
                rowSelection: {
                  type: 'radio',
                  onChange: (key) => {
                    selectedRowKeyRef.current = String(key);
                  },
                },
              }}
              columns={[
                {
                  title: '首图',
                  dataIndex: 'image',
                  image: true,
                  width: 72,
                },
                {
                  title: '商品名称',
                  dataIndex: 'name',
                },
                {
                  title: '类目',
                  dataIndex: 'categoryNamePath',
                  ellipsisProps: true,
                },
                {
                  title: '所属商家',
                  dataIndex: 'storeName',
                },
              ]}
            />
          ),
        }}
      />
    </>
  );
};
