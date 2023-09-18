import { useMemo } from 'react';
import { connect } from '@formily/antd';

import { DiscountList } from './DiscountList';
import { AddDiscountList } from './AddDiscountList';

export const useFields = () =>
  useMemo(
    () => ({
      discountList: connect()(DiscountList),
      addDiscountList: connect()(AddDiscountList),
    }),
    [],
  );
