import { useMemo } from 'react';

import { connect } from '@formily/antd';

import { DeliveryTable } from './DeliveryTable';

export const useFields = () =>
  useMemo(
    () => ({
      deliveryTable: connect()(DeliveryTable),
    }),
    [],
  );
