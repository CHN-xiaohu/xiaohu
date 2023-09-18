import type { TSchemas } from '@/components/Business/Formily';

import { addOrderLogRemark, editSupplyOrderMessage, updateSalesOrderRemark } from '../../Api';

export const handleAddOrderLogRemarkRequest = (values: any) => {
  const isBrandSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');
  const isPurchaseOrder = window.location.pathname.includes('/orders/purchase');
  const isSalesOrder = window.location.pathname.includes('/orders/sales');

  if (values.reasonRemark) {
    values.reason = values.reasonRemark;
    delete values.reasonRemark;
  }
  if (isBrandSupplierOrder) {
    values.remark = values.content;
    values.content = undefined;
    values.logType = undefined;
    values.orderType = undefined;
    values.purchaseOrderId = undefined;
  }
  if (isPurchaseOrder) {
    values.purchaseOrderId = values.id;
    values.id = undefined;
  }

  if (isSalesOrder) {
    values.salsesOrderId = values.id;
    values.id = undefined;
  }

  return {
    request: isBrandSupplierOrder
      ? editSupplyOrderMessage
      : isSalesOrder
      ? updateSalesOrderRemark
      : addOrderLogRemark,
    values: {
      logType: 7,
      orderType: 1,
      ...values,
    },
  };
};

// 备注订单
export const addOrderLogRemarkFields: TSchemas = {
  addOrderLogRemark: {
    type: 'virtualBox',
    visible: false,
    properties: {
      content: {
        title: '备注订单',
        type: 'textarea',
        required: true,
        'x-component-props': {
          placeholder: '请输入订单备注, 上限 500 个字符',
        },
        'x-rules': { range: [1, 500], message: '请输入订单备注, 上限 500 个字符' },
      },
    },
  },
};
