import { useState } from 'react';
import * as React from 'react';
import { Tag } from 'antd';
import classNames from 'classnames';

import { usePersistFn } from 'ahooks';

import styles from './index.less';

const { CheckableTag } = Tag;

type Props = {
  actions: { title: string | JSX.Element; onClick?: (e: React.MouseEvent) => void }[];
  states: Record<string, string>;
  defaultState?: string;
  onStateChange?: (value: Record<string, string>) => void;
};

export const TableStateAction: React.FC<Partial<Props>> = ({
  actions,
  states,
  onStateChange,
  defaultState = '',
}) => {
  const [activeStates, setActiveStates] = useState(defaultState);

  const handleStateChange = usePersistFn((value: string) => {
    setActiveStates(value);

    // 约定分隔符为 $, 例子: status$1 => { status: 1 }
    if (onStateChange && value.includes('$')) {
      const arr = value.split('$');
      onStateChange?.({ [arr[0]]: arr[1] });
    }
  });

  const statesEl = (dataSource: Props['states']) =>
    Object.keys(dataSource).map((item) => (
      <CheckableTag
        key={item}
        checked={item === activeStates}
        onChange={() => handleStateChange(item)}
      >
        {dataSource[item]}
      </CheckableTag>
    ));

  const actionsEl = (dataSource: Props['actions']) =>
    dataSource.map((item) => (
      <span key={String(item.title)} className="ant-typography" onClick={item.onClick}>
        {item.title}
      </span>
    ));

  return (
    <div className={classNames(styles.wrapper, states && !actions && styles.justifyContentFlexEnd)}>
      {actions && <div className={styles.actions}>{actionsEl(actions)}</div>}
      {states && <div>{statesEl(states)}</div>}
    </div>
  );
};
