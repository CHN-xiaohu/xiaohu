import { useMutationObserver } from '@/foundations/hooks';

import { styleInject } from '@/utils/StyleInject';

import { useRef } from 'react';
import classNames from 'classnames';
import { useThrottleEffect } from 'ahooks';
import { Typography, Button, Empty } from 'antd';

import './index.less';

import type { PurchaseOrderColumns } from '../../Api';

// 自动计算 table row 各项的宽度
export const useTableRowAutoWidth = () => {
  const { targetDom, targetDomRef } = useMutationObserver<HTMLDivElement>({
    config: { attributeFilter: ['width'] },
  });
  const tableContainerWidthRef = useRef(0);

  useThrottleEffect(
    () => {
      if (!targetDom || tableContainerWidthRef.current === targetDom.clientWidth) {
        return;
      }

      const tableContainerRef = targetDom;
      tableContainerWidthRef.current = targetDom.clientWidth;

      let css: string = '\n';
      const tableTHElements = tableContainerRef.querySelector('.ant-table-content')?.children[0]
        ?.children[0]?.children;

      if (!tableTHElements || !tableTHElements.length) {
        return;
      }

      for (let i = 0; i < tableTHElements.length; i += 1) {
        css += `.order-body-row-item > div:nth-child(${i + 1}) {\n`;

        const ele = tableTHElements[i] as HTMLTableColElement;

        if (ele.style.cssText) {
          css += ele.style.cssText;
        } else {
          css += `flex: 1`;
        }

        css += '\n}\n';
      }

      styleInject(css as any, { id: 'orderTable' }, false);
    },
    [targetDom?.clientWidth],
    { wait: 60 },
  );

  return {
    targetDom,
    targetDomRef,
  };
};

export const RowWrapper = <T extends AnyObject>(renderRowHeader: (row: T) => React.ReactNode) => ({
  row,
  children,
}: {
  row: T;
  children: T[];
}) => (
  <div className="order-table-row">
    <div className={classNames('order-table-row--item', 'order-table-header')}>
      {renderRowHeader(row)}
    </div>

    <div className={classNames('order-table-row--item', 'order-body-row-item')}>
      {children.map((child, index) => (
        <div className="order-table-row--item-cell" key={child.key || index}>
          {child}
        </div>
      ))}
    </div>
  </div>
);

export const Row = RowWrapper<PurchaseOrderColumns>((row) => (
  <>
    <div>
      <Typography.Paragraph style={{ marginBottom: 0 }} copyable={{ text: row.sn }}>
        {row.groupType === 2 && (
          <Button size="small" danger style={{ marginRight: '5px' }}>
            团购
          </Button>
        )}
        订单编号: {row.sn}
      </Typography.Paragraph>
    </div>

    <div>{/* <a>查看物流</a> */}</div>
  </>
));

export const BodyRow = <RC extends AnyObject = AnyObject>(
  RowComponent: React.FC<{ row: RC; children: RC[] }>,
) => (props: { [k: string]: any; children: any[] }) => {
  const { children, ...lastProps } = props;

  const row = children?.[0]?.props?.record;

  if (!row) {
    return (
      <Empty
        style={{ position: 'sticky', left: '35%', overflow: 'hidden' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <tr {...lastProps}>
      <td colSpan={children.length} style={{ padding: 0 }}>
        <RowComponent {...{ row, children }} />
      </td>
    </tr>
  );
};
