import { RowWrapper } from '@/pages/Order/components/BodyRow';

import styles from './index.less';

import type { IExportReportColumns } from '../Api';
import { reportTypeData } from '..';

export const Row = RowWrapper<IExportReportColumns>((row) => (
  <div className={styles.orderRowHeader}>
    <div className={styles.reportApplicationTime}>报表申请时间：{row.reportApplicationTime}</div>
    <div className={styles.reportApplicant}>申请人：{row.reportApplicant}</div>
    <div className={styles.reportType}>报表类型：{reportTypeData[row.reportType]}</div>
  </div>
));
