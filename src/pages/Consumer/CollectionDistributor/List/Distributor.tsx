import {
  GeneralTableLayout,
  generateDefaultSelectOptions,
  useGeneralTableActions,
} from '@/components/Business/Table';
import { Question } from '@/pages/Dashboard/Workplace';

import { memo, useCallback, useState } from 'react';
import { message, Popover, Typography } from 'antd';

import { useAuditDistributorForm } from '../Form/AuditDistributorForm';

import { auditStatusMap, auditStatusColorMap } from '../Constants';

import type { IMyAuditDistributorListColumns } from '../Api';
import { getMyAuditDistributorList } from '../Api';

export const DistributionApplication = memo(({ status }: any) => {
  const { actionsRef } = useGeneralTableActions<IMyAuditDistributorListColumns>();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any);

  const handleCreateAdSuccess = useCallback(() => {
    setSelectedRowKeys([]);
    actionsRef.current.reload();
  }, []);

  const {
    openForm: openAuditDistributor,
    ModalFormElement: ModalAuditDistributorFormElement,
  } = useAuditDistributorForm({
    onAddSuccess: handleCreateAdSuccess,
  });

  const getTableProps = () => {
    // 待审核
    if (status === 0) {
      return {
        rowKey: 'id',
        rowSelection: {
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys as string[]),
        },
      };
    }
    return {};
  };

  const handleBulkReview = () => {
    if (selectedRowKeys.length === 0) {
      return message.warning('请选择需要审核的记录');
    }
    return openAuditDistributor({ ids: selectedRowKeys });
  };

  return (
    <>
      {ModalAuditDistributorFormElement}
      <GeneralTableLayout<IMyAuditDistributorListColumns>
        tableProps={{ scroll: { x: 1500 }, style: { width: 1600 }, ...getTableProps() }}
        request={(params) =>
          getMyAuditDistributorList({
            auditStatus: status === -1 ? '' : status,
            ...params,
          })
        }
        operationButtonListProps={{
          list: [
            {
              text: '批量审核',
              type: 'primary',
              onClick: () => handleBulkReview(),
              visible: status === 0,
            },
          ],
        }}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              tenantName: {
                title: '模糊查询',
                type: 'string',
                col: 10,
                'x-component-props': {
                  placeholder: '分销商名称',
                },
              },
              '[startTime,endTime]': {
                title: '申请时间',
                type: 'convenientDateRange' as 'convenientDateRange',
                col: 16,
                'x-props': {
                  itemClassName: 'search-form__convenientDateRange',
                },
              },
            },
            ...[
              status === -1
                ? {
                    auditStatus: {
                      title: '审核状态',
                      type: 'checkableTags' as 'checkableTags',
                      'x-component-props': {
                        options: generateDefaultSelectOptions(
                          Object.keys(auditStatusMap).map((value) => ({
                            label: auditStatusMap[value],
                            value,
                          })),
                        ),
                      },
                    },
                  }
                : {},
            ],
          ],
        }}
        columns={[
          {
            title: '分销商名称',
            dataIndex: 'tenantName',
            render: (v) => v || '--',
          },
          {
            title: '主营类目',
            dataIndex: 'category',
            width: 500,
            render: (v) => {
              const category = v.map((item: { treeNamePath: any }) => {
                return <>{item.treeNamePath}&nbsp;&nbsp;&nbsp;</>;
              });
              return (
                <Popover content={category}>
                  <Typography.Paragraph ellipsis={{ rows: 8 }}>{category}</Typography.Paragraph>
                </Popover>
              );
            },
          },
          {
            title: '审核状态',
            dataIndex: 'auditStatus',
            render: (type: number, row: any) => {
              return (
                <span style={{ color: auditStatusColorMap[type] }}>
                  {auditStatusMap[type]}
                  {type === 2 && (
                    <Question
                      iconStyle={{ marginLeft: 6 }}
                      title=""
                      dataSource={[row.refuseReason]}
                    />
                  )}
                </span>
              );
            },
          },
          {
            title: '申请时间',
            dataIndex: 'applyTime',
          },
          {
            title: '审核时间',
            dataIndex: 'auditTime',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '审核',
                  onClick: () => openAuditDistributor({ ids: [row.id] }),
                  visible: row.auditStatus === 0,
                },
              ],
            },
          },
        ]}
      />
    </>
  );
});
