/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 将一些常用的 form schema 固定住，这样可以方便随处使用，减少样板代码
|
*/

/**
 * 带有快捷选项的日期时间区间选择器
 */
export const convenientDateRangeSchema = (params: { title?: string } = {}) => {
  const { title = '时间区间' } = params;

  return {
    title,
    type: 'convenientDateRange' as 'convenientDateRange',
    col: 16,
    'x-props': {
      itemClassName: 'search-form__convenientDateRange',
    },
  };
};

type IOther = {
  label: string;
  value: string | number | boolean | undefined | null;
};

export const generateDefaultSelectOptions = (
  other: IOther[] = [],
  defaultValue: IOther['value'] = undefined,
) => [{ label: '全部', value: defaultValue }, ...other];
