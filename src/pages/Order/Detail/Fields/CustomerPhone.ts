import type { TSchemas } from '@/components/Business/Formily';

import { updateOrderDetail, updateOptainMessage, editSupplyOrderMessage } from '../../Api';

export const handleCustomerPhoneRequest = (values: any) => {
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

// 收货人手机号码修改
export const customerPhoneFields: TSchemas = {
  customerPhone: {
    visible: false,
    title: '收货人手机号码',
    type: 'string',
    'x-component-props': {
      placeholder: '请输入收货人电话',
    },
    'x-rules': [{ required: true, message: '请输入收货人电话' }, { phone: true }],
  },
};
