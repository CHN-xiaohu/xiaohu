import type { TableActions } from '@/components/Business/Table';
import { GeneralTableLayout } from '@/components/Business/Table';

import { transformPennyToDecimal } from '@/utils';

import { useRef, useCallback } from 'react';
import type { SorterResult } from 'antd/lib/table/interface';

import type { IMerchantBalanceColumns } from './Api';
import { getMerchantBalances, getProhibitWithdrawalDescription } from './Api';

import { isDisabled } from './Constant';
import { useDetailListModal } from './components/DetailListModal';
import type { FormModalProps } from './components/FormModal';
import { useFormModal } from './components/FormModal';
import { formTypes } from './components/FormModal/Fields/Common';

export default function FinanceBalanceMerchant() {
  const actionsRef = useRef<TableActions<IMerchantBalanceColumns>>({} as any);

  const {
    openDetailModal: openDetailListModal,
    modalElement: ModalDetailElement,
  } = useDetailListModal();

  const { openFormModal: openFormsModal, ModalFormElement } = useFormModal({
    requestSuccess: () => actionsRef.current.reload(),
  });

  const handleOpenDetailListModal = useCallback(
    (item: IMerchantBalanceColumns) => () => {
      openDetailListModal({ walletId: item.id });
    },
    [openDetailListModal],
  );

  const openFormModal = useCallback(
    (itemData: IMerchantBalanceColumns, formType: FormModalProps['formType']) => {
      openFormsModal({ itemData, formType });
    },
    [openFormsModal],
  );

  const handleChargeMoney = useCallback(
    (item: IMerchantBalanceColumns) => () => {
      openFormModal(item, formTypes.chargeMoney);
    },
    [openFormModal],
  );

  const handleDeductMoney = useCallback(
    (item: IMerchantBalanceColumns) => () => {
      openFormModal(item, formTypes.deductMoney);
    },
    [openFormModal],
  );

  const handleProhibitWithdrawal = useCallback(
    (item: IMerchantBalanceColumns) => () => {
      openFormModal(item, formTypes.prohibitWithdrawal);
    },
    [openFormModal],
  );

  const handleRestoretWithdrawal = useCallback(
    (item: IMerchantBalanceColumns) => () => {
      openFormModal(item, formTypes.restoretWithdrawal);
    },
    [openFormModal],
  );

  const handleGetProhibitWithdrawalDescription = useCallback(
    (item: IMerchantBalanceColumns, index: number) => {
      getProhibitWithdrawalDescription(item.id).then((res) => {
        actionsRef.current.setDataSource((draft) => {
          draft[index].prohibitWithdrawalDescription = res.data.remark;
        });
      });
    },
    [],
  );

  const handleTableChange = useCallback(
    (_pagination: any, _filters: any, sorter: SorterResult<IMerchantBalanceColumns>) => {
      const fieldMap = {
        amount: 'orderWallet',
        peas: 'orderPeas',
      };

      const searchFormData = {
        orderWallet: '',
        orderPeas: '',
      } as AnyObject;

      if (sorter.order && sorter.columnKey) {
        searchFormData[fieldMap[String(sorter.field)]] = sorter.order === 'descend';
      }

      actionsRef.current.reload({
        temporarySearchFormData: {
          current: _pagination.current,
        },
        searchFormData,
      });
    },
    [],
  );

  return (
    <>
      {ModalDetailElement}
      {ModalFormElement}
      <GeneralTableLayout<IMerchantBalanceColumns>
        request={getMerchantBalances as any}
        useTableOptions={{
          formatResult: (res) => ({
            total: res.data.total,
            data: (res.data.records as IMerchantBalanceColumns[]).map((item) => ({
              ...item,
              amount: transformPennyToDecimal(item.amount),
              peas: transformPennyToDecimal(item.peas),
            })),
          }),
        }}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                col: 10,
                'x-component-props': {
                  placeholder: '请输入店铺名称、联系人、联系方式进行搜索',
                },
              },
            },
          ],
        }}
        operationButtonListProps={false}
        columns={[
          {
            title: '店铺名称',
            dataIndex: 'storeName',
            ellipsisProps: true as true,
          },
          {
            title: '商户联系人',
            dataIndex: 'linkName',
          },
          {
            title: '联系方式',
            dataIndex: 'linkPhone',
          },
          {
            title: '钱包余额',
            dataIndex: 'amount',
            sorter: true,
            defaultSortOrder: 'descend',
          },
          {
            title: '储值卡余额',
            dataIndex: 'peas',
            sorter: true,
            defaultSortOrder: 'descend',
          },
          {
            title: '注册时间',
            dataIndex: 'createTime',
            width: 178,
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 272,
            buttonListProps: {
              isLink: false,
              maxCount: 4,
              size: 'small' as 'small',
              list: ({ row, index }) => [
                { text: '明细', type: 'primary', onClick: handleOpenDetailListModal(row) },
                { text: '充值', type: 'primary', onClick: handleChargeMoney(row) },
                {
                  text: '扣钱',
                  danger: true,
                  disabled: [row.amount, row.peas].every((v) => String(v) === '0.00'),
                  onClick: handleDeductMoney(row),
                },
                {
                  text: '恢复提现',
                  type: 'primary',
                  visible: isDisabled(row.state),
                  onClick: handleRestoretWithdrawal(row),
                  description: {
                    type: 'popover',
                    title: '原因',
                    content: row.prohibitWithdrawalDescription || '暂无原因描述',
                    onVisibleChange: (visible: boolean) => {
                      if (!row.prohibitWithdrawalDescription && visible) {
                        handleGetProhibitWithdrawalDescription(row, index);
                      }
                    },
                  },
                },
                {
                  text: '禁止提现',
                  danger: true,
                  visible: !isDisabled(row.state),
                  onClick: handleProhibitWithdrawal(row),
                },
              ],
            },
          },
        ]}
        tableProps={{
          onChange: handleTableChange as any,
        }}
      />
    </>
  );
}
