import { useCallback } from 'react';
import * as React from 'react';
import { useImmer } from 'use-immer';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { DatePicker } from '@/components/Antd';

import type { RangePickerDateProps } from 'antd/es/date-picker/generatePicker';

import { useDebounceWatch } from '@/foundations/hooks';
import { isStr } from '@/utils';

import { usePersistFn } from 'ahooks';

import styles from './index.less';

import { CheckableTags } from '../CheckableTags';

const { RangePicker } = DatePicker;

type TShortcuts = { text: string; onClick: (dateInstance: typeof dayjs) => Dayjs[] };

// antd v4 的 RangePickerProps 定义有问题，无法被继承
export type ConvenientDateRangeProps = {
  shortcuts?: TShortcuts[];
  format?: string;
  value?: [string | Dayjs, string | Dayjs];
  defaultValue?: [string | Dayjs, string | Dayjs];
  onChange?: (values: (string | Dayjs)[]) => void;
  readOnly?: boolean;
} & Omit<RangePickerDateProps<Dayjs>, 'onChange' | 'value'>;

const addFullDayTimeBetween = (times: [Dayjs, Dayjs]) => [
  times[0].hour(0).minute(0).second(0),
  times[1].hour(23).minute(59).second(59),
];

const DEFAULT_SHORTCUTS: TShortcuts[] = [
  {
    text: '三天内',
    onClick: (dateInstance) =>
      addFullDayTimeBetween([dateInstance().subtract(3, 'day'), dateInstance()]),
  },
  {
    text: '一周内',
    onClick: (dateInstance) =>
      addFullDayTimeBetween([dateInstance().subtract(7, 'day'), dateInstance()]),
  },
  {
    text: '一个月内',
    onClick: (dateInstance) =>
      addFullDayTimeBetween([dateInstance().subtract(1, 'month'), dateInstance()]),
  },
];

const transformMomentToString = (value: Dayjs, format = 'YYYY-MM-DD HH:mm:ss') =>
  value?.format ? value.format(format) : value;

const transformToMoment = (value: string | Dayjs, format = 'YYYY-MM-DD HH:mm:ss') =>
  isStr(value) ? dayjs(value, format) : value;

const Main: React.FC<ConvenientDateRangeProps> = ({
  shortcuts = DEFAULT_SHORTCUTS,
  showTime = {
    defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
  },
  format = 'YYYY-MM-DD HH:mm:ss',
  value = [] as any[],
  defaultValue = [] as any[],
  onChange,
  readOnly,
  ...lastProps
}) => {
  const fetchValue = value.length > 0 ? value : defaultValue;

  const [state, setState] = useImmer({
    internalValue: (value.length > 0 ? value : defaultValue).map((date) =>
      transformToMoment(date, format),
    ) as any,
    internalCheckValue: undefined as any,
  });

  const handleEmitChange = usePersistFn((dates: any[]) => {
    const dateArr = dates || [];

    if (onChange) {
      onChange(dateArr.map((date) => transformMomentToString(date, format)));
    } else {
      setState((draft) => {
        draft.internalValue = dateArr.map((date) => dayjs(date, format));
      });
    }
  });

  const handleCheckChange = usePersistFn((index: number) => {
    const item = shortcuts[index];
    const result = item.onClick(dayjs);

    setState((draft) => {
      draft.internalCheckValue = index;
    });

    handleEmitChange(result);
  });

  const handleDateChange = useCallback(
    (dates) => {
      handleEmitChange(dates);
    },
    [handleEmitChange],
  );

  useDebounceWatch(
    () => {
      if (fetchValue) {
        setState((draft) => {
          draft.internalValue = (value?.length > 0 ? value : defaultValue).map((date) =>
            transformToMoment(date, format),
          );

          if (!value.length) {
            draft.internalCheckValue = undefined;
          }
        });
      }
    },
    [value],
    { ms: 16, immediate: true },
  );

  if (readOnly) {
    return (
      <div className={styles.wrapper}>
        {state.internalValue.map((v: Dayjs) => transformMomentToString(v, format)).join(' 至 ')}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <RangePicker
        {...{
          format,
          showTime,
          value: state.internalValue,
          onChange: handleDateChange,
          ...lastProps,
        }}
      />

      {!!shortcuts.length && (
        <CheckableTags
          value={state.internalCheckValue}
          options={shortcuts.map((item, index) => ({ label: item.text, value: index }))}
          className={styles.checkableTagsWrapper}
          onChange={handleCheckChange}
        />
      )}
    </div>
  );
};

export const ConvenientDateRange = React.memo(Main);

export default ConvenientDateRange;
