import { useCallback } from 'react';
import { Card, Tabs } from 'antd';

import { useModal } from '@/foundations/hooks';

import { SelectBrandProduct } from './SelectBrandProductByModal';

import styles from '../../Supply/index.less';

const { TabPane } = Tabs;

const TabPaneOpts = [
  {
    title: '未上架',
    state: 2 as 2,
  },
  {
    title: '已上架',
    state: 1 as 1,
  },
];

type Props = {
  title?: string;
};

export const useSelectBrandProductByModal = ({ title = '品牌总部商品' }: Props) => {
  const {
    openModal,
    closeModal,
    modalElement: SelectBrandProductElement,
  } = useModal({
    title,
    bodyStyle: {
      height: '75vh',
    },
    footer: false,
  });

  const openSelectBrandProduct = useCallback(
    () =>
      openModal({
        children: (
          <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
            <Tabs>
              {TabPaneOpts.map((item) => (
                <TabPane tab={item.title} key={item.state}>
                  <SelectBrandProduct
                    {...{
                      productState: item.state,
                    }}
                  />
                </TabPane>
              ))}
            </Tabs>
          </Card>
        ),
      }),
    [closeModal],
  );
  return {
    openSelectBrandProduct,
    closeSelectProduct: closeModal,
    SelectBrandProductElement,
  };
};
