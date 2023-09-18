import { useState } from 'react';
import { Button, Table, Modal, Input, message } from 'antd';

import { ButtonList } from '@/components/Library/ButtonList';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { cloneDeep } from 'lodash';

import ProductModal from './ProductModal';

import { modelNamespace } from '../Constant';

import styles from '../index.less';

export const ProductTable = () => {
  const [isOpenProduct, setIsOpenProduct] = useState(false);
  const [isOpenDel, setIsOpenDel] = useState(false);
  const [delProductId, setDelProductId] = useState('');

  const {
    tempRowProducts,
    selectRowProducts,
    selectedProductRowKeys,
    productAdvImgType,
  } = useStoreState(modelNamespace as 'pcColumn');

  const handlePrice = (min: any, max: any, unitName: any) => {
    if (min === max) {
      return `${min}/${unitName}`;
    }
    return `${min}/${unitName}~${max}/${unitName}`;
  };

  const handleGetProductNum = () => {
    return {
      PC_PRODUCT_TEMPLATE_ONE: 6,
      PC_PRODUCT_TEMPLATE_TWO: 9,
      PC_PRODUCT_TEMPLATE_FOUR: 10,
      PC_PRODUCT_TEMPLATE_THREE: 16,
      PC_PRODUCT_TEMPLATE_FIVE: 11,
    }[productAdvImgType];
  };

  const handleToggleIsFirst = (productId: string) => {
    const newList = cloneDeep(selectRowProducts);
    newList.forEach((items: any) => {
      if (items.productInfoId === productId) {
        items.isFirst = !items.isFirst;
        items.actionSort = 0;
      }
    });

    if (
      newList.filter((item: { isFirst: any }) => item.isFirst === true || item.isFirst === 1)
        .length < handleGetProductNum()
    ) {
      window.$fastDispatch((model) => model[modelNamespace].updateState, {
        selectRowProducts: newList,
      });
    } else {
      message.warning(`首页最多可以展示${handleGetProductNum() - 1}个商品`);
    }
  };

  const handleSortChange = (value: any, productId: string) => {
    const newList = cloneDeep(selectRowProducts);
    newList.forEach((items: any) => {
      if (items.productInfoId === productId) {
        items.actionSort = value;
      }
    });
    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      selectRowProducts: newList,
    });
  };

  const handleToDel = (id: string) => {
    setIsOpenDel(true);
    setDelProductId(id);
  };

  const handleOpenModal = () => {
    setIsOpenProduct(true);
    let selectKey;
    if (selectRowProducts) {
      selectKey = selectRowProducts.map((i: any) => i?.productInfoId);
    }
    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      selectedProductRowKeys: selectKey,
    });
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
    },
    {
      title: '商品类目',
      dataIndex: 'treeNamePath',
    },
    {
      title: '商品价格',
      dataIndex: 'minPrice',
      render: (_: any, records: any) => (
        <span>￥{handlePrice(records?.minPrice, records?.maxPrice, records?.chargeUnitName)}</span>
      ),
    },
    {
      title: '展示排序',
      dataIndex: 'actionSort',
      width: '15%',
      render: (value: any, records: any) =>
        !records.isFirst ? (
          <span>---</span>
        ) : (
          <Input
            style={{ textAlign: 'center', width: '100%' }}
            type="number"
            value={value}
            max={99999}
            placeholder="输入0-99999"
            onChange={(e) => handleSortChange(e.target.value, records.productInfoId)}
          />
        ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (_: any, records: any) => {
        const list = [
          records.isFirst
            ? {
                text: '取消展示',
                onClick: () => {
                  handleToggleIsFirst(records.productInfoId);
                },
              }
            : {
                text: '首页展示',
                onClick: () => {
                  handleToggleIsFirst(records.productInfoId);
                },
              },
          {
            text: '删除',
            onClick: () => {
              handleToDel(records.productInfoId);
            },
          },
        ];
        return <ButtonList isLink list={list} />;
      },
    },
  ];

  const productOpt = {
    title: '选择商品',
    visible: isOpenProduct,
    width: 900,
    onCancel() {
      setIsOpenProduct(false);
    },
    onOk() {
      const productsKey = tempRowProducts.map((i: { productInfoId: any }) => i?.productInfoId);

      window.$fastDispatch((model) => model[modelNamespace].updateState, {
        selectRowProducts: tempRowProducts,
        selectedProductRowKeys: productsKey,
      });
      setIsOpenProduct(false);
    },
  };

  const handleSureDel = () => {
    setIsOpenDel(false);
    const newList = cloneDeep(selectRowProducts);
    const newKeyList = cloneDeep(selectedProductRowKeys);
    newList.splice(
      newList.findIndex((item: any) => item.productInfoId === delProductId),
      1,
    );
    newKeyList.splice(
      newKeyList.findIndex((item: string) => item === delProductId),
      1,
    );

    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      selectRowProducts: newList,
      tempRowProducts: newList,
      selectedProductRowKeys: newKeyList,
    });
  };

  return (
    <div className={styles.addNavigation}>
      <Modal
        title="提示"
        visible={isOpenDel}
        onCancel={() => setIsOpenDel(false)}
        onOk={() => handleSureDel()}
      >
        确定删除展示商品？
      </Modal>
      <ProductModal {...productOpt} />
      <div className={styles.titleBg}>
        <span className={styles.title}>商品栏目</span>
        <Button type="primary" size="small" onClick={() => handleOpenModal()}>
          添加商品
        </Button>
      </div>
      <Table
        columns={columns}
        bordered
        rowKey="productInfoId"
        className={styles.tablePad}
        dataSource={selectRowProducts}
      />
    </div>
  );
};
