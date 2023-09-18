import { connect, mapStyledProps, mapTextComponent } from '@formily/antd';
import dayjs from 'dayjs';
import { dynamic } from 'umi';

const AntdTimePicker = dynamic({
  loader: () =>
    import(/* webpackChunkName: 'schema-field-TimePicker' */ '@/components/Antd/TimePicker'),
});

export const TimePicker = connect({
  getValueFromEvent(_, value) {
    return value;
  },
  getProps: (props: any, fieldProps) => {
    const { value, disabled = false } = props;
    try {
      if (!disabled && value) {
        props.value = dayjs(value, 'HH:mm:ss');
      }
    } catch (e) {
      throw new Error(e);
    }
    mapStyledProps(props, fieldProps);
  },
  getComponent: mapTextComponent,
})(AntdTimePicker);
