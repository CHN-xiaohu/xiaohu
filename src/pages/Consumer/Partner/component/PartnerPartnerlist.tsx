import {
  convenientDateRangeSchema,
  useGeneralTableActions,
  GeneralTableLayout,
} from '@/components/Business/Table';

import { SwitchPlus } from '@/components/Library/Switch';

import { Modal } from 'antd';
import { useState, useCallback } from 'react';

import type { partnerColumns } from '../Api';
import { getPartnerList, updateStatus, unbindPartner } from '../Api';

const PartnerPartnerList = ({ partnerId, ...partnerPartnerOpt }: any) => {
  const { actionsRef } = useGeneralTableActions<partnerColumns>();

  const [openUnbind, setOpenUnbind] = useState(false);
  const [sonPartnerId, setSonPartnerId] = useState('');

  const request = (params: any) => {
    const query = {
      size: params.pageSize,
      current: params.current,
      parentId: partnerId,
      ...params,
    };
    return getPartnerList({ ...query });
  };

  const handleSuccess = useCallback(() => actionsRef.current.reload(), []);

  const handleChangeStatus = (_: any, record: any) => {
    return updateStatus(record.id).then(() => {
      handleSuccess();
    });
  };

  const handleUnbindPartner = (record: any) => {
    setOpenUnbind(true);
    setSonPartnerId(record.id);
  };

  const unbindOpt = {
    title: '提示',
    visible: openUnbind,
    width: 250,
    onCancel() {
      setOpenUnbind(false);
    },
    onOk() {
      unbindPartner(sonPartnerId).then(() => {
        setOpenUnbind(false);
        handleSuccess();
      });
    },
  };

  return (
    <Modal {...partnerPartnerOpt}>
      <Modal {...unbindOpt}>确定解除该合伙人的绑定关系？</Modal>
      <GeneralTableLayout<partnerColumns, any>
        request={request as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        searchProps={{
          minItem: 3,
          items: [
            {
              selectField: {
                type: 'string',
                title: '模糊搜索',
                placeholder: '商家名称/手机号',
              },
              '[selectStartDate,selectEndDate]': convenientDateRangeSchema(),
            },
          ],
        }}
        columns={[
          {
            title: '合伙人姓名',
            dataIndex: 'partnerName',
          },
          {
            title: '注册手机',
            dataIndex: 'partnerPhone',
          },
          {
            title: '线下商家',
            dataIndex: 'sonStoreCount',
          },
          {
            title: '合伙人状态',
            dataIndex: 'status',
            render: (data: any, record: any, index: number) => (
              <SwitchPlus
                field="status"
                value={data === 1 ? 0 : 1}
                onChange={() => handleChangeStatus(index, record)}
                modalProps={{
                  children: (
                    <span>
                      {
                        // eslint-disable-next-line no-extra-boolean-cast
                        !Boolean(data) ? (
                          <span>
                            确定禁用该合伙人？
                            <br />
                            禁用后无法登录合伙人后台
                          </span>
                        ) : (
                          '确定启用该合伙人？'
                        )
                      }
                    </span>
                  ),
                }}
              />
            ),
          },
          {
            title: '注册时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 110,
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '解绑',
                  onClick: () => handleUnbindPartner(row),
                },
              ],
            },
          },
        ]}
      />
    </Modal>
  );
};

export default PartnerPartnerList;
