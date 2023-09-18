// 引入自定义封装的 Formily 全局组件
import '@/components/Business/Formily/Registry';

import { registerFormFields } from '@formily/antd';
import {
  Input,
  Switch,
  // ArrayCards,
  Transfer,
  Checkbox,
  NumberPicker,
  Password,
  Radio,
  Range,
  Rating,
} from '@formily/antd-components';

import '@formily/antd-components/esm/form-step/style';

import {
  DatePicker,
  TimePicker,
} from '@/components/Business/Formily/components/Schemas/Fields/DateAndTime';

import type { SwitchProps } from 'antd/lib/switch';
import type { CheckboxGroupProps } from 'antd/lib/checkbox';
import type {
  DatePickerProps,
  RangePickerProps,
  MonthPickerProps,
  WeekPickerProps,
} from 'antd/lib/date-picker';
import type { InputNumberProps } from 'antd/lib/input-number';
import type { RadioGroupProps } from 'antd/lib/radio';
import type { RateProps } from 'antd/lib/rate';
import type { InputProps } from 'antd/lib/input';
import type { TextAreaProps } from 'antd/es/input';
import type { TimePickerProps } from 'antd/lib/time-picker';
import type { TransferProps } from 'antd/lib/transfer';
import type { SelectProps } from 'antd/lib/select';

import type { IPasswordProps } from '@formily/antd-components/esm/password';
import type { SliderBaseProps } from 'antd/lib/slider';

import '@formily/antd-components/esm/form-step';

export type InternalFieldTypes = {
  boolean: SwitchProps | SelectProps<any>;
  checkbox: CheckboxGroupProps;

  date: DatePickerProps;
  daterange: RangePickerProps;
  month: MonthPickerProps;
  week: WeekPickerProps;
  year: DatePickerProps;
  time: TimePickerProps;

  number: InputNumberProps | SelectProps<any>;
  radio: RadioGroupProps;
  rating: RateProps;

  string: InputProps | SelectProps<any>;
  textarea: TextAreaProps | SelectProps<any>;
  transfer: TransferProps<any>;
  password: IPasswordProps;
  range: SliderBaseProps;
};

export const setup = () => {
  console.log('setup success');

  registerFormFields({
    transfer: Transfer,
    boolean: Switch,
    // array: ArrayCards,
    // cards: ArrayCards,
    checkbox: Checkbox.Group,

    // 日期/时间相关
    time: TimePicker,
    date: DatePicker,
    daterange: DatePicker.RangePicker,
    year: DatePicker.YearPicker,
    month: DatePicker.MonthPicker,
    week: DatePicker.WeekPicker,

    string: Input,
    textarea: Input.TextArea,
    number: NumberPicker,
    password: Password,
    radio: Radio.Group,
    range: Range,
    rating: Rating,
  });
};
