import * as React from 'react';
import { useIntl } from 'umi';

import { CheckboxList } from './CheckboxList';

import type { UseTableStoreState } from '../../../../../Container';

import '../index.less';

type Props = {
  tableColumns: UseTableStoreState['tableColumns'];
  className?: string;
};

// todo：避免 table columns 直接传递下去，可以只传 index, 用下级从容器中获取真实对应的数据
export const GroupCheckboxList: React.FC<Props> = ({ tableColumns, className }) => {
  const rightList: Props['tableColumns'] = [];
  const leftList: Props['tableColumns'] = [];
  const list: Props['tableColumns'] = [];
  const intl = useIntl();

  tableColumns.forEach((item) => {
    const { fixed } = item;

    if (fixed === 'left') {
      leftList.push(item);
      return;
    }

    if (fixed === 'right') {
      rightList.push(item);
      return;
    }

    list.push(item);
  });

  const showRight = rightList && rightList.length > 0;
  const showLeft = leftList && leftList.length > 0;

  return (
    <div className={`${className}-list`}>
      <CheckboxList
        title={intl.formatMessage({ id: 'table.toolBar.leftFixedTitle' })}
        list={leftList}
        className={className}
      />

      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        list={list}
        title={intl.formatMessage({ id: 'table.toolBar.noFixedTitle' })}
        showTitle={showLeft || showRight}
        className={className}
      />

      <CheckboxList
        title={intl.formatMessage({ id: 'table.toolBar.rightFixedTitle' })}
        list={rightList}
        className={className}
      />
    </div>
  );
};
