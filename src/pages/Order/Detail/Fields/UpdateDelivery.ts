import type { TSchemas } from '@/components/Business/Formily';

import { sameCitySchema, expressDeliverySchema } from './Delivery';

import { updateDeliveryInfo, updateExpressMessage, updateSupplierOrderExpress } from '../../Api';

export const handleUpdateDeliveryRequest = (values: any) => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');

  if (Number(values.messageType) === 1) {
    values.informations =
      values?.addOrderNum?.length > 1
        ? values?.addOrderNum?.map((item: any) => item.num).join(',')
        : values?.addOrderNum[0]?.num;
    values.addOrderNum = undefined;
  }
  if (isSalesOrder) {
    values.purchaseOrderId = undefined;
  } else if (isSupplierOrder) {
    values.supplierOrderProductIds = values.purchaseOrderProductIds;
    values.purchaseOrderId = undefined;
    values.purchaseOrderProductIds = undefined;
  } else {
    values.purchaseOrderId = values.id;
  }

  values.addOrderNum = undefined;
  values.informations =
    typeof values.informations === 'string' ? [values.informations] : values.informations;

  delete values.id;

  return {
    request: isSupplierOrder
      ? updateSupplierOrderExpress
      : isSalesOrder
      ? updateExpressMessage
      : updateDeliveryInfo,
    values,
  };
};

// 修改发货信息
export const updateDeliveryFields: TSchemas = {
  updateDelivery: {
    type: 'virtualBox',
    visible: false,
    properties: {
      // 勾选发货的商品
      purchaseOrderProductIds: {
        type: 'string',
        display: false,
      },
      // 配送类型
      messageType: {
        type: 'string',
        display: false,
        'x-linkages': [
          {
            type: 'value:visible',
            condition: '{{ $self.value === 1 }}',
            target: 'updateDelivery.expressDelivery',
          },
          {
            type: 'value:visible',
            condition: '{{ $self.value === 2 }}',
            target: 'updateDelivery.sameCity',
          },
        ],
      },

      // 同城快递形式
      sameCity: {
        type: 'virtualBox',
        visible: false,
        properties: sameCitySchema(),
      },

      // 快递单号形式
      expressDelivery: {
        type: 'virtualBox',
        visible: false,
        properties: expressDeliverySchema(),
      },
    },
  },
};
