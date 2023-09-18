/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import React from 'react';
import { useWatch } from '@/foundations/hooks';
import { notEmpty } from '@/utils';
import { MathCalcic } from '@spark-build/web-utils';
import { useMount } from 'ahooks';
import { Button, Input } from 'antd';
import type { InputProps } from 'antd/es/input';
import { useImmer } from 'use-immer';

import './index.less';

// @ref https://github.com/react-component/input-number/blob/master/src/InputNumber.tsx
/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 2 ** 53 - 1;

// const isEqual = (oldValue: number, newValue: number) =>
//   newValue === oldValue ||
//   (typeof newValue === 'number' &&
//     typeof oldValue === 'number' &&
//     isNaN(newValue) &&
//     isNaN(oldValue));

export interface IStepperProps {
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   *	最小值
   */
  min?: number;
  /**
   * 	最大值
   */
  max?: number;
  /**
   * 步长
   */
  step?: number;
  // 精度
  precision?: number;
  value: number;
  defaultValue?: number;

  onChange?: (value: number) => void;
}

export const Stepper = ({
  max = MAX_SAFE_INTEGER,
  min = -MAX_SAFE_INTEGER,
  step = 1,
  precision,
  value,
  defaultValue,
  disabled,
  onChange,
}: IStepperProps) => {
  const [state, setState] = useImmer({
    value: 0,
    focused: false,
    rawInputValue: '' as string | number,
  });

  const toNumber = (num: number | string) => {
    if (notEmpty(precision)) {
      return Math.round(Number(num) * 10 ** precision!) / 10 ** precision!;
    }

    return Number(num);
  };

  const setValue = (val: any, isEmitChange = true) => {
    const reg = /^-?\d*(\.\d*)?$/;

    if (isNaN(val) || !reg.test(val)) {
      setState((draft) => {
        draft.rawInputValue = value;
      });

      return;
    }

    if (val > max) {
      val = max;
    } else if (val < min) {
      val = min;
    }

    const formatValue = toNumber(val);

    setState((draft) => {
      draft.value = formatValue;
      draft.rawInputValue = formatValue;
    });

    if (isEmitChange) {
      onChange?.(formatValue);
    }
  };

  useMount(() => {
    setValue(defaultValue || value, false);
  });

  useWatch(() => {
    setValue(value, false);
  }, [value]);

  useWatch(() => {
    setValue(value);
  }, [min, max]);

  const handleChange: InputProps['onChange'] = (e) => {
    e.persist();

    setState((draft) => {
      draft.rawInputValue = e.target.value;
    });
  };

  const upOrDown = (type: 'up' | 'down') => () => {
    setValue(new MathCalcic(state.value)[type === 'up' ? 'plus' : 'minus'](step).toNumber());
  };

  const handleBlur = () => {
    const realVal = String(state.rawInputValue).replace(/[^\w.-]+/g, '');
    setValue(realVal);
  };

  return (
    <Input
      className="stepper"
      disabled={disabled}
      value={state.rawInputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      addonBefore={
        <Button disabled={disabled || state.value <= min} onClick={upOrDown('down')}>
          -
        </Button>
      }
      addonAfter={
        <Button disabled={disabled || state.value >= max} onClick={upOrDown('up')}>
          +
        </Button>
      }
    />
  );
};
