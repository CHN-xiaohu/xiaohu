import type { Dayjs } from 'dayjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generateCalendar from 'antd/es/calendar/generateCalendar';
import 'antd/es/calendar/style';

export const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export default Calendar;
