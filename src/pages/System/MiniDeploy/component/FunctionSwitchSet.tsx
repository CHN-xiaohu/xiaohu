import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createFormActions } from '@formily/antd';
import { message } from 'antd';

import { changeFunctionSwitch } from '../Api';

const switchProps = () => ({
  type: 'number',
  default: 1,
  'x-component': 'switch',
  'x-component-props': {
    activeValue: 1,
    inactiveValue: 0,
    checkedChildren: '显示',
    unCheckedChildren: '隐藏',
  },
});

const functionSwitchSeted = {
  isShowCommodityPrice: {
    title: '商品价格',
    ...switchProps(),
    'x-linkages': [
      {
        type: 'value:visible',
        condition: '{{ !!$self.value }}',
        target: '*(isShowAddShoppingCart,isShowBuyNow,isShowNavigationShoppingCart)',
      },
      {
        type: 'value:visible',
        condition: '{{ !$self.value }}',
        target: '*(priceHideTitle)',
      },
    ],
  },
  priceHideTitle: {
    title: '价格显示文案',
    type: 'string',
    default: '到店详询',
    'x-component-props': {
      maxLength: 8,
    },
    description: '可用当前文案替换商品价格，如¥到店详询，若不需显示则不填即可',
    editable: true,
  },
  isShowAddShoppingCart: {
    title: '加入购物车',
    ...switchProps(),
  },
  isShowBuyNow: {
    title: '立即购买',
    ...switchProps(),
  },
  isShowNavigationShoppingCart: {
    title: '导航购物车',
    ...switchProps(),
  },
};

const submitProps = {
  formButtonList: {
    type: 'object',
    'x-component': 'formButtonGroup',
    'x-component-props': {
      sticky: false,
    },
    properties: {
      cancelButton: {
        type: 'cancelButton',
        'x-component-props': {
          children: '重置',
          style: {
            marginTop: '4px',
          },
        },
      },
      buttonGroup: {
        type: 'submitButton',
        'x-component-props': {
          children: '保存',
        },
      },
    },
  },
};

export const FunctionSwitchSeted = ({
  minFunctionSwitch,
  handleGetMinFunctionSwitch,
  schemaProps,
  config,
}: {
  minFunctionSwitch: AnyObject;
  handleGetMinFunctionSwitch: () => void;
  schemaProps: AnyObject;
  config: number;
}) => {
  const formActions = createFormActions();

  const handleChangeFunctionSwitchSumbit = (values: any) => {
    const synchronousHidden = {
      isShowAddShoppingCart: 0,
      isShowBuyNow: 0,
      isShowNavigationShoppingCart: 0,
    };

    const filterValues = Object.keys(values).reduce((item, key) => {
      if (values[key] !== undefined) {
        item[key] = values[key];
      }
      return item;
    }, {});

    const requestData = values.isShowCommodityPrice
      ? { ...minFunctionSwitch, ...filterValues }
      : { ...minFunctionSwitch, ...synchronousHidden, ...filterValues };

    changeFunctionSwitch({ ...requestData, configType: config }).then(() => {
      message.success('配置成功！');
      // 重新触发请求获取最新数据
      handleGetMinFunctionSwitch();
    });
  };

  const functionSwitchProps: NormalFormProps = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
    actions: formActions,
    value: minFunctionSwitch,
    schema: { ...functionSwitchSeted, ...schemaProps, ...submitProps },
    onSubmit: handleChangeFunctionSwitchSumbit,
  };

  return <SchemaForm {...functionSwitchProps} />;
};
