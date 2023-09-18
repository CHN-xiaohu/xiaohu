import type { IFormAsyncActions } from '@formily/antd';

// 避免依赖循环时的优先加载问题
export const skuFormPath = 'formLayout.skuFullLayout.skuLayout';

export const generatePriceSchema = (
  getExpandColumnsFieldMap: () => AnyObject,
  getExpandColumnsMap: () => AnyObject,
) => {
  const { minimumSale, stock, ...last } = getExpandColumnsFieldMap();

  minimumSale.type = 'inputNumber';
  minimumSale['x-component-props'].disabled = true;
  delete minimumSale.editable;

  last.supplyPrice['x-component-props'].disabled = true;
  delete last.supplyPrice.editable;

  stock['x-component-props'].disabled = true;
  delete stock.editable;

  const expandColumnsMapValue = getExpandColumnsMap();

  const warning = {
    title: '库存预警',
    type: 'inputNumber',
    default: 1,
    'x-component-props': {
      addonAfter: '件',
      max: 99,
      min: 1,
      placeholder: '请输入库存预警',
      precision: 0,
    },
    'x-rules': {
      message: '请输入库存预警值',
    },
  };

  return Object.keys(expandColumnsMapValue).reduce(
    (prve, key) => {
      prve[key].title = expandColumnsMapValue[key].title;

      if (key !== 'minimumSale' && key !== 'warning') {
        prve[key]['x-component-props'].addonAfter = '元';
        prve.stock['x-component-props'].addonAfter = '件';

        if (prve[key]['x-component-props'].placeholder) {
          prve[key]['x-component-props'].placeholder = prve[key][
            'x-component-props'
          ].placeholder.replace('(元)', '');
        }
      }

      return prve;
    },
    {
      ...last,
      stock,
      warning,
      minimumSale,
    },
  );
};

export const filterMinimumSaleAndSupplyPriceField = (props: AnyObject) => {
  return Object.keys(props).reduce((p, c) => {
    if (!['minimumSale', 'supplyPrice'].includes(c)) {
      p[c] = props[c];
    }

    return p;
  }, {});
};

export const handleBatchSetting = ({
  formActions,
  specificationTableFormPath,
  columnInputValues,
  selectedRowIndexs,
}: {
  formActions: IFormAsyncActions;
  specificationTableFormPath: string;
  columnInputValues: AnyObject;
  selectedRowIndexs: number[];
}) => {
  for (let i = 0; i < selectedRowIndexs.length; i += 1) {
    Object.keys(columnInputValues).forEach((key) => {
      formActions.setFieldState(
        `${specificationTableFormPath}.${selectedRowIndexs[i]}.${key}`,
        (field) => {
          field.value = columnInputValues[key];
        },
      );
    });
  }
};
