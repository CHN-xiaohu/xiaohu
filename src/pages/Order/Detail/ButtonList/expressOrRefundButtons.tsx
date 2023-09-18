import { useCallback } from 'react';
import { message } from 'antd';

import { Container } from '../Container';

type Props = {
  addDistributions: () => void;
  handleDeliveryDataSource: (e: any) => any[];
  dataSources: any;
};

export const useOrderExpressButtons = ({
  dataSources,
  addDistributions,
  handleDeliveryDataSource,
}: Props) => {
  const { openModal, state } = Container.useContainer();

  // 商品发货
  const handleDelivery = useCallback(
    (reIsSalesOrder: boolean) => {
      const deliveryDataSource: any = handleDeliveryDataSource(dataSources);

      let isSupplyProduct: boolean = false;
      if (reIsSalesOrder) {
        deliveryDataSource.forEach((item: any) => {
          if (!item.canBeShip) {
            isSupplyProduct = true;
          }
        });
      } else {
        deliveryDataSource.forEach((item: any) => {
          if (item.distribution) {
            isSupplyProduct = true;
          }
        });
      }

      if (isSupplyProduct) {
        message.warning('分销商品不支持发货，请下分销采购单');

        return;
      }

      if (!deliveryDataSource.length) {
        message.warning('请先勾选需要发货的商品');

        return;
      }

      openModal({
        title: '商品发货',
        formStep: 'delivery',
        initialValues: {
          deliveryTable: deliveryDataSource,
          addOrderNum: [{ proCount: deliveryDataSource?.length, num: undefined }],
          messageType: 1,
          informations: undefined,
          logisticsName: undefined,
        },
      });
    },
    [dataSources],
  );

  // 商品退款
  const handleReimburse = useCallback(() => {
    const deliveryDataSource = handleDeliveryDataSource(dataSources);

    if (!deliveryDataSource.length) {
      message.warning('请先勾选需要退款的商品');
      return;
    }

    openModal({
      title: '商品退款',
      formStep: 'reimburse',
      initialValues: {
        orderProducts: deliveryDataSource,
        orderId: state.dataSource.id,
        refundReason: undefined,
        refundReasonRemark: undefined,
      },
    });
  }, [state.dataSource, dataSources]);

  const handleChangeButtonList = () => {
    const reIsSupplierOrder = window.location.pathname.includes('/orders/supplier');
    const reIsPurchaseOrder = window.location.pathname.includes('/orders/purchase');
    const reIsSalesOrder = window.location.pathname.includes('/orders/sales');

    const deliveryObj = {
      text: '商品发货',
      type: 'primary',
      style: { marginRight: 24 },
      onClick: () => handleDelivery(reIsSalesOrder),
    };

    const refundObj = {
      text: '商品退款',
      type: 'danger',
      style: { marginRight: 24 },
      onClick: handleReimburse,
    };

    const distributionObj = {
      text: '下分销采购单',
      type: 'primary',
      onClick: addDistributions,
    };

    if (state.dataSource.groupType === 2) {
      // 团购订单，需要等团购活动结束后，才显示【商品发货】按钮
      if (state.dataSource?.purchaseActivityVO?.showStatus === 2) {
        // 团购单有分销商品要走分销单流程
        if (state.dataSource.distribution) {
          return [distributionObj];
        }
        return [deliveryObj];
      }
      return [];
    }

    if (reIsPurchaseOrder || reIsSalesOrder) {
      // 如果是分销单，不显示发货按钮
      if (state.dataSource.distribution) {
        return [refundObj, distributionObj];
      }

      if (!state.dataSource.distribution) {
        let isDistribution = [];
        let noDistribution = [];

        if (state.dataSource?.childList) {
          isDistribution = state.dataSource?.childList?.filter((item) => item.distribution);
          noDistribution = state.dataSource?.childList?.filter((item) => !item.distribution);
        }
        if (state.dataSource?.childListOrder) {
          isDistribution = state.dataSource?.childListOrder?.filter(
            (item: any) => item.supplierInfo.isDistributionOrder,
          );
          noDistribution = state.dataSource?.childListOrder?.filter(
            (item: any) => !item.supplierInfo.isDistributionOrder,
          );
          if (
            isDistribution.length > 0 &&
            noDistribution.length > 0 &&
            state.dataSource?.isShowDistributionButton
          ) {
            return [deliveryObj, refundObj, distributionObj];
          }
          if (
            isDistribution.length > 0 &&
            noDistribution.length < 1 &&
            state.dataSource?.isShowDistributionButton
          ) {
            return [refundObj, distributionObj];
          }
          if (noDistribution.length > 0 && isDistribution.length < 1) {
            return [deliveryObj, refundObj];
          }

          return [deliveryObj, refundObj];
        }

        if (isDistribution.length > 0 && noDistribution.length > 0) {
          return [deliveryObj, refundObj, distributionObj];
        }
        if (isDistribution.length > 0 && noDistribution.length < 1) {
          return [refundObj, distributionObj];
        }
        if (noDistribution.length > 0 && isDistribution.length < 1) {
          return [deliveryObj, refundObj];
        }

        return [deliveryObj, refundObj];
      }

      return [deliveryObj, refundObj, distributionObj];
    }

    if (reIsSupplierOrder) {
      return [];
    }
    return [deliveryObj, refundObj];
  };

  return {
    expressOrRefundButtons: handleChangeButtonList(),
  };
};
