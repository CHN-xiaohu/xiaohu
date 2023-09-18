import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { ButtonList } from '@/components/Library/ButtonList';

import { Modal } from 'antd';
import { useState, useCallback } from 'react';

import type { recordColumns } from '../Api';
import { getCouponRecord, stopCouponRecord, getMiniCouponRecord, stopMiniCoupon } from '../Api';
import { searchStatus, handleIsMiniCoupon } from '../Util';

const RecordModal = ({ couponId, ...recordOpt }: any) => {
  const { actionsRef } = useGeneralTableActions<recordColumns>();
  const [openStop, setOpenStop] = useState(false);
  const [recordId, setRecordId] = useState('');
  const request = (params: any) => {
    const query = {
      size: params.pageSize,
      current: params.current,
      couponId,
      ...params,
    };
    const requestUrl = handleIsMiniCoupon() ? getMiniCouponRecord : getCouponRecord;
    return requestUrl({ ...query });
  };

  const handleSuccess = useCallback(() => actionsRef.current.reload(), []);

  const hanleOpenStop = (records: any) => {
    setOpenStop(true);
    setRecordId(records.id);
  };

  const stopOpt = {
    title: '提示',
    width: 350,
    visible: openStop,
    onCancel() {
      setOpenStop(false);
    },
    onOk() {
      const requestUrl = handleIsMiniCoupon() ? stopMiniCoupon : stopCouponRecord;
      requestUrl(recordId).then(() => {
        handleSuccess();
        setOpenStop(false);
      });
    },
  };

  return (
    <Modal {...recordOpt}>
      <Modal {...stopOpt}>
        确认停止优惠券吗？
        <div>停止后，{handleIsMiniCoupon() ? '用户' : '商家'}领取的优惠券失效, 不能继续使用。</div>
      </Modal>

      <GeneralTableLayout<recordColumns, any>
        request={request as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              searchText: {
                type: 'string',
                title: '模糊搜索',
                'x-component-props': {
                  placeholder: '商家名称/手机号',
                },
              },
              searchStatus: {
                title: '状态',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '未使用', value: '0' },
                      { label: '已使用', value: '1' },
                      { label: '已过期', value: '2' },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: handleIsMiniCoupon() ? '用户昵称' : '商家名称',
            dataIndex: 'userParam1',
            width: '25%',
          },
          {
            title: handleIsMiniCoupon() ? '用户手机号' : '商家手机',
            dataIndex: 'userParam2',
          },
          {
            title: '使用时间',
            dataIndex: handleIsMiniCoupon() ? 'useTime' : 'validStartTime',
            render: (data: string) => <span>{data || '--'}</span>,
          },
          {
            title: '截止时间',
            dataIndex: 'validEndTime',
          },
          {
            title: '状态',
            dataIndex: 'showStatus',
            render: (data: any) => <span>{searchStatus[data]}</span>,
          },
          {
            title: '操作',
            dataIndex: 'id',
            render: (_: any, records: any) => {
              if (Number(records.showStatus) === 0) {
                return (
                  <ButtonList
                    isLink
                    list={[{ text: '停止', onClick: () => hanleOpenStop(records) }]}
                  />
                );
              }
              return '';
            },
          },
        ]}
      />
    </Modal>
  );
};

export default RecordModal;
