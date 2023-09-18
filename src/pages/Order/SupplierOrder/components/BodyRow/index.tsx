import classNames from 'classnames';
import { Typography } from 'antd';

import styles from './index.less';

import type { PurchaseOrderColumns } from '../../../Api';

export const Row = ({ row, children }: { row: PurchaseOrderColumns; children: any[] }) => (
  <div className={styles.orderRowWrapper}>
    <div className={classNames(styles.orderRowItem, styles.orderRowHeader)}>
      <div>
        <Typography.Paragraph style={{ marginBottom: 0 }} copyable={{ text: row.sn }}>
          订单编号: {row.sn}
        </Typography.Paragraph>
      </div>

      {!!row.contactNumber && (
        <div>
          {window.location.pathname.includes('/orders/brandSupplier') ? '分销商' : '供货商'}：
          {row.tenantName}（{row.contactNumber}）
        </div>
      )}

      {!!row.purchaseOrderSn && window.location.pathname.includes('/orders/supplier') && (
        <div>买家单号：{row.purchaseOrderSn}</div>
      )}
    </div>

    <div className={classNames(styles.orderRowItem, 'order-body-row-item')}>
      {children.map((child, index) => (
        <div className={styles.orderRowItemCell} key={child.key || index}>
          {child}
        </div>
      ))}
    </div>
  </div>
);
