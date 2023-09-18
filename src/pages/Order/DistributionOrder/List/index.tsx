import {
  useGeneralTableActions,
  GeneralTableLayout,
  generateDefaultSelectOptions,
  convenientDateRangeSchema,
} from '@/components/Business/Table';

import { Badge } from 'antd';
import { history } from 'umi';

import { Image } from '@/components/Business/Table/Image';

import { BodyRow, useTableRowAutoWidth } from '@/pages/Order/components/BodyRow';

import styles from '../../index.less';

import type { PurchaseOrderColumns } from '../../Api';
import { getAllBrandSupplyOrder } from '../../Api';

import {
  getOrderStatus,
  getOrderStatusColor,
  transformOrderStatusToLabelValue,
} from '../../Constants';

import { Row } from '../components/BodyRow/index';

export default function SupplierOrderList() {
  const { actionsRef } = useGeneralTableActions<PurchaseOrderColumns>();
  const { targetDomRef } = useTableRowAutoWidth();
  // const isSupplierOrder = window.location.pathname.includes('/orders/supplier');

  const searchItem: any = [
    {
      content: {
        title: '模糊查询',
        type: 'string',
        'x-component-props': {
          placeholder: '订单编号/姓名/电话',
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
          isUseCode: true,
        },
      },
      orderStatus: {
        title: '订单状态',
        type: 'checkableTags',
        col: 12,
        'x-component-props': {
          options: generateDefaultSelectOptions(transformOrderStatusToLabelValue).filter(
            (item) => item.value !== '1' && item.value !== '7',
          ),
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
            onClick: () => history.push(`/shareMarketing/distributionOrder/detail/${row.id}`),
          },
        ],
      },
    },
  ];

  return (
    <>
      <GeneralTableLayout<PurchaseOrderColumns, any>
        request={getAllBrandSupplyOrder as any}
        getActions={actionsRef}
        useTableOptions={{
          formatSearchParams: (params) => ({ ...params, cityId: params?.cityId?.[1] }),
        }}
        searchProps={{
          minItem: 4,
          items: searchItem,
        }}
        defaultAddOperationButtonListProps={{
          text: '导出订单',
          onClick: () => {
            console.log('090909');
          },
        }}
        tableContainerRef={targetDomRef}
        columns={columnsList}
        tableProps={{
          className: styles.orderWrapper,
          rowKey: 'id',
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
