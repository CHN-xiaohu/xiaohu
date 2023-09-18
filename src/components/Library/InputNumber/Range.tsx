import { Space } from 'antd';

import { useImmer } from 'use-immer';

import { SwapRightOutlined } from '@ant-design/icons';

import type { InputNumberProps } from '@/components/Library/InputNumber';
import { InputNumber } from '@/components/Library/InputNumber';

import { isEmpty } from '@spark-build/web-utils';

import { useDebounceWatch, useWatch } from '@/foundations/hooks';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Props extends Omit<InputNumberProps, 'value' | 'onChange'> {
  value?: number[];
  onChange?: (v: Props['value']) => void;
}

export const InputNumberRange = (props: Props) => {
  const { onBlur, onChange, onFocus, value, ...lastProps } = props;

  const [state, setState] = useImmer({
    min: lastProps.min,
    max: lastProps.max,
    value: [] as number[],
  });

  const handleValueChangeBySetState = (draft: typeof state) => (index: 0 | 1) => (
    v: string | number | undefined,
  ) => {
    draft.value[index] = (v as unknown) as number;
  };

  const handleChange = (index: 0 | 1) => (v: string | number | undefined) => {
    setState((draft) => {
      handleValueChangeBySetState(draft)(index)(v);
    });
  };

  useDebounceWatch(() => {
    const realValue = [] as number[];
    state.value.forEach((v) => {
      if (!isEmpty(v)) {
        realValue.push(v);
      }
    });

    onChange?.(realValue.length === 2 ? realValue : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value]);

  useWatch(
    () => {
      setState((draft) => {
        if (!value) {
          draft.value = [];

          return;
        }

        value.forEach((v, i) => handleValueChangeBySetState(draft)(i as 0 | 1)(v));
      });
    },
    [value],
    { immediate: true, isAreEqual: true },
  );

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setState((draft) => {
      Array.from({ length: draft.value.length }).forEach((_, index) => {
        // 因为是区间，所以需要保证区间 0 的 max 不能超过区间 1 的值，而区间 1 不能低于区间 0 的值
        const type = index === 0 ? 'min' : 'max';
        const v = draft.value[index];

        const comparisonOfSize =
          !isEmpty(lastProps[type]) &&
          !isEmpty(v) &&
          (index === 0 ? v! < lastProps[type]! : v! > lastProps[type]!);

        draft[type] = comparisonOfSize ? lastProps[type] : Number(v);
      });
    });

    onBlur?.(e);
  };

  return (
    <Space>
      <InputNumber
        {...lastProps}
        onBlur={handleBlur}
        value={state.value[0]}
        onChange={handleChange(0)}
        max={state.max}
      />
      <SwapRightOutlined />
      <InputNumber
        {...lastProps}
        value={state.value[1]}
        onChange={handleChange(1)}
        onBlur={handleBlur}
        min={state.min}
      />
    </Space>
  );
};
