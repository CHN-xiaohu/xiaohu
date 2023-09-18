import { GeneralTableLayout, generateDefaultSelectOptions } from '@/components/Business/Table';

import { Question } from '@/pages/Dashboard/Workplace';

import { useDistributionProductModal } from './components/DistributionProductModal';

import type { IMyApplicationRecordListColumns } from '../Api';
import { getMyApplicationRecordList } from '../Api';

import { auditStatusMap, auditStatusColorMap } from '../Constants';

export default function DistributionApplication() {
  const {
    openDistributionProduct,
    ModalDistributionProductElement,
  } = useDistributionProductModal();

  return (
    <>
      {ModalDistributionProductElement}
      <GeneralTableLayout<IMyApplicationRecordListColumns>
        request={getMyApplicationRecordList}
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              tenantName: {
                title: '模糊查询',
                type: 'string',
                col: 10,
                'x-component-props': {
                  placeholder: '供应商名称',
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
            {
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
            },
          ],
        }}
        columns={[
          {
            title: '供货商名称',
            dataIndex: 'tenantName',
            render: (v) => v || '--',
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
            title: '审核说明',
            dataIndex: 'refuseReason',
            render: (v) => v || '--',
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
              list: ({ row }: any) => [
                {
                  text: '查看商品',
                  onClick: () =>
                    openDistributionProduct({ title: row.tenantName, supplyId: row.supplyId }),
                  visible: ![0, 2].includes(row.auditStatus),
                },
              ],
            },
          },
        ]}
      />
    </>
  );
}
