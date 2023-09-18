import { Request } from '@/foundations/Request';

export type IExportReportColumns = {
  id: string; // id
  tenantCode: string; //	租户号
  reportId: string; //	报表编号
  reportName: string; //	报表名称
  reportLink: string; //	报表下载地址
  reportType: number; //	报表类型（1 采购单支付记录 2 销售单支付记录）
  reportApplicationTime: string; //	报表申请时间
  conditionName: string; //	查询条件：模糊查询
  reportApplicant: string; //	报表申请人
  createTime: string; //	报表创建时间
  reportBuildStatus: number; //	报表生成状态：0 生成中 1 报表生成成功  2 报表生成失败
  conditionOrderType: number; //	查询条件：订单类型   0 全部
  conditionStartTime: string; //	查询条件：时间段
  conditionEndTime: string; //	查询条件：结束时间段
  updateTime: string; //	修改时间
};

// 导出报表的记录列表
export const getExportReportRecording = async (params: any) =>
  Request.get('/zwx-system/brand/export/exportReportRecording', {
    params,
  }) as PromiseResponsePaginateResult<IExportReportColumns>;

// 下载报表
export const downloadExcel = async (params: any) =>
  Request.get('/zwx-system/brand/export/downloadExcel', {
    params,
  });
