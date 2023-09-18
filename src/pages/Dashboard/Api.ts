/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 采购单相关接口
|
*/

import { Request } from '@/foundations/Request';

const prefix = '/zwx-order';

export type IAnalyze = {
  orderNum: number;
  totalMoney: number;
  storeNum: number;
  waitDeliver: number;
  waitPay: number;
};

export const getAnalyze = async () =>
  Request.get('/analyze', { prefix: `${prefix}/bizsalesorder/brand` }).then((res) => {
    Object.keys(res.data).forEach((k) => {
      if (res.data[k] === -1) {
        res.data[k] = 0;
      }
    });

    return res;
  });
