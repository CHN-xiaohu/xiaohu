/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 仿照 formily 原有组件，将 dayjs 替换为 dayjs
|
*/

import { connect, mapStyledProps, mapTextComponent } from '@formily/antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { DatePicker as AntdDatePicker } from '@/components/Antd';

import { compose, isStr, isArr } from '@/utils';

const YearPicker = (props: any) => <AntdDatePicker {...props} mode="year" />;

const transformDayjs = (value: Dayjs | '', format = 'YYYY-MM-DD HH:mm:ss') => {
  if (value === '') {
    return undefined;
  }

  return value && value.format ? value.format(format) : value;
};

const mapDayjsValue = (props: any, fieldProps: any) => {
  const { value, showTime = false } = props;
  if (!fieldProps.editable) return props;
  try {
    if (isStr(value) && value) {
      props.value = dayjs(value, showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
    } else if (isArr(value) && value.length) {
      props.value = value.map(
        (item) => (item && dayjs(item, showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')) || '',
      );
    }
  } catch (e) {
    throw new Error(e);
  }
  return props;
};

export const DatePicker = connect<'RangePicker' | 'MonthPicker' | 'YearPicker' | 'WeekPicker'>({
  getValueFromEvent(_, value) {
    const props = (this as any).props || {};
    return transformDayjs(value, props.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD');
  },
  getProps: compose(mapStyledProps, mapDayjsValue),
  getComponent: mapTextComponent,
})(AntdDatePicker);

DatePicker.RangePicker = connect({
  getValueFromEvent(_, [startDate, endDate]) {
    const props = (this as any).props || {};
    const format = props.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    return [transformDayjs(startDate, format), transformDayjs(endDate, format)];
  },
  getProps: compose(mapStyledProps, mapDayjsValue),
  getComponent: mapTextComponent,
})(AntdDatePicker.RangePicker);

DatePicker.MonthPicker = connect({
  getValueFromEvent(_, value) {
    return transformDayjs(value);
  },
  getProps: compose(mapStyledProps, mapDayjsValue),
  getComponent: mapTextComponent,
})(AntdDatePicker.MonthPicker);

DatePicker.WeekPicker = connect({
  getValueFromEvent(_, value) {
    return transformDayjs(value, 'gggg-wo');
  },
  getProps: compose(mapStyledProps, (props: any) => {
    if (isStr(props.value) && props.value) {
      const parsed = props.value.match(/\D*(\d+)\D*(\d+)\D*/) || ['', '', ''];
      props.value = dayjs(parsed[1], 'YYYY').add(parsed[2] - 1, 'week');
    }
    return props;
  }),
  getComponent: mapTextComponent,
})(AntdDatePicker.WeekPicker);

DatePicker.YearPicker = connect({
  getValueFromEvent(_, value) {
    return transformDayjs(value, 'YYYY');
  },
  getProps: compose(mapStyledProps, mapDayjsValue),
  getComponent: mapTextComponent,
})(YearPicker);

export default DatePicker;
