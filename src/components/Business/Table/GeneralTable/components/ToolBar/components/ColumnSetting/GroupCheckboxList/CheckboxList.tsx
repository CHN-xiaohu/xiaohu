import * as React from 'react';

import { CheckboxListItem } from './CheckboxListItem';

import '../index.less';

export const CheckboxList: React.FC<{
  list: any[];
  className?: string;
  title: string;
  showTitle?: boolean;
}> = ({ list, className, showTitle = true, title: listTitle }) => {
  const show = list && list.length > 0;
  if (!show) {
    return null;
  }

  const listDom = list.map((item) => (
    <CheckboxListItem key={item.key || item.dataIndex} dataSource={item} className={className} />
  ));

  return (
    <>
      {showTitle && <span className={`${className}-list-title`}>{listTitle}</span>}
      {listDom}
    </>
  );
};
