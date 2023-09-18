import type { TSchemas } from '@/components/Business/Formily';

import { orderCancel, cancelSalesOrder, cancelSupplierOrder } from '../../Api';

export const handleCancelOrderRequest = (values: any) => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isSupplierOrder = window.location.pathname.includes('/orders/supplier');
  const isBrandSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');
  if (values.reasonRemark) {
    values.reason = values.reasonRemark;
    delete values.reasonRemark;
  }

  return {
    request:
      isSupplierOrder || isBrandSupplierOrder
        ? cancelSupplierOrder
        : isSalesOrder
        ? cancelSalesOrder
        : orderCancel,
    values,
  };
};

// 取消订单
export const cancelOrderFields: TSchemas = {
  cancel: {
    type: 'virtualBox',
    visible: false,
    properties: {
      supplyCancelTips: {
        type: 'supplyCancelTips' as any,
        display: window.location.pathname.includes('/orders/supplier'),
      },
      reason: {
        title: '取消订单的原因',
        type: 'string',
        enum: ['商家取消', '其他'],
        'x-rules': { required: true, message: '请选择取消订单类型' },
        'x-component-props': {
          placeholder: '请选择取消订单类型',
        },
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === "其他" }}',
            target: 'cancel.reasonRemark',
          },
        ],
      },
      reasonRemark: {
        title: ' ',
        type: 'textarea',
        display: false,
        'x-props': {
          itemClassName: 'not__form-item-colon',
        },
        'x-component-props': {
          placeholder: '请输入取消原因, 上限 500 个字符',
        },
        'x-rules': { range: [1, 500], message: '请输入取消原因, 上限 500 个字符' },
      },
    },
  },
};
