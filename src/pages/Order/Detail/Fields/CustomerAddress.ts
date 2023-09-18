import type { TSchemas } from '@/components/Business/Formily';

import { updateOrderDetail, updateOptainMessage, editSupplyOrderMessage } from '../../Api';

import { formActions } from '../Container';

export const handleCustomerAddressRequest = (values: any) => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');
  let addressParam = {} as any;
  formActions.getFieldState('addressCodes', (fieldState) => {
    const [, names] = fieldState.values;

    const fields = [
      ['province', 'provinceId'],
      ['city', 'cityId'],
      ['area', 'areaId'],
      ['street', 'streetId'],
    ];
    if (names) {
      const areaInfo = (names as { name: string; adcode: string }[]).reduce(
        (previous, current, currentIndex) => ({
          ...previous,
          [fields[currentIndex][0]]: current.name,
          [fields[currentIndex][1]]: current.adcode,
        }),
        {},
      );
      addressParam = {
        ...areaInfo,
      };
    }
  });

  delete values.customerAddress;
  delete values.addressCodes;

  if (JSON.stringify(addressParam) !== '{}' && !values?.street) {
    values.street = '';
    values.streetId = '';
  }
  if (JSON.stringify(addressParam) === '{}') {
    addressParam = {
      id: values.id,
      address: values.address,
    };
  } else {
    addressParam = {
      ...values,
      ...addressParam,
    };
  }

  return {
    request: isSupplierOrder
      ? editSupplyOrderMessage
      : isSalesOrder
      ? updateOptainMessage
      : updateOrderDetail,
    values: addressParam,
  };
};

// 收货人地址修改
export const customerAddressFields: TSchemas = {
  customerAddress: {
    type: 'virtualBox',
    visible: false,
    properties: {
      addressCodes: {
        title: '省市县地址',
        type: 'area',
        'x-component-props': {
          showAreaLevel: 4,
          placeholder: '请选择收货人地址',
          isUseCode: false,
        },
        'x-rules': {
          required: true,
          message: '请选择收货人地址',
        },
      },
      address: {
        title: '详细地址',
        type: 'textarea',
        required: true,
        'x-component-props': {
          placeholder: '请填写详细地址',
        },
        'x-rules': { range: [1, 100], message: '请填写详细地址' },
      },
    },
  },
};
