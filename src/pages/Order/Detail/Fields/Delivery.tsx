import type { TSchemas } from '@/components/Business/Formily';

import { deliveryShip, salesOrderDeliveryShip, supplierOrderExpress } from '../../Api';
import '../../index.less';

export const handleDeliveryRequest = (values: any) => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isBrandSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');

  if (Number(values.messageType) === 1) {
    values.informations =
      values?.addOrderNum?.length > 1
        ? values?.addOrderNum?.map((item: any) => item.num).join(',')
        : values?.addOrderNum[0]?.num;
    values.addOrderNum = undefined;
  }
  values.informations = values?.informations ? [values.informations] : [values.oneInformations];
  values.oneInformations = undefined;
  values.purchaseOrderId = values.id;

  delete values.id;

  values.purchaseOrderProductIds = (values.deliveryTable as { id: string }[]).map(
    (item) => item.id,
  );
  if (isSalesOrder) {
    values.purchaseOrderId = undefined;
    values.salseOrderProductIds = values.purchaseOrderProductIds;
    values.purchaseOrderProductIds = undefined;
  }
  if (isBrandSupplierOrder) {
    values.supplierOrderProductIds = values.purchaseOrderProductIds;
    values.purchaseOrderId = undefined;
    values.purchaseOrderProductIds = undefined;
  }

  return {
    request: isBrandSupplierOrder
      ? supplierOrderExpress
      : isSalesOrder
      ? salesOrderDeliveryShip
      : deliveryShip,
    values,
  };
};

export const sameCitySchema = (): TSchemas => ({
  logisticsName: {
    title: '送货姓名',
    type: 'string',
    'x-component-props': {
      placeholder: '请填写送货姓名',
    },
    'x-rules': {
      required: true,
      message: '请填写送货姓名',
    },
  },
  informations: {
    title: '联系电话',
    type: 'string',
    'x-component-props': {
      placeholder: '请填写联系电话',
    },
    'x-rules': [
      {
        required: true,
        message: '请填写联系电话',
      },
      { phone: true },
    ],
  },
});

export const expressDeliverySchema = (): TSchemas => ({
  logisticsName: {
    title: '快递公司',
    type: 'string',
    'x-component-props': {
      placeholder: '请填写快递公司',
      style: { width: '72%' },
    },
    'x-rules': {
      required: true,
      message: '请填写快递公司',
    },
  },

  addOrderNum: {
    type: 'addOrderNum' as any,
    // default: [{ num: undefined }],
    'x-component-props': {
      proCount: 0,
    },
    items: {
      type: 'object',
      properties: {
        num: {
          title: '快递单号',
          type: 'string',
          'x-rules': { required: true, message: '请输入快递单号' },
          'x-component-props': {
            placeholder: '请输入快递单号',
            style: { width: '100%' },
          },
        },
      },
    },
  },
});

// 发货
export const deliveryFields: TSchemas = {
  delivery: {
    type: 'virtualBox',
    visible: false,
    properties: {
      deliveryTable: {
        type: 'deliveryTable' as any,
        'x-props': {
          itemClassName: 'full-width__form-item-control',
        },
      },
      messageType: {
        title: '配送方式',
        type: 'radio',
        default: 1,
        enum: [
          { value: 1, label: '快递公司' },
          { value: 2, label: '同城配送' },
        ],
        'x-linkages': [
          {
            type: 'value:visible',
            condition: '{{ $self.value === 1 }}',
            target: 'delivery.expressDelivery',
          },
          {
            type: 'value:visible',
            condition: '{{ $self.value === 2 }}',
            target: 'delivery.sameCity',
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
        // fields,
      },
    },
  },
};
