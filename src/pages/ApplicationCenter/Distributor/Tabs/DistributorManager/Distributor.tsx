import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';
import type { EventEmitter } from 'ahooks/lib/useEventEmitter';

import { useState } from 'react';

import { Ellipsis } from '@/components/Library/Ellipsis';

import { useDistributorNotPage } from '@/pages/ApplicationCenter/Salesman/component/useDistributorNotPage';

import { ChooseConsumer } from './ChooseConsumerModal';

import { Detail, useDetailActionsRef } from './Detail';

import { useReviewApplicationModalForm } from './ReviewApplicationModal';

import type { DistributorColumns } from '../../api';
import { getDistributor } from '../../api';

type Props = {
  // 审核状态
  status: number;
  // 事件总线
  upperAndLowerShelves$: EventEmitter<void>;
};

export const Distributor = ({ status, upperAndLowerShelves$ }: Props) => {
  const { distributorSelectOptions } = useDistributorNotPage();
  const { actionsRef } = useGeneralTableActions<DistributorColumns>();
  const { detailActionsRef } = useDetailActionsRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { openReviewApplicationForm, ModalFormElement } = useReviewApplicationModalForm(() =>
    upperAndLowerShelves$.emit(),
  );

  upperAndLowerShelves$.useSubscription(() => {
    actionsRef.current.reload();
  });

  const isItNormal = status === 1;
  // 待审核
  const isWaitForReview = status === 0;

  const getTableProps = () => {
    // 待审核
    if (isWaitForReview) {
      return {
        rowSelection: {
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
        },
      };
    }

    // 非通过状态
    return !isItNormal
      ? undefined
      : {
          scroll: {
            scrollToFirstRowOnChange: true,
            x: 1300,
          },
        };
  };

  return (
    <>
      {ModalFormElement}

      <Detail ref={detailActionsRef} onSuccess={() => actionsRef.current.reload()} />

      <GeneralTableLayout<DistributorColumns>
        request={(params) => getDistributor({ ...params, auditStatus: status })}
        getActions={actionsRef}
        placeholder="--"
        tableProps={getTableProps()}
        searchProps={{
          minItem: 3,
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '分销员昵称、注册手机',
                },
              },
              '[startTime,endTime]': convenientDateRangeSchema({ title: '加入时间' }),
            },
            {
              id: {
                title: '邀请人',
                type: 'string',
                'x-component-props': {
                  dataSource: distributorSelectOptions || [],
                  showSearch: true,
                  filterOption: (input: any, option: any) => {
                    return (
                      option.props.children.indexOf(input) > -1 ||
                      option.props.registerPhone.indexOf(input) > -1
                    );
                  },
                  placeholder: '名称、注册手机',
                },
              },
            },
          ],
        }}
        operationButtonListProps={{
          list: [
            {
              text: '开通分销员',
              visible: status === 1,
              render: (props) => (
                <ChooseConsumer
                  key="ChooseConsumer"
                  // eslint-disable-next-line react/no-children-prop
                  children={props.children}
                  onSuccess={() => actionsRef.current.reload()}
                />
              ),
            },
            {
              text: '批量通过',
              visible: isWaitForReview,
              onClick: () => openReviewApplicationForm({ ids: selectedRowKeys, auditStatus: 1 }),
            },
            {
              text: '批量拒绝',
              visible: isWaitForReview,
              onClick: () => openReviewApplicationForm({ ids: selectedRowKeys, auditStatus: 2 }),
            },
          ],
        }}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            fixed: 'left',
          },
          {
            title: '注册手机',
            width: 120,
            dataIndex: 'registerPhone',
          },
          {
            title: '邀请者',
            dataIndex: 'invitationDistributorName',
            placeholder: true,
          },
          {
            title: '待结算收益',
            dataIndex: 'totalUnsettlementAmount',
            moneyFormatter: true,
            visible: isItNormal,
          },
          {
            title: '可提现收益',
            dataIndex: 'totalWithdrawalProfit',
            moneyFormatter: true,
            visible: isItNormal,
          },
          {
            title: '累计收益',
            dataIndex: 'totalProfit',
            moneyFormatter: true,
            visible: isItNormal,
          },
          {
            title: '累计客户',
            dataIndex: 'totalFansNum',
            visible: isItNormal,
          },
          {
            title: `${isItNormal ? '加入时间' : '申请'}时间`,
            width: 186,
            dataIndex: 'applyTime',
          },
          {
            title: '操作',
            fixed: 'right',
            width: 140,
            align: 'center',
            buttonListProps: {
              align: 'center',
              isLink: true,
              maxCount: 10,
              list: ({ row }) => [
                {
                  text: '查看信息',
                  type: 'primary',
                  visible: isItNormal,
                  onClick: () => detailActionsRef.current?.open(row),
                },
                {
                  text: '通过',
                  type: 'primary',
                  visible: isWaitForReview,
                  onClick: () => openReviewApplicationForm({ ids: [row.id], auditStatus: 1 }),
                },
                {
                  text: '拒绝',
                  type: 'primary',
                  visible: isWaitForReview,
                  onClick: () => openReviewApplicationForm({ ids: [row.id], auditStatus: 2 }),
                },
                {
                  text: row.auditMsg,
                  visible: status === 2,
                  render: () => (
                    <span style={{ color: 'red', width: '100%' }}>
                      <Ellipsis>{row.auditMsg}</Ellipsis>
                    </span>
                  ),
                },
              ],
            },
          },
        ]}
      />
    </>
  );
};
