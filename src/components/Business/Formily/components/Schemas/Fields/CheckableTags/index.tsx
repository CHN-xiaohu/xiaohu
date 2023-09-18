import { mapStyledProps, connect, registerFormField } from '@formily/antd';

import type { CheckableTagsProps } from '@/components/Library/CheckableTags';
import { CheckableTags } from '@/components/Library/CheckableTags';

declare global {
  interface GlobalFormSchemaComponentType {
    checkableTags: Omit<CheckableTagsProps, 'value' | 'onChange'>;
  }
}

registerFormField(
  'checkableTags',
  connect({
    getProps: mapStyledProps,
  })(CheckableTags),
);
