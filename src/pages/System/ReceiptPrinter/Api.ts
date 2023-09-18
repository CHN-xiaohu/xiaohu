import { Request } from '@/foundations/Request';

const prefixs = '/zwx-system';

const printerList = {
  prefix: `${prefixs}/printferManagement`,
};

export type IPrinterColumns = {
  id: string;
  createTime: string;
  name: string;
  machineCode: string;
  privateKey: string;
  brandName: string;
};

// 获取打印设备列表
export const getPrinterList = async (data: any) =>
  Request.post('/getPrintferList', {
    ...printerList,
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<any>;

// 保存打印设置
export const saveOrUpdatePrinterSet = async (data: any) =>
  Request.post('/saveOrUpdate', { ...printerList, data });

// 打印测试
export const testPrinter = async (data: any) =>
  Request.post('/printfTest', { ...printerList, data });

// 删除打印设置
export const deletePrinter = async (data: any) =>
  Request.post('/deletePrintfer', { ...printerList, data });
