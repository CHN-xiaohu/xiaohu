import { GeneralTableLayout } from '@/components/Business/Table';
import type { RouteChildrenProps } from '@/typings/basis';

import { history } from 'umi';

import type { ProductLogColumns } from '../../Api';
import { getProductLogs } from '../../Api';
import { productLogOptTypeMap } from '../Constants';

export default function ProductSupplyViewOperationLog({
  match,
}: RouteChildrenProps<{ id: string }>) {
  return (
    <GeneralTableLayout<ProductLogColumns>
      {...{
        request: (params) => getProductLogs({ ...params, productInfoId: match.params.id }),
        operationButtonListProps: false,
        toolBarProps: false,
        columns: [
          {
            title: '操作类型',
            dataIndex: 'optType',
            formatterValue: ({ value }) => productLogOptTypeMap[value],
          },
          {
            title: '备注',
            dataIndex: 'remark',
          },
          {
            title: '操作人',
            dataIndex: 'userName',
          },
          {
            title: '操作时间',
            dataIndex: 'createTime',
          },
          {
            title: '快照',
            dataIndex: 'hasSnapshot',
            width: 110,
            buttonListProps: {
              list: ({ row, value }) => [
                {
                  text: value === 1 ? '查看快照' : '--',
                  disabled: value === 0,
                  onClick: () => history.push(`/product/supply/snapshot/${row.id}`),
                },
              ],
            },
          },
        ],
      }}
    />
  );
}
