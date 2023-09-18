import { GeneralTableLayout } from '@/components/Business/Table';
// import type { RouteChildrenProps } from '@/typings/basis';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { modelNamespace } from '../Form';

import { getAuditRecords } from '../../Api';
import { selectAuditLog } from '../../Api/share';
import { auditStatusMap } from '../Constants';

export default function ProductSupplyViewAuditRecord() {
  const { initialValues } = useStoreState(modelNamespace);

  const requestUrl: any = window.location.pathname.includes('shareMarketing')
    ? selectAuditLog
    : getAuditRecords;

  return (
    <GeneralTableLayout
      {...{
        request: (params) =>
          requestUrl({ ...params, productInfoId: initialValues?.productInfo?.id }),
        operationButtonListProps: false,
        toolBarProps: false,
        columns: [
          {
            title: '版本号',
            dataIndex: 'shareVersion',
          },
          {
            title: '审核状态',
            dataIndex: 'status',
            formatterValue: ({ value }) => auditStatusMap[value],
          },
          {
            title: '原因说明',
            dataIndex: 'auditContent',
          },
          {
            title: '审核时间',
            dataIndex: 'auditTime',
          },
          {
            title: '申请时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作人',
            dataIndex: 'auditUserName',
          },
        ],
      }}
    />
  );
}
