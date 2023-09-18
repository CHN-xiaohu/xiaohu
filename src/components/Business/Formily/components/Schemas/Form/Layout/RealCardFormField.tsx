import * as React from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd/lib/card';
import type { ISchemaFieldComponentProps } from '@formily/antd';
import { registerFormField, SchemaField } from '@formily/antd';

declare global {
  interface GlobalFormSchemaComponentType {
    realCardFormField: CardProps;
  }
}

export const Wrapper: React.FC<ISchemaFieldComponentProps> = ({ schema }) => {
  return (
    <Card {...schema['x-component-props']}>
      {schema.mapProperties((item) => (
        <SchemaField schema={item} key={item.key} path={item.path} />
      ))}
    </Card>
  );
};

registerFormField('realCardFormField', Wrapper);
