import { useMemo } from 'react';
import { Row, Col } from 'antd';
import type { ISchemaFieldComponentProps } from '@formily/antd';
import { SchemaField, FormPath } from '@formily/antd';
import type { PropertyColumns } from '@/pages/Product/Api';
import { isStr, isArr } from '@/utils';

import type { TSchema } from '@/components/Business/Formily';

import styles from './index.less';

import {
  getFieldSchemaByOptionType,
  handleFormatDefaultValue,
  getValueAndIdDataFromFieldPropByOption,
} from './help';

type ComponentProps = {
  dataSource: PropertyColumns[];
  initialParamDataSourceMap: Record<
    string,
    {
      id: string;
      value: string;
    }
  >;
};

type GridLayouts = Record<
  string,
  (TSchema & { currentFieldRealIndex: number; currentFieldRealId: string })[]
>;

// 一行多少个
const rowLimit = 3;

const Main = ({ path, schema }: ISchemaFieldComponentProps) => {
  const {
    dataSource = [],
    initialParamDataSourceMap = {},
  } = schema.getExtendsComponentProps() as ComponentProps;

  const gridLayouts = useMemo(
    (): GridLayouts =>
      dataSource.reduce((previous, item, index) => {
        const clacCurrentGridIndex = index / rowLimit;
        const currentGridIndex = parseInt(String(clacCurrentGridIndex), 10);

        const currentSchema = getFieldSchemaByOptionType(item);

        // 获取当前项的默认值
        const currentDefaultParam = initialParamDataSourceMap[item.id] || {};

        // 处理格式化默认值
        const defaultValue = handleFormatDefaultValue(currentDefaultParam);

        if (isArr(currentSchema.enum)) {
          const defaultValues = isArr(defaultValue) ? defaultValue : [defaultValue];

          defaultValues.forEach((v) => {
            if (v && !currentSchema.enum.some((vv: any) => vv.value === v)) {
              const result = getValueAndIdDataFromFieldPropByOption(v);

              currentSchema.enum.push({ label: result[0], value: v });
            }
          });
        }

        // 当前数据项完整的 schema 描述
        const currentFullSchema = {
          title: item.name,
          default: item.optionType === 2 && isStr(defaultValue) ? [defaultValue] : defaultValue,
          currentFieldRealIndex: index,
          currentFieldRealId: item.id,
          'x-rules': {
            required: !!item.required,
            message: `请选择${item.name}`,
          },
          ...currentSchema,
          'x-component-props': {
            placeholder: `请选择${item.name}`,
            ...currentSchema['x-component-props'],
          },
        };

        if (previous[currentGridIndex]) {
          previous[currentGridIndex].push(currentFullSchema);
        } else {
          previous[currentGridIndex] = [currentFullSchema];
        }

        return previous;
      }, {}),
    [dataSource, initialParamDataSourceMap],
  );

  return (
    <div className={styles.wrapper}>
      {Object.keys(gridLayouts).map((key) => {
        return (
          <Row key={key} gutter={24}>
            {gridLayouts[key].map((currentSchema) => (
              <Col key={currentSchema.currentFieldRealIndex} span={24 / rowLimit}>
                <SchemaField
                  path={FormPath.parse(path).concat(
                    `specification_${currentSchema.currentFieldRealId}`,
                  )}
                  schema={currentSchema as any}
                />
              </Col>
            ))}
          </Row>
        );
      })}
    </div>
  );
};

Main.isFieldComponent = true;

export const ParamsList = Main;
