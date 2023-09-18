import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { Image } from '@/components/Business/Table/Image';

import { useState } from 'react';
import { Modal, Button, message } from 'antd';

import { ModelRelated } from './ModelRelated';

import type { ModelColumns } from '../Api';
import { getProductSkus, cancelBindRelated } from '../Api';

export function RelatedModel({ productType, productInfoId, ...relatedObj }: any) {
  const [isOpenModelRelated, setOpenModelRelated] = useState(false);
  const [selectProducts, setSelectProducts] = useState([] as any);
  const [isCancel, setCancel] = useState(false);
  const [isSetEmpty, setSetEmpty] = useState(false);

  const { actionsRef } = useGeneralTableActions<ModelColumns>();

  const handleOnChange = (values: any) => {
    setSetEmpty(false);
    setSelectProducts(values);
  };

  // const handleCloseModalRelated = () => {
  //   setOpenModelRelated(false)
  // }

  const modelRelatedObj = {
    title: '模型关联',
    visible: isOpenModelRelated,
    width: 900,
    productType,
    selectProducts,
    footer: null,
    onCancel() {
      setOpenModelRelated(false);
      if (isSetEmpty) {
        setSelectProducts([]);
      }
      actionsRef.current.reload();
    },
    onOk() {
      setOpenModelRelated(false);
      setSelectProducts([]);
      actionsRef.current.reload();
    },
    modalOnCancel() {
      setOpenModelRelated(false);
      if (isSetEmpty) {
        setSelectProducts([]);
      }
      actionsRef.current.reload();
    },
  };

  const handleSelectProducts = (values: any) => {
    setOpenModelRelated(true);
    setSetEmpty(false);
    setSelectProducts([values]);
  };

  const handleSetOpenModelRelated = () => {
    if (selectProducts.length < 1) {
      message.warning('请选择商品规格组合！');
      return;
    }
    setOpenModelRelated(true);
  };

  const hanldleCancel = () => {
    if (selectProducts.length < 1) {
      message.warning('请选择商品规格组合！');
      return;
    }
    setCancel(true);
  };

  const handleGoCancel = (values: any) => {
    setSelectProducts([values]);
    setCancel(true);
    setSetEmpty(false);
  };

  const cancelObj = {
    title: '提示',
    visible: isCancel,
    width: 300,
    onCancel() {
      setCancel(false);
    },
    onOk() {
      cancelBindRelated({ productIds: selectProducts.join(',') }).then(() => {
        setCancel(false);
        actionsRef.current.reload();
      });
    },
  };

  return (
    <>
      <Modal {...cancelObj}>确认取消商品与模型的关联关系吗？</Modal>
      {isOpenModelRelated && <ModelRelated {...modelRelatedObj} />}
      <Modal {...relatedObj}>
        <div style={{ marginBottom: '20px' }}>
          <Button
            style={{ marginRight: '20px' }}
            type="primary"
            onClick={() => handleSetOpenModelRelated()}
          >
            批量关联
          </Button>
          <Button type="primary" onClick={() => hanldleCancel()}>
            取消关联
          </Button>
        </div>
        <GeneralTableLayout<ModelColumns>
          request={(params = {} as AnyObject) =>
            getProductSkus({ ...params, productInfoId, productType }) as any
          }
          useTableOptions={{
            formatResult: (res) => ({
              total: 100,
              data: res.data,
            }),
          }}
          getActions={actionsRef}
          operationButtonListProps={false}
          columns={[
            {
              title: 'sku图',
              dataIndex: 'productImage',
              render: (src: string) => <Image src={src} />,
            },
            {
              title: 'sku组合名称',
              dataIndex: 'productName',
            },
            {
              title: '关联模型',
              dataIndex: 'commodifyName',
            },
            {
              title: '操作',
              dataIndex: 'id',
              buttonListProps: {
                list: ({ row }: any) => [
                  row.commodifyId !== '' && row.commodifyId !== '-1'
                    ? {
                        text: '取消关联',
                        onClick: () => {
                          handleGoCancel(row?.productId);
                        },
                      }
                    : {
                        text: '设置关联',
                        onClick: () => {
                          handleSelectProducts(row?.productId);
                        },
                      },
                ],
              },
            },
          ]}
          tableProps={{
            rowKey: 'productId',
            pagination: false,
            rowSelection: {
              onChange: handleOnChange,
            },
          }}
        />
      </Modal>
    </>
  );
}
