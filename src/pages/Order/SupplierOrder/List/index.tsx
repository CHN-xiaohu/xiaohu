import {
  useGeneralTableActions,
  GeneralTableLayout,
  generateDefaultSelectOptions,
  convenientDateRangeSchema,
} from '@/components/Business/Table';
import { ELLIPSIS, isReturning, isWaitPay } from '@/pages/Order/Constants';

import { Badge, message } from 'antd';
import { history } from 'umi';

import { Image } from '@/components/Business/Table/Image';

import { BodyRow, useTableRowAutoWidth } from '@/pages/Order/components/BodyRow';

import { useUnmount } from 'ahooks';
import { useWatch } from '@/foundations/hooks';
import { useCallback, useRef, useState } from 'react';

import styles from './index.less';

import type { PurchaseOrderColumns } from '../../Api';
import { paySupplyOrder } from '../../Api';
import { getPayResult, supplyOrderDetail } from '../../Api';
import { getSupplierOrders, getBrandSupplierOrders } from '../../Api';

import {
  getOrderStatus,
  getOrderStatusColor,
  transformOrderStatusToLabelValue,
} from '../../Constants';

import { Row } from '../components/BodyRow';
import { handleUnitTips } from '../../Detail/components/Info/components/OrderList';
import AddDistributionOrder from '../../Detail/components/Info/components/AddDistributionOrder';

export default function SupplierOrderList() {
  const { actionsRef } = useGeneralTableActions<PurchaseOrderColumns>();
  const { targetDomRef } = useTableRowAutoWidth();
  const [isShowSupply, setShowSupply] = useState(false);
  const [supplyDetail, setSupplyDetail] = useState({} as any);
  const [payQRcodeUrl, setPayQRcodeUrl] = useState('');
  const stopSetIntervalRef = useRef<number>(null);

  // 是否分销单
  const isSupplierOrder = window.location.pathname.includes('/orders/supplier');

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

  const getOrderPayStatus = (supplyDetailId: any) => {
    stopSetIntervalRef.current = setInterval(() => {
      getPayResult(supplyDetailId).then((res) => {
        if (res.data?.trade_status === 'TRADE_SUCCESS' || res.data?.trade_state === 'SUCCESS') {
          setShowSupply(false);
          // handleGetDetail()

          message.success('支付成功了！');

          handleStopSetInterval();
          window.location.reload();
        }
      });
    }, 5000);
  };

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

  const searchItem: any = [
    {
      content: {
        title: '模糊查询',
        type: 'string',
        'x-component-props': {
          placeholder: `订单编号/${isSupplierOrder ? '买家单号/' : ''}姓名/电话`,
        },
      },
      '[startTime,endTime]': convenientDateRangeSchema({ title: '下单时间' }),
    },
    {
      cityId: {
        title: '收货城市',
        type: 'area',
        placeholder: '请选择地区',
        'x-component-props': {
          showAreaLevel: 2,
        },
      },
      orderStatus: {
        title: '订单状态',
        type: 'checkableTags',
        col: 12,
        'x-component-props': {
          options: generateDefaultSelectOptions(transformOrderStatusToLabelValue).filter((item) => {
            return (
              !(!isSupplierOrder && isWaitPay(Number(item.value))) &&
              !isReturning(Number(item.value))
            );
          }),
        },
      },
    },
  ];

  const handleProductShow = (products: any) => {
    if (products?.length < 4) {
      return products?.map((items: any) => (
        <div className={styles.productListStyle}>
          <Image src={items.productImg} />
          <span className={styles.title}>{items.productName}</span>
        </div>
      ));
    }
    return (
      <div className={styles.imgMargin}>
        {products?.map((items: any) => (
          <img className={styles.imgs} src={items.productImg} alt="" />
        ))}
      </div>
    );
  };

  const handlePay = (id: string) => {
    return supplyOrderDetail(id).then((res) => {
      handleGetPayQrCode('wechat', res.data?.id, res.data?.totalMoney);
      setSupplyDetail(res.data);
      setShowSupply(true);
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
    onCancel() {
      setShowSupply(false);
    },
    onPayOrder(e: any) {
      if (e.target.value === 2) {
        handleGetPayQrCode('wechat', supplyDetail?.id, supplyDetail?.totalMoney);
      }
      if (e.target.value === 3) {
        handleGetPayQrCode('alipay', supplyDetail?.id, supplyDetail?.totalMoney);
      }
    },
  };

  const columnsList: any = [
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: '8%',
      render: (type: any) => (
        <Badge status={getOrderStatusColor(type)} text={getOrderStatus(type)} />
      ),
    },
    {
      title: '商品信息',
      dataIndex: 'productList',
      width: '20%',
      render: (data: any) => handleProductShow(data),
    },
    {
      title: '客户收货信息',
      dataIndex: 'customerName',
      width: '27%',
      render: (data: any, records: any) => {
        return (
          <div>
            <div className={styles.customerAddress}>
              {data}&nbsp;&nbsp;{records.customerPhone}
            </div>
            <div className={styles.customerAddress}>
              {records.province}
              {records.city}
              {records.area}
              {records.street}
              {records.address}
            </div>
          </div>
        );
      },
    },
    {
      title: '订单金额',
      dataIndex: 'totalMoney',
      width: '17%',
      render: (data: any) => <span>￥{data}</span>,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      width: '16.7%',
    },
    {
      title: '操作',
      dataIndex: 'id',
      // width: 80,
      buttonListProps: {
        list: ({ row }: any) => [
          {
            text: '查看详情',
            onClick: () => {
              isSupplierOrder
                ? history.push(`/orders/supplier/detail/${row.id}`)
                : history.push(`/orders/brandSupplier/detail/${row.id}`);
            },
          },
          {
            text: '去支付',
            visible: row.orderStatus === 1,
            onClick: () => handlePay(row.id),
          },
        ],
      },
    },
  ];

  return (
    <>
      <AddDistributionOrder {...supplyOpt} />
      <GeneralTableLayout<PurchaseOrderColumns, any>
        request={isSupplierOrder ? getSupplierOrders : getBrandSupplierOrders}
        getActions={actionsRef}
        useTableOptions={{
          formatSearchParams: (params) => ({ ...params, cityId: params?.cityId?.[1] }),
        }}
        searchProps={{
          minItem: 4,
          items: searchItem,
        }}
        operationButtonListProps={false}
        tableContainerRef={targetDomRef}
        columns={columnsList}
        tableProps={{
          className: styles.orderWrapper,
          components: {
            body: {
              row: BodyRow(Row),
            },
          },
        }}
      />
    </>
  );
}
