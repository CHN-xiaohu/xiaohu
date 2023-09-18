import { Modal, Table, Row, Col, Radio } from 'antd';
import { Image } from '@/components/Business/Table/Image';

import PayQRCode from './PayQRCode';

import styles from '../index.less';

const AddDistributionOrder = ({
  supplyDetail,
  onPayOrder,
  payUrl,
  handleUnitTips,
  ELLIPSIS,
  ...supplyOpt
}: any) => {
  const supplyColumn = [
    {
      title: '首图',
      width: 10,
      dataIndex: 'productImg',
      render: (src: string) => <Image src={src} />,
    },
    {
      title: '商品名称',
      width: 80,
      dataIndex: 'productName',
    },
    {
      title: '购买规格',
      width: 130,
      dataIndex: 'productPropVal',
      render: (v, records) => {
        return (
          <div>
            {v || ELLIPSIS}
            {handleUnitTips(records)}
          </div>
        );
      },
    },
    {
      title: '供货价',
      width: 80,
      dataIndex: 'productPrice',
      render: (data: any, record: any) => {
        return (
          <span>
            ￥{data}/{record?.productChargeUnitName}
          </span>
        );
      },
    },
    {
      title: '数量',
      width: 50,
      dataIndex: 'productNum',
    },
    {
      title: '备注',
      width: 80,
      dataIndex: 'remark',
    },
    {
      title: '小计',
      width: 60,
      dataIndex: 'productTotalMoney',
      render: (data: any) => <span>￥{data}</span>,
    },
  ];

  return (
    <Modal className={styles.supplyOrderDetail} {...supplyOpt}>
      <Table
        bordered
        rowKey="id"
        columns={supplyColumn}
        dataSource={supplyDetail?.productList}
        pagination={false}
      />
      <Row className={styles.marginTop}>
        <Col>订单编号：{supplyDetail.sn}</Col>
      </Row>
      <Row className={styles.marginTop}>
        <Col>
          实付金额：<span className={styles.price}>￥{supplyDetail.totalMoney}</span>
        </Col>
      </Row>
      <Row className={styles.marginTop}>
        <Col>支付方式：</Col>
      </Row>
      <Radio.Group onChange={(e) => onPayOrder(e)} defaultValue={2}>
        {/* <div className={styles.payLine}>
          <Radio value={1}>钱包余额</Radio>
          <span>余额不足</span>
        </div> */}
        <div className={styles.wxPay}>
          <Radio value={2}>
            <span>微信支付</span>
          </Radio>
          <span className={styles.wxPayRadio}>
            支付
            <span className={styles.payPrice}>￥{Number(supplyDetail.totalMoney).toFixed(2)}</span>
          </span>
        </div>

        <div className={styles.aliPay}>
          <Radio value={3}>
            <span>支付宝支付</span>
          </Radio>
          <span className={styles.aliPayRadio}>
            支付
            <span className={styles.payPrice}>￥{Number(supplyDetail.totalMoney).toFixed(2)}</span>
          </span>
        </div>
      </Radio.Group>
      <PayQRCode payUrl={payUrl} />
    </Modal>
  );
};

export default AddDistributionOrder;
