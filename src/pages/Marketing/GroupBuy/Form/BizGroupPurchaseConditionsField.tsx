import { Typography } from 'antd';
import { FormEffectHooks } from '@formily/antd';
import { ButtonList } from '@/components/Library/ButtonList';
import type { CustomizeTableProps } from '@/components/Business/Formily/components/Schemas/Fields/Table/Table';
import { createLinkageUtils } from '@/components/Business/Formily';
import { debounce } from 'lodash';

import { notEmpty } from '@/utils';

import { MathCalcul } from '@/foundations/Support/Math';

import { formActions } from './index';

export type TBizGroupPurchaseConditionsType = { num: number; price: number };
export type TBizGroupPurchaseConditions = Partial<TBizGroupPurchaseConditionsType>[];
type TExpandBizGroupPurchaseConditionsType = TBizGroupPurchaseConditionsType & {
  realFormItemIndex: number;
};

export const bizGroupPurchaseConditionsFieldPath = 'bizGroupPurchaseConditions';

export const validatorRepeat = ({
  values,
  type,
  input,
  errorMessage,
}: {
  values: TBizGroupPurchaseConditions;
  input: number;
  type: keyof TBizGroupPurchaseConditions[0];
  errorMessage: string;
}) => {
  // 重复两次才算重复
  let repeat = 0;
  for (let i = 0; i < values.length; i += 1) {
    if (values[i][type] && values[i][type] === input) {
      if (repeat) {
        return errorMessage;
      }

      repeat += 1;
    }
  }

  return '';
};

const bizGroupPurchaseConditionsItemsProperties = {
  num: {
    title: '团购数量',
    type: 'inputNumber',
    'x-rules': [
      {
        required: true,
        message: '请输入团购数量',
      },
      {
        validator: async (input: number) =>
          validatorRepeat({
            values: await formActions.getFieldValue(bizGroupPurchaseConditionsFieldPath),
            type: 'num',
            input,
            errorMessage: '当前团购数量值已存在，请重新输入',
          }),
      },
    ],
    'x-component-props': {
      placeholder: '请输入团购数量',
      min: 0,
      max: 9999,
      formatter: (value: string) => (value ? parseInt(value, 10) : value),
      addonAfter: '',
      style: {
        width: 228,
      },
    },
  },

  price: {
    title: '团购价格',
    type: 'inputNumber',
    'x-rules': [
      {
        required: true,
        message: '请输入团购价格',
      },
      {
        validator: async (input: number) =>
          validatorRepeat({
            values: await formActions.getFieldValue(bizGroupPurchaseConditionsFieldPath),
            type: 'price',
            input,
            errorMessage: '当前团购价格值已存在，请重新输入',
          }),
      },
    ],
    'x-component-props': {
      placeholder: '请输入团购价格',
      min: 0.1,
      max: 999999,
      precision: 2,
      step: 0.1,
      addonAfter: '元',
      style: {
        width: 228,
      },
    },
  },
};

const handleCompareAndCalculateMinValue = (path: string) => {
  formActions
    .getFieldValue(bizGroupPurchaseConditionsFieldPath)
    .then((result: TBizGroupPurchaseConditions) => {
      if (!result || result.length < 2) {
        return;
      }

      const ascSortDataSource = result.filter((item, index) => {
        const re = notEmpty(item.num) && notEmpty(item.price);
        if (re) {
          // 标记真实的表单项所在的索引
          (item as TExpandBizGroupPurchaseConditionsType).realFormItemIndex = index;
        }

        return re;
      }) as TExpandBizGroupPurchaseConditionsType[];

      if (ascSortDataSource.length < 2) {
        return;
      }

      // 先按数量由大到小排序
      const ascSortResult = ascSortDataSource.sort((current, next) => current.num - next.num);

      const paths = path.split('.');
      const currentFormItemIndex = Number(paths[paths.length - 2]);

      ascSortResult.reduce((prev, current, index) => {
        if (current.realFormItemIndex === currentFormItemIndex) {
          let ruleError = '';
          const next = ascSortResult[index + 1] || {};
          if (prev.price < current.price) {
            ruleError = '数量越大，金额越小';
          } else if (next.price !== undefined && current.price < next.price) {
            ruleError = '数量越小，金额越大';
          }

          formActions.setFieldState(path, (fieldState) => {
            if (ruleError) {
              fieldState.errors = [ruleError];
            } else if (fieldState.errors.length && fieldState.errors[0].indexOf('数量越') === 0) {
              fieldState.errors.splice(0, 1);
            }
          });
        }

        return current;
      }, {} as TExpandBizGroupPurchaseConditionsType);
    });
};
const handleCompareAndCalculateMinValueDebounce = debounce(handleCompareAndCalculateMinValue, 160);

