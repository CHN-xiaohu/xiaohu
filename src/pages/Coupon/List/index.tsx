import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { ButtonList } from '@/components/Library/ButtonList';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useState, useCallback } from 'react';
import { history } from 'umi';
import { Modal, message } from 'antd';

import { useDispatch } from 'dva';

import type { CouponColumns } from '../Api';
import {
  getCouponList,
  stopCoupon,
  deleteCoupon,
  manualIssues,
  getMiniCouponList,
  delMiniCouponDetail,
  miniManualIssues,
} from '../Api';
import {
  typeList,
  statusList,
  getCouponDescriptionByType,
  stringFilterOption,
  handleIsMiniCoupon,
} from '../Util';
import { useStoresToSelectOptions } from '../useStoresToSelectOptions';
import { useMiniProgramCouponQR } from '../MiniprogramCouponQR';

import RecordModal from '../component/RecordModal';
import ManualIssue from '../component/ManualIssue/index';

export default function CouponList() {
  const { actionsRef } = useGeneralTableActions<CouponColumns>();
  const { storeSelectOptions } = useStoresToSelectOptions();

  const dispatch = useDispatch();

  const { selectedProductRowKeys } = useStoreState('coupon');

  const [openCouponRecord, setCouponRecord] = useState(false);
  const [couponId, setCouponId] = useState('');
  const [isStop, setStop] = useState(false);
  const [openManualIssue, setManualIssue] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [couponCount, setCouponCount] = useState(0);
  const { openMiniProgramCouponQR, MiniProgramCouponQRElement } = useMiniProgramCouponQR();

  const handleSuccess = useCallback(() => actionsRef.current.reload(), []);

  const handleGoAdd = () => {
    if (handleIsMiniCoupon()) {
      history.push('/miniProgram/coupon/form');
    } else {
      history.push('/app/coupon/form');
    }
  };

  const handleOpenRecord = (records: any) => {
    setCouponId(records.id);
    setCouponRecord(true);
  };

  const handleOpenStop = (records: any) => {
    setStop(true);
    setCouponId(records.id);
  };

  const handleOpenManualIssue = (records: any) => {
    setManualIssue(true);
    setCouponId(records.id);
    dispatch({
      type: 'coupon/updateState',
      payload: {
        merchantList: [],
        selectedProductRowKeys: [],
        currentMerchantList: [],
      },
    });
  };

  const handleOpenDelete = (records: any) => {
    setOpenDelete(true);
    setCouponId(records.id);
  };

  const recordOpt = {
    width: 1000,
    title: '优惠券领取记录',
    visible: openCouponRecord,
    couponId,
    footer: false,
    onCancel() {
      setCouponRecord(false);
    },
  };

  const stopOpt = {
    width: 300,
    title: '提示',
    visible: isStop,
    onCancel() {
      setStop(false);
    },
    onOk() {
      stopCoupon(couponId).then(() => {
        handleSuccess();
      });
      setStop(false);
    },
  };

  const manualOpt = {
    title: '人工发放',
    width: 1000,
    visible: openManualIssue,
    couponId,
    onCancel() {
      setManualIssue(false);
    },
    onChangeCount(value: any) {
      setCouponCount(value);
    },
    onOk() {
      if (!couponCount) {
        message.warning('请输入张数');
      } else if (selectedProductRowKeys.length < 1) {
        message.warning('请添加商家');
      } else {
        const requestUrl = handleIsMiniCoupon() ? miniManualIssues : manualIssues;
        requestUrl({
          couponIds: [couponId],
          receiverIds: selectedProductRowKeys,
          count: couponCount,
        }).then(() => {
          message.success('人工发放成功！');
          setManualIssue(false);
          handleSuccess();
        });
      }
    },
  };

  const deleteOpt = {
    title: '提示',
    width: 250,
    visible: openDelete,
    onCancel() {
      setOpenDelete(false);
    },
    onOk() {
      const requestUrl = handleIsMiniCoupon() ? delMiniCouponDetail : deleteCoupon;
      requestUrl(couponId).then(() => {
        handleSuccess();
      });
      setOpenDelete(false);
    },
  };

  const handleRequestUrl = (params: any) => {
    if (handleIsMiniCoupon()) {
      return getMiniCouponList({
        ...params,
        platform: 0,
      }) as any;
    }
    return getCouponList({
      ...params,
      platform: 0,
    }) as any;
  };

  const handleGoDetail = (id: string) => {
    if (handleIsMiniCoupon()) {
      history.push(`/miniProgram/coupon/detail/${id}`);
    } else {
      history.push(`/app/coupon/detail/${id}`);
    }
  };

  const handleGoEdit = (record: any) => {
    if (handleIsMiniCoupon()) {
      history.push(`/miniProgram/coupon/form/${record.id}`);
    } else {
      history.push(`/app/coupon/form/${record.id}`);
    }
  };

  const handleGoToAdd = () => {
    dispatch({
      type: 'coupon/updateState',
      payload: {
        storeId: '',
        couponId: '',
        tempRowProducts: [],
        selectRowProducts: [],
        selectedProductRowKeys: [],
        categoryName: '',
      },
    });
    handleGoAdd();
  };

  return (
    <>
      {MiniProgramCouponQRElement}
      <Modal {...deleteOpt}>确认删除优惠券？</Modal>
      <Modal {...stopOpt}>
        确认停止优惠券吗？
        <div>停止后，不会影响已领取优惠券的使用</div>
      </Modal>
      {openCouponRecord && <RecordModal {...recordOpt} />}
      {openManualIssue && <ManualIssue {...manualOpt} />}
      <GeneralTableLayout<CouponColumns, any>
        request={(params) => handleRequestUrl(params) as any}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              name: {
                title: '模糊搜索',
                type: 'string',
                'x-component-props': {
                  placeholder: '优惠券名称',
                },
              },
              type: {
                title: '优惠券类型',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '满减券', value: 1 },
                      { label: '打折券', value: 2 },
                    ],
                    '',
                  ),
                },
              },
            },
            {
              status: {
                title: '优惠券状态',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '未开始', value: 1 },
                      { label: '进行中', value: 2 },
                      { label: '已结束', value: 3 },
                    ],
                    '',
                  ),
                },
              },
              storeId: {
                title: '所属商家',
                type: 'string',
                visible: handleIsMiniCoupon(),
                'x-component-props': {
                  dataSource: storeSelectOptions || [],
                  showSearch: true,
                  filterOption: stringFilterOption,
                  placeholder: '请选择所属商家',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '优惠券名称',
            dataIndex: 'name',
            width: '25%',
          },
          {
            title: '类型',
            dataIndex: 'type',
            render: (data: any) => <span>{typeList[data]}</span>,
          },
          {
            title: '优惠内容',
            dataIndex: 'withAmount',
            render: (_: number, records) => getCouponDescriptionByType(records),
          },
          {
            title: '所属商家',
            dataIndex: 'storeName',
            width: '10%',
            visible: window.location.pathname.split('/').includes('miniProgram'),
          },
          {
            title: '状态',
            dataIndex: 'showStatus',
            render: (data: any) => <span>{statusList[data]}</span>,
          },
          {
            title: '已领取/剩余',
            dataIndex: 'takeCount',
            render: (data: any, records: any) => (
              <a onClick={() => handleOpenRecord(records)}>
                {data}/{records.quota - data < 0 ? 0 : records.quota - data}
              </a>
            ),
          },
          {
            title: '已使用',
            dataIndex: 'usedCount',
            render: (data: any) => <span>{data > 0 ? data : 0}</span>,
          },
          {
            title: '操作',
            dataIndex: 'id',
            render: (_: any, records: any) => {
              let list = [];
              if (records.showStatus > 1) {
                list = [
                  { text: '查看', onClick: () => handleGoDetail(records?.id) },
                  { text: '删除', onClick: () => handleOpenDelete(records) },
                ];
              } else {
                list = [
                  { text: '编辑', onClick: () => handleGoEdit(records) },
                  {
                    text: handleIsMiniCoupon() ? '推广' : '查看',
                    onClick: handleIsMiniCoupon()
                      ? () => openMiniProgramCouponQR({ id: records?.id, name: records?.name })
                      : () => handleGoDetail(records?.id),
                  },
                  { text: '停止', onClick: () => handleOpenStop(records) },
                  { text: '人工发放', onClick: () => handleOpenManualIssue(records) },
                ];
              }
              return <ButtonList isLink list={list} maxCount={4} />;
            },
          },
        ]}
        defaultAddOperationButtonListProps={{
          text: '新增优惠券',
          onClick: () => handleGoToAdd(),
        }}
      />
    </>
  );
}
