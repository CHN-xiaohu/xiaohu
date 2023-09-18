import type { TSchemas } from '@/components/Business/Formily';

import { orderRefund, refundSalesOrder, refundSupplierOrder } from '../../Api';

export const handleReimburseRequest = (values: any) => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');

  const { orderProducts = [], ...lastValues } = values;

  if (lastValues.refundReasonRemark) {
    lastValues.refundReason = lastValues.refundReasonRemark;
    delete lastValues.refundReasonRemark;
  }

  delete lastValues.id;

  const reqParam = {
    ...lastValues,
    productOrderIds: (orderProducts as any[]).map((product: any) => product.id).join(','),
    orderId: lastValues.orderId,
  };

  const salesReqParam = {} as any;
  if (isSalesOrder) {
    salesReqParam.ids = reqParam.productOrderIds;
    salesReqParam.reason = reqParam.refundReason;
  } else {
    reqParam.productOrderIds = (orderProducts as any[]).map((product: any) => product.id);
  }

  return {
    request: isSupplierOrder ? refundSupplierOrder : isSalesOrder ? refundSalesOrder : orderRefund,
    values: isSalesOrder ? salesReqParam : reqParam,
  };
};

// 订单退款
export const reimburseFields: TSchemas = {
  reimburse: {
    type: 'virtualBox',
    visible: false,
    properties: {
      orderProducts: {
        type: 'string',
        display: false,
      },
      orderId: {
        type: 'string',
        display: false,
      },
      refundReason: {
        title: '退款原因',
        type: 'string',
        enum: ['商家断货', '拍错了', '其他'].map((value) => ({ value, label: value })),
        'x-component-props': {
          placeholder: '请选择退款原因',
        },
        'x-rules': { required: true, message: '请选择退款原因' },
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === "其他" }}',
            target: 'reimburse.refundReasonRemark',
          },
        ],
      },
      refundReasonRemark: {
        title: ' ',
        type: 'textarea',
        display: false,
        'x-props': {
          itemClassName: 'not__form-item-colon',
        },
        'x-component-props': {
          placeholder: '请输入退款原因, 上限 500 个字符',
        },
        'x-rules': { range: [1, 500], message: '请输入退款原因, 上限 500 个字符' },
      },
    },
  },
};
