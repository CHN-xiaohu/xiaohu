import { memo, useCallback } from 'react';
import { Table, Popover } from 'antd';

import { nanoid } from 'nanoid';

import { deliveryTypeMap } from '@/pages/Order/Constants';

import styles from '../index.less';

import { Container, formActions } from '../../../Container';

const Main = () => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isBrandSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');
  const isSupplierOrder = window.location.pathname.includes('/orders/supplier');

  const { state, openModal } = Container.useContainer();

  const updateDeliveryInfo = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (values: any, item: any[]) => () => {
      const initalMap = {
        logisticsName: values.logisticsName,
        messageType: Number(values.messageType),
        addOrderNum: undefined,
        informations: undefined,
      } as any;

      if (Number(values.messageType) === 1) {
        initalMap.addOrderNum = values?.infos?.map((itemPer) => ({ num: itemPer }));
      } else {
        initalMap.informations = values?.infos;
      }
      if (isSalesOrder) {
        initalMap.salseOrderProductIds = values.productIds;
        initalMap.packetId = values.packetId;
      } else {
        initalMap.purchaseOrderProductIds = values.productIds;
      }

      openModal({
        title: '修改发货信息',
        formStep: 'updateDelivery',
        initialValues: initalMap,
      }).then(() => {
        // 因为 updateDelivery 是 void 字段，所以这里需要再声明指定下，这个算是 formily 1.x 的设计缺陷
        setTimeout(() => {
          formActions.setFieldValue('updateDelivery.messageType', initalMap.messageType);
        });
      });
    },
    [],
  );

  const sureDataSource =
    isBrandSupplierOrder || isSupplierOrder
      ? state.dataSource.express
      : isSalesOrder
      ? state.dataSource.orderExpress
      : state.dataSource.newOrderExpressMap;

  return (
    <Table
      bordered
      title={() => <b>配送信息</b>}
      className={styles.headerTable}
      pagination={false}
      rowKey={(_) => {
        return _.packetId ?? nanoid();
      }}
      dataSource={sureDataSource || []}
      columns={[
        {
          title: '包裹序列',
          dataIndex: 'index',
          render: (_, _1, index) => index + 1,
        },
        {
          title: '物流方式',
          dataIndex: 'messageType',
          render: (_, item: any) => <span>{deliveryTypeMap[Number(item.messageType)]}</span>,
        },
        {
          title: '物流单号/联系人',
          dataIndex: 'logisticsName',
          render: (_, item: any) => {
            let isCanUpdate = false;
            if (!window.location.pathname.includes('/orders/supplier')) {
              isCanUpdate = true;
            }
            if (window.location.pathname.includes('/orders/purchase')) {
              isCanUpdate = item?.productList?.some((items: any) => !items?.distribution);
            }
            return (
              <div>
                {item.logisticsName}（{item?.infos?.join(',')}）
                {isCanUpdate && (
                  <a style={{ marginLeft: 4 }} onClick={updateDeliveryInfo(item, item)}>
                    修改
                  </a>
                )}
              </div>
            );
          },
        },
        {
          title: '包裹内容',
          dataIndex: 'other',
          render: (_, item: any) => {
            return (
              <div>
                {item?.productList.map((v, idx) => {
                  const setAttrVals = v.attrVals
                    ? `${v.attrVals.replace(',', '*')}${v.productChargeUnitName}`
                    : `${v.productChargeUnitName}`;
                  return (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Popover content={v.productName}>
                          <div
                            style={{ minWidth: '100px', maxWidth: '340px' }}
                            className="ellipsis"
                          >
                            {v.productName}
                          </div>
                        </Popover>
                        &nbsp;/&nbsp;
                        {[v.productPropVal, setAttrVals].filter(Boolean).join(' / ')}
                      </div>
                      <div style={{ marginLeft: 10 }}>x {v.productNum}</div>
                    </div>
                  );
                })}
              </div>
            );
          },
        },
      ]}
    />
  );
};

export const DeliveryList = memo(Main);
