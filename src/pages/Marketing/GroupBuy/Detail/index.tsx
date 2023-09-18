import { SchemaForm, formatGridLayoutSchema } from '@/components/Business/Formily';

import { GeneralTabsDetail } from '@/components/Business/GeneralTabsDetail';

import type { RouteChildrenProps } from '@/typings/basis';
import { useRequest } from 'ahooks';

import { createAsyncFormActions } from '@formily/antd';

import { useGroupBuyOrders } from './GroupBuyOrders';

import type { GroupBuyColumns } from '../../Api';
import { getGroupBuy } from '../../Api';

const groupBuyInfoFormActions = createAsyncFormActions();

export default function MarketingGroupBuyDetail({ location, match }: RouteChildrenProps) {
  const { loading, data: initialValues = {} as GroupBuyColumns } = useRequest(
    () => getGroupBuy(match.params.id),
    {
      formatResult: (res) => {
        groupBuyInfoFormActions.setFieldValue('[startTime,endTime]', [
          res.data.startTime,
          res.data.endTime,
        ]);

        return res.data;
      },
    },
  );

  const groupBuyOrdersProps = useGroupBuyOrders(match.params.id);

  return (
    <GeneralTabsDetail
      {...{
        loading,
        defaultActiveKey: location.query?.tabActiveKey,
        properties: {
          info: {
            title: '活动信息',
            component: 'Collapse',
            props: {
              panels: {
                groupBuyInfo: {
                  title: '基本信息',
                  content: (
                    <SchemaForm
                      {...{
                        actions: groupBuyInfoFormActions,
                        initialValues,
                        editable: false,
                        schema: formatGridLayoutSchema([
                          {
                            activityName: {
                              type: 'string',
                              title: '活动名称',
                            },
                            shareDescribe: {
                              type: 'string',
                              title: '分享描述',
                            },
                          },
                          {
                            '[startTime,endTime]': {
                              title: '活动时间',
                              type: 'convenientDateRange',
                            },
                            shareRedirectUrl: {
                              type: 'string',
                              title: '分享跳转地址',
                            },
                          },
                          {
                            productName: {
                              type: 'string',
                              title: '商品名称',
                            },
                            price: {
                              type: 'string',
                              title: '团购价',
                            },
                          },
                          {
                            activityProductImg: {
                              type: 'uploadFile',
                              title: '商品图片',
                            },
                            imagePath: {
                              type: 'uploadFile',
                              title: '分享图',
                            },
                          },
                        ]),
                      }}
                    />
                  ),
                },
                groupBuyContions: {
                  title: '团购条件',
                  content: (
                    <SchemaForm
                      {...{
                        editable: false,
                        initialValues,
                        className: 'view-form__ant-form-item',
                        schema: {
                          bizGroupPurchaseConditions: {
                            type: 'customizeTable',
                            'x-component-props': {
                              tableProps: {
                                bordered: true,
                              },
                            },
                            items: {
                              type: 'object',
                              properties: {
                                num: {
                                  title: '团购数量',
                                  type: 'number',
                                  'x-component-props': {
                                    addonAfter: initialValues.unit,
                                  },
                                },

                                price: {
                                  title: '团购价格',
                                  type: 'number',
                                  'x-component-props': {
                                    addonBefore: '￥',
                                    addonAfter: '元',
                                  },
                                },
                              },
                            },
                          },
                        },
                      }}
                    />
                  ),
                },
              },
            },
          },
          orders: groupBuyOrdersProps,
        },
      }}
    />
  );
}
