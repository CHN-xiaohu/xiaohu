import { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import { useModal } from '@/foundations/hooks';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { getProduct } from '../Api/product';

type Props = {
  title?: string;
};

export const useShowTakeProductPrice = ({ title = '查看商品拿货价' }: Props) => {
  const { initialValues } = useStoreState('product');
  const [priceList, setPriceList] = useState([]);
  const {
    openModal,
    closeModal,
    modalElement: ShowTakeProductPriceElement,
  } = useModal({
    title,
    bodyStyle: {
      height: '75vh',
    },
    footer: false,
  });

  const handleGeDetail = () => {
    if (initialValues.fromProductInfoId && Number(initialValues.fromType) === 1) {
      getProduct(initialValues.fromProductInfoId).then((res) => {
        const { products } = res.data;
        setPriceList(products);
      });
    }
  };

  useEffect(() => {
    handleGeDetail();
  }, []);

  const openShowTakeProductPrice = useCallback(
    () =>
      openModal({
        children: (
          <Table
            bordered
            rowKey={'id'}
            dataSource={priceList}
            columns={[
              {
                title: '商品规格',
                dataIndex: 'salePropValNames',
                render: (data) => <span>{data?.join(' - ')}</span>,
              },
              { title: '起售数', dataIndex: 'minimumSale' },
              {
                title: '采购价',
                dataIndex: 'purchasePrice',
                render: (data) => <span style={{ color: '#1890ff' }}>￥{data}</span>,
              },
            ]}
          />
        ),
      }),
    [priceList],
  );

  return {
    openShowTakeProductPrice,
    ShowTakeProductPrice: closeModal,
    ShowTakeProductPriceElement,
  };
};