const handleSetConditionsPrice = (value: number) => {
  formActions.hostUpdate(() => {
    formActions.setFieldState(`${bizGroupPurchaseConditionsFieldPath}.*.price`, (fieldState) => {
      fieldState.props!['x-component-props']!.max = new MathCalcul(value).minus(0.1).toNumber();
    });
  });
};
const handleSetConditionsPriceDebounce = debounce(handleSetConditionsPrice, 300);

export const useBizGroupPurchaseConditionsEffects = ({
  unitFieldPath,
  priceFieldPath,
}: {
  unitFieldPath: string;
  priceFieldPath: string;
}) => {
  const linkage = createLinkageUtils();

  FormEffectHooks.onFieldValueChange$(unitFieldPath).subscribe((fieldState) => {
    bizGroupPurchaseConditionsItemsProperties.num['x-component-props'].addonAfter =
      fieldState.value;

    linkage.hostUpdate(() => {
      linkage.xComponentProp(
        `${bizGroupPurchaseConditionsFieldPath}.*.num`,
        'addonAfter',
        fieldState.value,
      );
    });
  });

  FormEffectHooks.onFieldValueChange$(priceFieldPath).subscribe((fieldState) => {
    handleSetConditionsPriceDebounce(fieldState.value);
  });

  FormEffectHooks.onFieldInputChange$(`${bizGroupPurchaseConditionsFieldPath}.*.price`).subscribe(
    (fieldState) => {
      handleCompareAndCalculateMinValueDebounce(fieldState.path);
    },
  );

  FormEffectHooks.onFieldInputChange$(`${bizGroupPurchaseConditionsFieldPath}.*.num`).subscribe(
    (fieldState) => {
      handleCompareAndCalculateMinValueDebounce(fieldState.path.replace(/num/g, 'price'));
    },
  );
};

export const bizGroupPurchaseConditionsSchema = {
  title: '阶梯团条件',
  type: 'customizeTable',
  maxItems: 5,
  'x-rules': {
    required: true,
    message: '请添加阶梯团条件',
  },
  'x-props': {
    wrapperCol: { span: 18 },
  },
  'x-component-props': {
    tableProps: {
      bordered: true,
    },
    autoHideFooterNodeWhenLimit: true,
    renderFooter: ({ add, editable }) => (
      <div
        style={{
          border: '1px solid #f0f0f0',
          borderTop: 'none',
          padding: 24,
          textAlign: 'center',
          display: editable ? '' : 'none',
        }}
      >
        <a onClick={() => add()}>+ 添加团购条件</a>
        <Typography.Text type="secondary">（最多可设置5个阶梯）</Typography.Text>
      </div>
    ),
    renderOperation: ({ remove }) => (
      <ButtonList
        isLink
        list={[
          {
            text: '删除',
            popconfirmProps: {
              title: '确定需要删除嘛？',
              okText: '确定',
              cancelText: '取消',
              onConfirm: () => {
                remove();
              },
            },
          },
        ]}
      />
    ),
  } as CustomizeTableProps,
  items: {
    type: 'object',
    properties: bizGroupPurchaseConditionsItemsProperties,
  },
};
