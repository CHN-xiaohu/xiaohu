import { useCallback } from 'react';
import { Tabs } from 'antd';
import { useModal } from '@/foundations/hooks';

import { DomainNameConfig } from '../Form/DomainNameConfig';
import { KujialeConfig } from '../Form/KujialeConfig';

const { TabPane } = Tabs;

export const useServiceConfigModal = () => {
  const { openModal, modalElement, closeModal } = useModal({
    title: '服务设置',
    width: '50vw',
    className: 'common-ant-modal',
    footer: null,
  });

  let count = 0;

  const handleCancel = () => {
    closeModal();
  };

  const openDetailModal = useCallback(() => {
    // 每一次打开都是新的请求
    count += 1;

    openModal({
      children: (
        <Tabs defaultActiveKey="1">
          <TabPane tab="域名配置" key="1">
            <DomainNameConfig count={count} />
          </TabPane>
          <TabPane tab="酷家乐配置" key="2">
            <KujialeConfig count={count} cancel={handleCancel} />
          </TabPane>
        </Tabs>
      ),
    });
  }, []);

  return { modalElement, openDetailModal };
};
