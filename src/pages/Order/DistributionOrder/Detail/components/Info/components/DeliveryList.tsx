import { deliveryTypeMap } from '@/pages/Order/Constants';

import { memo } from 'react';
import { Table, Popover } from 'antd';

import styles from '../index.less';

import { Container } from '../../../Container';

const Main = () => {
  const { state } = Container.useContainer();

  return (
    <Table
      bordered
      title={() => <b>配送信息</b>}
      className={styles.headerTable}
      pagination={false}
      rowKey={(_, idx) => idx?.toString() || 'idx'}
      dataSource={state.dataSource.express || []}
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
            return (
              <div>
                {item.logisticsName}（{item?.infos?.join(',')}）
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
