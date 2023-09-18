import { useCallback, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { useImmer } from 'use-immer';
import { useDebounceFn, useUnmount } from 'ahooks';

import { useWatch } from '@/foundations/hooks';
import {
  ELLIPSIS,
  isManuallyDistributePurchaseOrder,
  isWaitingForReceipt,
} from '@/pages/Order/Constants';
import type { ButtonListProps } from '@/components/Library/ButtonList';
import { ButtonList } from '@/components/Library/ButtonList';

import Modal from 'antd/es/modal';

import { usePrintModal } from './usePrintModal';

import { Container } from '../Container';

import type { PurchaseOrderColumns } from '../../Api';
import { supplierOrderConfirm } from '../../Api';
import { getPayResult, paySupplyOrder, supplyOrderDetail } from '../../Api';
import { printOrder } from '../../Api';
import { orderIsCancel } from '../../Constants';
import AddDistributionOrder from '../components/Info/components/AddDistributionOrder';
import { handleUnitTips } from '../components/Info/components/OrderList';

type IHandleButtonVisibleProps = {
  buttonList: ButtonListProps['list'];
  dataSource: PurchaseOrderColumns;
  isRefundProduct: boolean;
  /**
   * @description 是否整个订单都退款完成
   */
  isTheEntireOrderIsRefunded: boolean;
};

type Props = {
  orderId: string;

  isSalesOrder: boolean;
  isSupplier: boolean;
  isBrandSupplier: boolean;
  isPurchaseOrder: boolean;
};

export const useOrderButtonList = ({
  orderId,

  isSalesOrder,
  isSupplier,
  isBrandSupplier,
  isPurchaseOrder,
}: Props) => {
  const { openModal, state, reRequestOrderDetail } = Container.useContainer();
  const [isShowSupply, setShowSupply] = useState(false);
  const [supplyDetail, setSupplyDetail] = useState({} as any);
  const [payQRcodeUrl, setPayQRcodeUrl] = useState('');
  const stopSetIntervalRef = useRef<number>(null);

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

  const handlePay = (id: string) => {
    return supplyOrderDetail(id).then((res) => {
      handleGetPayQrCode('wechat', res.data?.id, res.data?.totalMoney);
      setSupplyDetail(res.data);
      setShowSupply(true);
    });
  };

  const { run: requestSupplierOrderConfirm } = useDebounceFn(
    (id, resolve, reject) => supplierOrderConfirm(id).then(resolve).catch(reject),
    {
      wait: 116,
    },
  );

  const handleSupplierOrderConfirm = (id: string) => {
    Modal.confirm({
      title: '提示',
      content: '确定收到全部商品？\n如有售后问题请及时联系客服',
      cancelText: '取消',
      okText: '确定收货',
      onOk: () => {
        return new Promise((resolve, reject) => {
          requestSupplierOrderConfirm(id, resolve, reject);
        })
          .then(() => {
            reRequestOrderDetail();
          })
          .catch(() => {});
      },
    });
  };

  const { openPrintModal, modalElement: printModalElement } = usePrintModal();

  const openRemark = useCallback(() => {
    openModal({
      title: '备注订单',
      formStep: 'addOrderLogRemark',
      initialValues: {},
    });
  }, []);

  const closeOrder = useCallback(() => {
    openModal({
      title: '取消订单',
      formStep: 'cancel',
      initialValues: {},
    });
  }, []);

  const handlePrint = useCallback(() => {
    printOrder({ orderId })
      .then(() => {
        message.info('打印成功');
      })
      .catch((err) => {
        openPrintModal({
          children: err.message,
        });
      });
  }, []);

  const [buttonListOptions, setButtonList] = useImmer<ButtonListProps['list']>([
    {
      text: '备注订单',
      type: 'primary',
      onClick: openRemark,
    },
    {
      text: '去支付',
      type: 'primary',
    },
    {
      text: '取消订单',
      danger: true,
      onClick: closeOrder,
    },
    {
      text: '打印订单',
      type: 'primary',
      onClick: handlePrint,
    },
    // @see https://www.tapd.cn/23571741/prong/stories/view/1123571741001003091
    {
      text: '确认收货',
      type: 'primary',
      visible: false,
    },
  ]);

  // 处理 [备注订单] 按钮的显/隐
  const handleRemarkOrderButtonVisible = useCallback(
    ({ buttonList, dataSource }: IHandleButtonVisibleProps) => {
      // 分销采购单备注不显示
      if (isSupplier) {
        buttonList[0].visible = false;

        buttonList[4].visible =
          isWaitingForReceipt(dataSource.orderStatus) &&
          isManuallyDistributePurchaseOrder(dataSource.orderSource);
        buttonList[4].onClick = () => handleSupplierOrderConfirm(dataSource.id);
      }
    },
    [],
  );

  // 处理 [取消订单] 按钮的显/隐
  const handleCancelOrderButtonVisible = useCallback(
    ({
      dataSource,
      buttonList,
      isRefundProduct,
      isTheEntireOrderIsRefunded,
    }: IHandleButtonVisibleProps) => {
      // 分销供货单处理
      if (isBrandSupplier) {
        if (isRefundProduct) {
          // 存在，那么就隐藏 [取消] 按钮
          buttonList[2].visible = false;
        }
      }
      if (isPurchaseOrder) {
        if (dataSource.brandSupplierOrderId && dataSource.brandSupplierOrderId !== '-1') {
          // 存在，那么就隐藏 [取消] 按钮
          buttonList[2].visible = false;
        }

        if (
          dataSource?.childList?.some(
            (items) => items.brandSupplierOrderId && items.brandSupplierOrderId !== '-1',
          )
        ) {
          // 存在，那么就隐藏 [取消] 按钮
          buttonList[2].visible = false;
        }
      }
      buttonList[2].disabled =
        orderIsCancel(Number(dataSource.orderStatus)) || isTheEntireOrderIsRefunded;
    },
    [],
  );

  // 处理 [打印订单] 按钮的显/隐
  const handlePrintOrderButtonVisible = useCallback(
    ({ buttonList, dataSource, isRefundProduct }: IHandleButtonVisibleProps) => {
      buttonList[3].visible =
        [3, 5].includes(dataSource.orderStatus) &&
        !isRefundProduct &&
        !isBrandSupplier &&
        !isSalesOrder &&
        !isSupplier;
    },
    [],
  );

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

  useWatch(() => {
    if (!state.dataSource) {
      return;
    }

    // 判断订单商品中，是否有退货商品
    const isRefundProduct = state.dataSource.productList.some((items) => items.isDelivery === 2);

    // 是否整个订单都退款完成
    const isTheEntireOrderIsRefunded = state.dataSource.isRefund;

    setButtonList((buttonList: any) => {
      const commonProps = {
        dataSource: state.dataSource,
        buttonList,
        isRefundProduct,
        isTheEntireOrderIsRefunded,
      };

      // 根据需求调整按钮的显/隐
      handleRemarkOrderButtonVisible(commonProps);
      handleCancelOrderButtonVisible(commonProps);
      handlePrintOrderButtonVisible(commonProps);
      buttonList[1].visible = [1].includes(Number(state.dataSource.orderStatus)) && isSupplier;
      buttonList[1].onClick = () => handlePay(state.dataSource.id);
    });
  }, [state.dataSource]);

  const renderButtonList = useMemo(
    () => (
      <>
        <AddDistributionOrder {...supplyOpt} />
        <ButtonList list={buttonListOptions} />
        {printModalElement}
      </>
    ),
    [buttonListOptions, printModalElement],
  );

  return {
    renderButtonList,
  };
};
