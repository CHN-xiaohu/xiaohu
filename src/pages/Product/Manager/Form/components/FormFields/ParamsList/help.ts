import type { PropertyColumns } from '@/pages/Product/Api';
import type { TSchemas } from '@/components/Business/Formily';

const GRID_LIMIT = 3;

export const generateGridLayout = (limit = GRID_LIMIT) => ({
  type: 'object',
  'x-component': 'grid',
  'x-component-props': {
    gutter: 24,
    cols: [...Array(GRID_LIMIT)].map(() => 24 / limit),
  },
  properties: {},
});

const FIELD_PROP_VALUE_JOIN_ID = '##++==##';
export const generateFieldPropByOption = (value: string, id: string) =>
  `${value}${FIELD_PROP_VALUE_JOIN_ID}${id}`;

export const getValueAndIdDataFromFieldPropByOption = (str: string) =>
  (str || FIELD_PROP_VALUE_JOIN_ID).split(FIELD_PROP_VALUE_JOIN_ID);

export const getFieldSchemaByOptionType = (item: PropertyColumns): TSchemas =>
  ({
    1: {
      type: 'string',
      enum: item.propVals.map((prop) => ({
        label: prop.name,
        value: generateFieldPropByOption(prop.name, prop.id),
      })),
      'x-component-props': {
        showSearch: true,
        allowClear: !item.required,
      },
    },

    2: {
      type: 'string',
      enum: item.propVals.map((prop) => ({
        label: prop.name,
        value: generateFieldPropByOption(prop.name, prop.id),
      })),
      'x-component-props': {
        showSearch: true,
        mode: 'multiple',
      },
    },

    3: {
      type: 'string',
      'x-component-props': {
        placeholder: `请输入${item.name}`,
      },
      'x-rules': [
        {
          required: !!item.required,
          message: `请输入${item.name}`,
        },
        {
          max: 30,
          message: `${item.name} 最大长度为 30 位`,
        },
      ],
    },
  }[item.optionType]);

// 处理格式化默认值
export const handleFormatDefaultValue = (defaultParamValue: {
  id: string;
  value: string;
}): string | string[] | undefined => {
  if (defaultParamValue.id) {
    if (defaultParamValue.id.includes(',')) {
      const ids = defaultParamValue.id.split(',') as string[];
      const vals = defaultParamValue.value.split(',') as string[];

      // 增加标识用于判断是新增值还是已存在的值
      return ids.map((id, idx) => generateFieldPropByOption(vals[idx], id));
    }

    // 增加标识用于判断是新增值还是已存在的值
    return generateFieldPropByOption(defaultParamValue.value, defaultParamValue.id);
  }

  return undefined;
};
