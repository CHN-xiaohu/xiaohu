/**
 * 基于 antd inputNumber, 增加类似 input 组件的 addonBefore、addonAfter
 */
import * as React from 'react';
import classNames from 'classnames';
import { InputNumber as AntdInputNumber } from 'antd';
import type { InputNumberProps as AntdInputNumberProps } from 'antd/lib/input-number';
import type { InputProps } from 'antd/es/input';

import { isEqual } from 'lodash';

import styles from './index.less';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface InputNumberProps extends AntdInputNumberProps {
  addonBefore?: InputProps['addonBefore'];
  addonAfter?: InputProps['addonBefore'];
}

export const InputNumber = React.memo(
  ({ addonBefore, addonAfter, className, ...lastProps }: InputNumberProps) => {
    const addonBeforeNode = addonBefore ? (
      <div className={styles.addonClass}>{addonBefore}</div>
    ) : null;

    const addonAfterNode = addonAfter ? (
      <div className={styles.addonClass}>{addonAfter}</div>
    ) : null;

    const antdInputNumberClassName = classNames(
      styles.wrapper,
      'form-input-number',
      {
        [styles.existAddonLeft]: !!addonBefore,
        [styles.existAddonRight]: !!addonAfter,
        [styles.sm]: lastProps.size === 'small',
        [styles.lg]: lastProps.size === 'large',
      },
      className,
    );

    // 替换原有 onChange, 增加了避免因为设置了 precision 而导致的第二次可能的重复赋值处理
    const onChange = (v?: React.Key) => {
      if (lastProps.precision && isEqual(v, lastProps.value)) {
        return;
      }

      lastProps.onChange?.(v);
    };

    if (lastProps.readOnly) {
      return <div className={antdInputNumberClassName}>{lastProps.value ?? 0}</div>;
    }

    return (
      <div className={antdInputNumberClassName}>
        {addonBeforeNode}
        <AntdInputNumber {...{ ...lastProps, onChange }} />
        {addonAfterNode}
      </div>
    );
  },
);
