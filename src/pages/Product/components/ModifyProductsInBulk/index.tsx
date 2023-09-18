import { useModalForm } from '@/components/Business/Formily';

import type { ISchemaFieldComponentProps } from '@formily/antd';

import { modifyInventoryInBulk, batchModifyInventoryWarning } from '../../Api/distribution';

type Props = {
  onAddSuccess: () => void;
};

const CONMMON_PROPS = {
  min: 0,
  max: 999999,
  precision: 0,
  addonAfter: '件',
  className: 'product-price__input-number--wrapper',
};

const StockRemarks = ({ value }: ISchemaFieldComponentProps) => {
  return <div>{value}</div>;
};

export const useEditStockForm = ({ onAddSuccess }: Props) => {
  const handleSubmit = (values: any) => modifyInventoryInBulk(values).then(onAddSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    isNativeAntdStyle: true,
    components: {
      StockRemarks,
    },
    onSubmit: handleSubmit,
    schema: {
      productInfoIds: {
        type: 'string',
        display: false,
      },
      stock: {
        title: '商品库存',
        type: 'inputNumber',
        'x-component-props': {
          ...CONMMON_PROPS,
        },
        'x-rules': {
          required: true,
          message: '请输入商品库存',
        },
      },
      remarks: {
        title: '注',
        type: 'string',
        'x-component': 'StockRemarks',
        default: '商品有多个sku,则全部sku的库存都统一设置为当前库存值',
        'x-rules': {
          required: true,
        },
      },
    },
  });

  const handleOpenEditStockForm = (initialValues = {} as any) => {
    openModalForm({
      title: '批量修改商品库存',
      initialValues,
    });
  };
  return {
    handleOpenEditStockForm,
    ModalStockElement: ModalFormElement,
  };
};

export const useEditWarningForm = ({ onAddSuccess }: Props) => {
  const handleSubmit = (values: any) => batchModifyInventoryWarning(values).then(onAddSuccess);

  const { openModalForm, ModalFormElement } = useModalForm({
    isNativeAntdStyle: true,
    onSubmit: handleSubmit,
    schema: {
      productInfoIds: {
        type: 'string',
        display: false,
      },
      warning: {
        title: '商品预警',
        type: 'inputNumber',
        'x-component-props': {
          ...CONMMON_PROPS,
          min: 1,
          max: 99,
        },
        'x-rules': {
          required: true,
          message: '请输入商品库存预警值',
        },
      },
    },
  });

  const handleOpenEditWarningForm = (initialValues = {} as any) => {
    openModalForm({
      title: '批量修改商品预警',
      initialValues,
    });
  };
  return {
    handleOpenEditWarningForm,
    ModalWarningElement: ModalFormElement,
  };
};
