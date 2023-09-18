/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 小程序直播
|
*/

import { Request } from '@/foundations/Request';
import type { MiniprogramProductColumns } from '@/pages/Product/Api';

import type { productAuditStatus } from './constants';

type EnableOrClose = 0 | 1;

// eslint-disable-next-line max-len
// 价格类型，1：一口价（只需要传入price，price2不传） 2：价格区间（price字段为左边界，price2字段为右边界，price和price2必传） 3：显示折扣价（price字段为原价，price2字段为现价， price和price2必传）
type PriceType = 1 | 2 | 3;

type Good = {
  cover_img: string;
  url: string;
  name: string;
  price: string; // 价格（分）
  price2: string;
  price_type: PriceType;
  goods_id: string; // 商品id
  third_party_appid: string; // 第三方商品appid ,当前小程序商品则为空
};

export type LiveRoomColumn = {
  name: string;
  roomid: number;
  cover_img: string;
  share_img: string;
  live_status: number;
  start_time: number;
  end_time: number;
  anchor_name: string;
  goods: Good[];
  live_type: EnableOrClose; // 直播类型，1 推流 0 手机直播
  close_like: EnableOrClose; // 是否关闭点赞 【0：开启，1：关闭】（若关闭，观众端将隐藏点赞按钮，直播开始后不允许开启）
  close_goods: EnableOrClose; // 是否关闭货架 【0：开启，1：关闭】（若关闭，观众端将隐藏商品货架，直播开始后不允许开启）
  close_comment: EnableOrClose; // 是否关闭评论 【0：开启，1：关闭】（若关闭，观众端将隐藏评论入口，直播开始后不允许开启）
  close_kf: EnableOrClose; // 是否关闭客服 【0：开启，1：关闭】 默认关闭客服（直播开始后允许开启）
  close_replay: EnableOrClose; // 是否关闭回放 【0：开启，1：关闭】默认关闭回放（直播开始后允许开启）
  is_feeds_public: EnableOrClose; // 是否开启官方收录，1 开启，0 关闭
  creater_openid: string; // 创建者openid
  feeds_img: 'string'; // 官方收录封面
};

export const getLiveRooms = (params: AnyObject) =>
  Request.get('/zwx-product/livestream/getLiveInfo', {
    params,
  }) as PromiseResponsePaginateResult<LiveRoomColumn[]>;

// 删除直播间
export const deleteLiveRoom = (id: number) =>
  Request.post('/zwx-product/livestream/deleteRoom', { data: { id } });

type LiveRoomShareInfoColumns = {
  cdnUrl: string;
  pagePath: string;
  // 海报
  posterUrl: string;
};
// 获取直播间分享信息
export const getLiveRoomShareInfo = (params: {
  roomId: number;
  // 自定义参数，encodeURIComponent(JSON.stringify(custom_params))
  params?: string;
}) => Request.get<LiveRoomShareInfoColumns>('/zwx-product/livestream/getShareCode', { params });

export type LiveProductColumns = {
  auditId: number;
  auditStatus: keyof typeof productAuditStatus;
  coverImgUrl: string;
  goodsId: number;
  name: string;
  price: number;
  price2: number;
  priceType: PriceType;
  thirdPartyAppid: string;
  thirdPartyTag: number;
  url: string;
};

export const getLiveProducts = (
  params: AnyObject & { auditStatus: keyof typeof productAuditStatus },
) =>
  Request.get('/zwx-product/liveGoods/page', {
    params,
  }) as PromiseResponsePaginateResult<LiveProductColumns[]>;

// 小程序商品列表(未添加过的)
export const getLiveStreamPage = (params: AnyObject) =>
  Request.get('/zwx-product/productinfo/mini/liveStreamPage', {
    params,
  }) as PromiseResponsePaginateResult<MiniprogramProductColumns[]>;

export type AddLiveProductParams = {
  coverImgUrl: string;
  name: string;
  priceType: PriceType;
  price: number;
  price2?: number;
  url: string;
  productInfoId: string;
};
export const addLiveProduct = (goodsInfo: AddLiveProductParams) =>
  Request.post('/zwx-product/liveGoods/add', { data: { goodsInfo } });

/**
 * 更新商品
 *
 * https://api-manage.zazfix.com/project/25/interface/api/4934
 */
export const updateLiveProduct = (
  goodsInfo: Omit<AddLiveProductParams, 'productInfoId'> & { goodsId: number },
) => Request.post('/zwx-product/liveGoods/update', { data: { goodsInfo } });

export const deleteLiveProduct = (goodsId: number) =>
  Request.post('/zwx-product/liveGoods/delete', { data: { goodsId } });

/**
 * 撤回审核
 *
 * https://api-manage.zazfix.com/project/25/interface/api/4934
 */
export const resetLiveProductAudit = (data: { auditId: number; goodsId: number }) =>
  Request.post('/zwx-product/liveGoods/resetAudit', { data });

/**
 * 发起审核
 *
 * https://api-manage.zazfix.com/project/25/interface/api/4938
 */
export const liveProductAudit = (goodsId: number) =>
  Request.post('/zwx-product/liveGoods/audit', { data: { goodsId } });
