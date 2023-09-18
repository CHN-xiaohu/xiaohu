import {
  // generateDefaultSelectOptions,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import { useCallback } from 'react';
import { Modal, Button } from 'antd';

import { useCreateMemberForm } from '../form/CreateMemberForm';
import { useCancelMemberForm } from '../form/CancelMemberForm';
import { getVipMessage } from '../Api';

const MerchantVip = ({ storeId, isVip, vipExpireTime, vipName, ...merchantOpt }: any) => {
  const { actionsRef } = useGeneralTableActions();

  const request = (params: any) => getVipMessage({ storeId, ...params });

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm: handleOpenCreateForm, ModalFormElement } = useCreateMemberForm({
    storeId,
    vipExpireTime,
    isVip,
    handleCreateAdSuccess,
  });

  const {
    openForm: handleCancelMemberForm,
    ModalFormElement: ModalMemberElement,
  } = useCancelMemberForm({
    storeId,
    vipName,
    handleCreateAdSuccess,
  });

  return (
    <>
      {ModalFormElement}
      {ModalMemberElement}
      <Modal
        title={
          <div>
            商家会员信息
            <Button onClick={handleOpenCreateForm} type="primary" style={{ marginLeft: '20px' }}>
              人工创建
            </Button>
            <Button
              onClick={handleCancelMemberForm}
              style={{ marginLeft: '20px', display: isVip ? 'none' : undefined }}
            >
              取消会员
            </Button>
          </div>
        }
        {...merchantOpt}
      >
        <GeneralTableLayout
          request={request}
          getActions={actionsRef}
          operationButtonListProps={false}
          columns={[
            {
              title: '会员名称',
              dataIndex: 'vipName',
            },
            {
              title: '会员费用',
              dataIndex: 'totalMoney',
            },
            {
              title: '购买时间',
              dataIndex: 'createTime',
            },
            {
              title: '到期时间',
              dataIndex: 'vipExpireTime',
            },
            {
              title: '备注',
              dataIndex: 'remark',
              width: '15%',
            },
            {
              title: '操作人',
              dataIndex: 'createUsername',
            },
          ]}
        />
      </Modal>
    </>
  );
};

export default MerchantVip;
