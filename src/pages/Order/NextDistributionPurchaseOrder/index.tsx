import { useCallback, useMemo, useRef, useState } from 'react';
import { message } from 'antd';

import { useUnmount } from 'ahooks';
import { useWatch } from '@/foundations/hooks';
import type { SchemaFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';
import { ELLIPSIS } from '@/pages/Order/Constants';
import { createAsyncFormActions } from '@formily/antd';
import { ShopCartCache } from '@/services/ShopCart';

import { deliveryInfo, formatGridLayoutSchema } from './Constants';
import ProductTable from './ProductTable/index';
import OrderTotal from './OrderTotal/index';

import './index.less';

import AddDistributionOrder from '../Detail/components/Info/components/AddDistributionOrder';
import { createBrandSupplierOrder, getPayResult, paySupplyOrder, supplyOrderDetail } from '../Api';
import { handleUnitTips } from '../Detail/components/Info/components/OrderList';

export type SearchFromProps = {
  items: any[];
  minItem?: number;
  cardTitle?: string;
} & Omit<SchemaFormProps, 'schema'>;

const formActions = createAsyncFormActions();

export default function NextDistributionPurchaseOrder() {
  const [areaCodeList, setAreaCodeList] = useState({} as any);
  const [isShowSupply, setShowSupply] = useState(false);
  const [supplyDetail, setSupplyDetail] = useState({} as any);
  const [payQRcodeUrl, setPayQRcodeUrl] = useState('');
  const stopSetIntervalRef = useRef<number | null>(null);
  const shopCartCacheInfo = ShopCartCache.get([]);

  const handleStopSetInterval = useCallback(() => {
    if (stopSetIntervalRef.current) {
      clearInterval(stopSetIntervalRef.current);
    }
  }, []);

  useWatch(() => {
    if (isShowSupply) {
      if (supplyDetail?.id) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        getOrderPayStatus(supplyDetail?.id);
      }
    } else {
      handleStopSetInterval();
    }
  }, [isShowSupply]);

  useUnmount(() => {
    handleStopSetInterval();
  });

  const handleCancelOrder = () => {
    ShopCartCache.set([]);
    formActions.reset({ validate: false });
    setShowSupply(false);
  };

  const getOrderPayStatus = (supplyDetailId: any) => {
    stopSetIntervalRef.current = (setInterval(() => {
      getPayResult(supplyDetailId).then((res) => {
        if (res.data?.trade_status === 'TRADE_SUCCESS' || res.data?.trade_state === 'SUCCESS') {
          message.success('支付成功了！');
          handleCancelOrder();
          handleStopSetInterval();
          window.location.reload();
        }
      });
    }, 5000) as unknown) as number;
  };

  const handleChangeCascader = (_value: any, selectedOptions: any) => {
    setAreaCodeList({
      province: selectedOptions[0]?.name ?? '',
      provinceId: selectedOptions[0]?.adcode ?? '',
      city: selectedOptions[1]?.name ?? '',
      cityId: selectedOptions[1]?.adcode ?? '',
      area: selectedOptions[2]?.name ?? '',
      areaId: selectedOptions[2]?.adcode ?? '',
      street: selectedOptions[3]?.name ?? '',
      streetId: selectedOptions[3]?.adcode ?? '',
    });
  };

  // table 搜索表单布局
  const schema = useMemo(() => formatGridLayoutSchema(deliveryInfo(handleChangeCascader), 0), [
    deliveryInfo(handleChangeCascader),
    0,
  ]);

  const handleGetPayQrCode = (type: string, supplyDetailId: string, totalMoney: any) => {
    const requestParam = {
      channelTrxType: 'QR',
      merchantOrderNum: supplyDetailId,
      paymentSubject: '供货单支付',
      paymentAmount: totalMoney,
      tradeType: 'BrandSupplierOrder',
    };

    paySupplyOrder({ channelCode: type, ...requestParam }).then((res) => {
      setPayQRcodeUrl(res.data);
    });
  };

  const handleSubmit = (dataSource: any) => {
    const { customerName, customerPhone, address, remark } = dataSource;
    const { province, provinceId, city, cityId, area, areaId, street, streetId } = areaCodeList;

    if (!ShopCartCache.get([]).length) {
      return Promise.reject(message.error('请选择下单商品！'));
    }

    const products = ShopCartCache.get([]).map((item: any) => ({
      productId: item?.id,
      productNum: item?.buyNum,
      salePropValNames: item.product.salePropValNames,
      attrs: item?.productInfo?.chargeUnit?.attrs || [],
      remark: item?.remark || '',
    }));

    const params = {
      customerName,
      customerPhone,
      province,
      provinceId,
      city,
      cityId,
      area,
      areaId,
      street,
      streetId,
      address,
      remark,
      productList: products,
      resProductList: products,
    };

    return createBrandSupplierOrder(params).then((addRes) => {
      supplyOrderDetail(addRes.data).then((res) => {
        handleGetPayQrCode('wechat', res.data?.id, res.data?.totalMoney);

        setSupplyDetail(res.data);
        setShowSupply(true);
      });
    });
  };

  const supplyOpt = {
    title: '分销采购单',
    width: 1000,
    visible: isShowSupply,
    supplyDetail,
    payUrl: payQRcodeUrl,
    footer: false,
    ELLIPSIS,
    handleUnitTips,
    onCancel: handleCancelOrder,
    onPayOrder(e: any) {
      if (e.target.value === 2) {
        handleGetPayQrCode('wechat', supplyDetail?.id, supplyDetail?.totalMoney);
      }
      if (e.target.value === 3) {
        handleGetPayQrCode('alipay', supplyDetail?.id, supplyDetail?.totalMoney);
      }
    },
  };

  return (
    <>
      <AddDistributionOrder {...supplyOpt} />
      <SchemaForm
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        actions={formActions}
        onSubmit={handleSubmit}
        components={{ ProductTable, OrderTotal }}
        schema={{
          distributionPurchaseOrder: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              size: 'default',
            },
            properties: {
              deliveryInfo: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  title: '收货信息',
                  type: 'inner',
                },
                properties: schema,
              },
              productInfo: {
                type: 'string',
                'x-component': 'ProductTable',
                'x-component-props': {
                  dataSource: shopCartCacheInfo,
                  onProductChange: ({ data }: { data: any[] }) => {
                    formActions.setFieldState('*.productInfo', (fieldState) => {
                      const fieldComponentProps = fieldState.props['x-component-props']!;

                      fieldComponentProps.dataSource = [...data];
                      fieldComponentProps.rerenderCount =
                        (fieldComponentProps.rerenderCount ?? 0) + 1;

                      ShopCartCache.set(data ?? []);
                    });

                    formActions.setFieldState('*.orderTotal', (fieldState) => {
                      const fieldComponentProps = fieldState.props['x-component-props']!;

                      fieldComponentProps.dataSource = [...data];
                      fieldComponentProps.rerenderCount =
                        (fieldComponentProps.rerenderCount ?? 0) + 1;
                    });
                  },
                },
              },
              remark: {
                title: '订单留言',
                type: 'textarea',
                'x-component-props': {
                  rows: 2,
                  placeholder: '请输入订单留言',
                },
                'x-props': {
                  labelCol: 1.5,
                },
                'x-rules': [
                  {
                    range: [0, 100],
                    message: '长度为100个字符',
                  },
                ],
              },
              orderTotal: {
                title: '订单合计',
                'x-component': 'OrderTotal',
                type: 'string',
                editable: false,
                'x-props': { labelCol: 1.5 },
                'x-component-props': {
                  dataSource: shopCartCacheInfo,
                },
              },
              buttonGroup: {
                type: 'submitButton',
                'x-component-props': {
                  // sticky: true,
                  children: '确定下单',
                },
              },
            },
          },
        }}
      />
    </>
  );
}
