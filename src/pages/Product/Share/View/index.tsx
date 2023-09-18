import type { RouteChildrenProps } from '@/typings/basis';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useState, useCallback } from 'react';
import { Card, Tabs, Button, Modal } from 'antd';

import { useRefuseModal } from './refuseModal';

import Detail from '../../Supply/View/Detail';
import AuditRecord from '../../Supply/View/AuditRecord';
import { submitAuditPass } from '../../Api/share';

import { modelNamespace } from '../../Supply/Form';

import styles from '../../Supply/index.less';

const { TabPane } = Tabs;

export default function ProductShareView(props: RouteChildrenProps<{ id: string }>) {
  const [isPass, setIsPass] = useState(false);
  const { initialValues } = useStoreState(modelNamespace);

  const handleOk = () => {
    submitAuditPass(props?.match?.params?.id).then(() => {
      setIsPass(false);
      window.location.reload();
    });
  };

  const handleCreateAdSuccess = useCallback(() => window.location.reload(), []);

  const { openForm, ModalFormElement } = useRefuseModal({
    onAddSuccess: handleCreateAdSuccess,
    id: props?.match?.params?.id,
  });

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      {ModalFormElement}
      <Modal
        title="审核通过"
        visible={isPass}
        onCancel={() => setIsPass(false)}
        width={250}
        onOk={() => handleOk()}
      >
        确定通过审批？
      </Modal>
      <Tabs>
        <TabPane tab="商品详情" key="1">
          {initialValues?.productInfo?.auditStatus !== 1 &&
            initialValues?.productInfo?.auditStatus !== 2 && (
              <div className={styles.chooseButton}>
                <Button type="primary" onClick={() => setIsPass(true)}>
                  审核通过
                </Button>
                <Button type="danger" onClick={() => openForm()}>
                  审核未通过
                </Button>
              </div>
            )}
          <Detail {...props} />
        </TabPane>

        <TabPane tab="审核记录" key="2">
          <AuditRecord {...props} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
