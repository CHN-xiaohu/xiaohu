import { useCallback } from 'react';
import { Tabs } from 'antd';

import { useModal } from '@/foundations/hooks/Antd/useModalWithReactDOMRender';

import { Wallet } from './Wallet';
import { StoredValue } from './StoredValue';

import styles from './index.less';

const { TabPane } = Tabs;

type Props = {
  walletId: string;
};

export const useDetailListModal = () => {
  const { openModal, modalElement } = useModal({
    title: '余额明细',
    className: styles.wrapper,
  });

  let count = 0;
  const openDetailModal = useCallback(({ walletId }: Props) => {
    // 每一次打开都是新的请求
    count += 1;

    openModal({
      children: (
        <Tabs>
          <TabPane tab="钱包明细" key="1">
            <Wallet walletId={walletId} count={count} />
          </TabPane>

          <TabPane tab="储值卡明细" key="2">
            <StoredValue walletId={walletId} count={count} />
          </TabPane>
        </Tabs>
      ),
    });
  }, []);

  return { modalElement, openDetailModal };
};
