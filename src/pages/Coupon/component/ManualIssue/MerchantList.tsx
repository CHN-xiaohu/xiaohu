import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { Modal, Button } from 'antd';
import { useDispatch } from 'dva';

import { handleSelectionArray } from '@/utils';

import { handleIsMiniCoupon } from '../../Util';

import type { merchantColumns } from '../../Api';
import { getMerchantList, getMiniUserList } from '../../Api';

const MerchantList = ({ couponId, merchantList, onCancel, onOk, ...manualOpt }: any) => {
  const { actionsRef } = useGeneralTableActions<merchantColumns>();
  const { selectedProductRowKeys } = useStoreState('coupon');

  const dispatch = useDispatch();

  const request = (params: any) => {
    const query = {
      size: params.pageSize,
      current: params.current,
      couponId,
      ...params,
    };
    const requestUrl = handleIsMiniCoupon() ? getMiniUserList : getMerchantList;
    return requestUrl({ ...query });
  };

  const handleSelectAll = (selected: any, selectedRows: any, changeRows: any[]) => {
    const newTempRowMerchants: any[] = handleSelectionArray(
      selected,
      selectedRows,
      changeRows,
      merchantList,
      'id',
    );

    dispatch({
      type: 'coupon/updateState',
      payload: {
        selectedProductRowKeys: newTempRowMerchants.map((item: any) => item?.id),
        merchantList: newTempRowMerchants,
      },
    });
  };

  const handleSelectChange = (record: any, selected: boolean) => {
    handleSelectAll(selected, [], [record]);
  };

  const tableRequestParams = handleIsMiniCoupon()
    ? [
        {
          content: {
            type: 'string',
            title: '模糊搜索',
            'x-component-props': {
              placeholder: handleIsMiniCoupon() ? '用户昵称/手机号' : '商家名称/姓名/手机号',
            },
          },
          gender: {
            title: '性别',
            type: 'checkableTags',
            default: '',
            'x-component-props': {
              options: generateDefaultSelectOptions(
                [
                  { label: '女', value: '1' },
                  { label: '男', value: '2' },
                  { label: '未知', value: '0' },
                ],
                '',
              ),
            },
          },
        },
      ]
    : [
        {
          content: {
            type: 'string',
            title: '模糊搜索',
            'x-component-props': {
              placeholder: '商家名称/姓名/手机号',
            },
          },
          hasVip: {
            title: '会员等级',
            type: 'checkableTags',
            default: 3,
            'x-component-props': {
              options: generateDefaultSelectOptions(
                [
                  { label: '普通商家', value: 1 },
                  { label: '金牌商家', value: 0 },
                ],
                3,
              ),
            },
          },
        },
      ];

  const tableColumns = handleIsMiniCoupon()
    ? [
        {
          title: '用户昵称',
          dataIndex: 'nickname',
        },
        {
          title: '用户手机号',
          dataIndex: 'phone',
        },
        {
          title: '性别',
          dataIndex: 'gender',
          render: (data: any) => (
            <span>{Number(data) === 1 ? '女' : Number(data) === 2 ? '男' : '未知'}</span>
          ),
        },
      ]
    : [
        {
          title: '商家名称',
          dataIndex: 'storeName',
        },
        {
          title: '商家手机',
          dataIndex: 'linkPhone',
        },
        {
          title: '会员身份',
          dataIndex: 'hasVip',
          render: (data: any) => <span>{!Number(data) ? '金牌商家' : '普通商家'}</span>,
        },
      ];

  return (
    <Modal
      footer={
        <div>
          最多可选商家200个，已选：商家（
          <span style={{ color: 'red' }}>{selectedProductRowKeys.length}</span>）个
          <Button onClick={onOk} style={{ marginLeft: '10px' }} type="primary">
            确定
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </div>
      }
      onCancel={onCancel}
      {...manualOpt}
    >
      <GeneralTableLayout<merchantColumns, any>
        request={request as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        searchProps={{
          items: tableRequestParams as any,
        }}
        columns={tableColumns}
        tableProps={{
          rowSelection: {
            selectedRowKeys: selectedProductRowKeys,
            onSelect: handleSelectChange,
            onSelectAll: handleSelectAll,
          },
        }}
      />
    </Modal>
  );
};

export default MerchantList;
