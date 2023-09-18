import { registerFormField } from '@formily/antd';

import type { CustomizeTableProps } from './Table';
import { TableField } from './Table';

declare global {
  interface GlobalFormSchemaComponentType {
    customizeTable: CustomizeTableProps;
  }
}

registerFormField('customizeTable', TableField);
