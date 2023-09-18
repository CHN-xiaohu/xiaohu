import { forwardRef } from 'react';
import type { Dayjs } from 'dayjs';

import type { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import type { Omit } from 'antd/es/_util/type';

import { DatePicker } from './DatePicker';

export type TimePickerProps = Omit<PickerTimeProps<Dayjs>, 'picker'>;

export const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => (
  <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

TimePicker.displayName = 'TimePicker';

export default TimePicker;
