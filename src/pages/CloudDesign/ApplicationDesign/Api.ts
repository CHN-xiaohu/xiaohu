import { Request } from '@/foundations/Request';

export type IAppointmentDesignPagetColumns = {
  createTime: string; // 预约时间
  designId: string; // 方案ID
  designName: string; // 方案名称
  userName: string; // 用户名称
  linkPhone: string; // 手机号码
};

// 查询预约设计列表
export const getAppointmentDesignPage = async (data: any) =>
  Request.post('/zwx-kujiale/kjlAppointmentDesign/getAppointmentDesignPage', {
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IAppointmentDesignPagetColumns>;
