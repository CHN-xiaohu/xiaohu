import { connect, registerFormField, mapTextComponent, mapStyledProps } from '@formily/antd';
import type { SwitchPlusProps } from '@/components/Library/Switch';
import { SwitchPlus } from '@/components/Library/Switch';

declare global {
  interface GlobalDefaultFormSchemaLayouts {
    switch: Omit<SwitchPlusProps, 'value' | 'onChange'>;
  }
}

registerFormField(
  'switch',
  connect({
    getProps: mapStyledProps,
    getComponent: mapTextComponent,
  })(SwitchPlus),
);
