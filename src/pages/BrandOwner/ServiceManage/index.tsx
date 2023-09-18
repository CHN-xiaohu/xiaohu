import { useState, useCallback } from 'react';

import { useMount } from 'ahooks';

import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { ServiceForm } from './ServiceManageForm';

import { useServiceConfigModal } from '../ServiceConfigModal';

import type { ServiceColumn } from '../Api';
import { getServiceManage, getDownServices } from '../Api';

const ServiceManage = ({
  match: {
    params: { id },
  },
}: any) => {
  const { actionsRef } = useGeneralTableActions<ServiceColumn>();

  const [downServices, setDownServices] = useState([]);

  const request = (params: any) => {
    const query = {
      size: params.pageSize,
      current: params.current,
      tenantId: id,
      ...params,
    };
    return getServiceManage({ ...query });
  };

  const handleCreateSuccess = useCallback(() => actionsRef.current.reload(), []);

  useMount(() => {
    getDownServices().then((res) => {
      res.data.forEach((items: any) => {
        items.title = items.productName;
        items.defProductPriceDTOS.forEach((item: any) => {
          item.title = `${item.priceInterval}${items.priceUnit}--${item.price}元`;
        });
      });
      setDownServices(res.data);
    });
  });

  const { openForm, ModalFormElement } = ServiceForm({
    onAddSuccess: handleCreateSuccess,
    downServices,
    id,
  });

  const {
    openDetailModal: openDetailListModal,
    modalElement: ModalDetailElement,
  } = useServiceConfigModal();

  return (
    <>
      {ModalFormElement}
      {ModalDetailElement}
      <GeneralTableLayout<ServiceColumn>
        request={request as any}
        getActions={actionsRef}
        operationButtonListProps={{
          list: [
            {
              text: '开通服务',
              type: 'primary',
              onClick: () => openForm(),
            },
            {
              text: '服务设置',
              type: 'primary',
              onClick: () => openDetailListModal(),
            },
          ],
        }}
        columns={[
          {
            title: '服务名称',
            dataIndex: 'productName',
          },
          {
            title: '开通时间',
            dataIndex: 'createTime',
          },
          {
            title: '截止时间',
            dataIndex: 'endTime',
          },
        ]}
      />
    </>
  );
};

export default ServiceManage;
