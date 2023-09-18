import type { TSchemas } from '@/components/Business/Formily';

import { updateOrderDetail, updateOptainMessage, editSupplyOrderMessage } from '../../Api';

export const handleCustomerNameRequest = (values: any) => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');

  return {
    request: isSupplierOrder
      ? editSupplyOrderMessage
      : isSalesOrder
      ? updateOptainMessage
      : updateOrderDetail,
    values,
  };
};

// 收货人姓名修改
export const customerNameFields: TSchemas = {
  customerName: {
    visible: false,
    title: '收货人姓名',
    type: 'string',
    'x-component-props': {
      placeholder: '请输入收货人姓名',
    },
    'x-rules': {
      required: true,
      message: '请输入收货人姓名',
    },
  },
};
