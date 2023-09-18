import { useEffect } from 'react';
import type { ISchemaFieldComponentProps } from '@formily/antd';
import { SchemaField, FormPath, createEffectHook } from '@formily/antd';
import type { PropertyColumns } from '@/pages/Product/Api';

import { useDebounceByMemo } from '@/foundations/hooks';

import styles from './index.less';

export * from './Item';

type ComponentProps = {
  dataSource: PropertyColumns[];
  defaultCheckAttributes: Record<
    string,
    {
      id: string;
      value: string;
    }
  >;
};

type SelectedSpecificationAttributePayload = {
  selectedRows: PropertyColumns;
  selectedRowKeys: {
    label: string;
    value: string;
    parent_id: string;
    parent_name: string;
  }[];
};

// 定义副作用事件
const ON_SELECTED_SPECIFICATION_ATTRIBUTE = 'ON_SELECTED_SPECIFICATION_ATTRIBUTE';
export const onSelectedSpecificationAttribute$ = createEffectHook<SelectedSpecificationAttributePayload>(
  ON_SELECTED_SPECIFICATION_ATTRIBUTE,
);

const Main = ({ path, schema, form }: ISchemaFieldComponentProps) => {
  const {
    dataSource = [],
    defaultCheckAttributes = {},
  } = schema.getExtendsComponentProps() as ComponentProps;

  const handleCheckAttributeChangeDebounce = useDebounceByMemo(
    (
      source: SelectedSpecificationAttributePayload['selectedRows'],
      labelInValues: SelectedSpecificationAttributePayload['selectedRowKeys'],
    ) => {
      form.notify(ON_SELECTED_SPECIFICATION_ATTRIBUTE, {
        selectedRows: source,
        selectedRowKeys: labelInValues,
      });
    },
  );

  // todo: 这里会跟下面的执行有多余的设置，后面优化下
  useEffect(() => {
    dataSource.forEach((item, index) => {
      form.setFieldState(FormPath.parse(path).concat(index), (fieldState) => {
        fieldState.props.title = item.name;

        fieldState.props['x-component-props'] = {
          ...fieldState.props['x-component-props'],
          name: item.name,
          dataSource: item,
          defaultValue: defaultCheckAttributes[item.id] || [],
          options: item?.propVals?.map((val) => ({
            label: val.name,
            value: val.id,
            parent_id: item.id,
            parent_name: item.name,
          })),
        };

        fieldState.props['x-rules'] = {
          required: !!item.required,
          message: `请选择${item.name || '该项'}选项`,
        };
      });
    });
  }, [dataSource]);

  return (
    <div className={styles.wrapper}>
      {dataSource.map((item, index) => {
        return (
          <SchemaField
            key={item.id}
            path={FormPath.parse(path).concat(index)}
            schema={
              {
                title: item.name || ' ',
                type: 'specification',
                'x-component-props': {
                  name: item.name,
                  dataSource: item,
                  defaultValue: defaultCheckAttributes[item.id],
                  options: item?.propVals?.map((val) => ({
                    label: val.name,
                    value: val.id,
                    parent_id: item.id,
                    parent_name: item.name,
                  })),
                  onCheckAttributeChange: handleCheckAttributeChangeDebounce,
                },
                'x-rules': {
                  required: !!item.required,
                  message: `请选择${item.name || '该项'}选项`,
                },
              } as any
            }
          />
        );
      })}
    </div>
  );
};

Main.isFieldComponent = true;

export const SpecificationGroups = Main;
