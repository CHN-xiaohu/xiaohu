import { message, Table, Modal } from 'antd';

import type { ChooseCommodityModalProps } from './ChooseCommodityModal';
import { ChooseCommodityModal } from './ChooseCommodityModal';
import { RenderProductInfo, Subtotal, UnitPrice } from './TableColumnsComponents';
import { ShopCartTableBuyNumStepper } from './ShopCartTableBuyNumStepper';
import { useSkuPanelEvent, useSkuPanelSkuChangeEvent } from './Sku/utils';
import { SkuModal as SkuModalComp } from './SkuModal';

import styles from '../index.less';
import type { OnProductChangeParamType } from '../types';

export const SelectedCommodity = ({
  showAddButton,
  dataSource,
  onProductChange,
  onOk,
}: ChooseCommodityModalProps & {
  showAddButton: boolean;
}) => {
  const skuPanelEvent = useSkuPanelEvent();
  const skuPanelSkuChangeEvent = useSkuPanelSkuChangeEvent();

  const handleInnerDataSource = (opt?: Partial<OnProductChangeParamType>) => {
    onProductChange({ data: dataSource, ...opt });
  };

  const addItemToDataSource = (index: number, item: any) => {
    dataSource.splice(index, 1, item);

    handleInnerDataSource();
  };

  const removeItemFromDataSource = (index: number) => {
    dataSource.splice(index, 1);
    handleInnerDataSource();
  };

  const onMessageFieldsChange = ({ data, index }: { data: any; index: any }) => {
    Object.assign(dataSource[index].productInfo.chargeUnit, data.charge);
    delete data.charge;
    addItemToDataSource(index, data);
  };

  return (
    <>
      {showAddButton && (
        <ChooseCommodityModal
          key="ChooseCommodity"
          // eslint-disable-next-line react/no-children-prop
          children="添加商品"
          dataSource={dataSource}
          onOk={onOk}
          onProductChange={(v) => handleInnerDataSource({ ...v, isFromChooseCommodityModal: true })}
        />
      )}

      <SkuModalComp
        {...{
          skuPanelEvent,
          skuPanelSkuChangeEvent,
          dataSource,
          onProductChange: handleInnerDataSource,
        }}
      />

      <Table
        style={{ margin: '20px 0 10px 0' }}
        dataSource={dataSource}
        rowKey="id"
        bordered
        pagination={false}
        columns={[
          {
            title: '商品信息',
            render: (_, row, index) => (
              <div style={{ display: 'flex' }}>
                <img className={styles.image} src={row?.product?.image} />
                <div style={{ flex: '1' }}>
                  <RenderProductInfo
                    dataSource={row}
                    onMessageFieldsChange={(value) => onMessageFieldsChange({ data: value, index })}
                    onOpenSkuModal={(data) => {
                      skuPanelEvent.emit({ data, isUpdate: true });
                    }}
                  />
                </div>
              </div>
            ),
          },
          {
            title: '单价',
            dataIndex: 'supplyPrice',
            align: 'center',
            render: UnitPrice,
          },
          {
            title: '数量',
            width: 200,
            align: 'center',
            dataIndex: 'buyNum',
            render: (_, records) => (
              <ShopCartTableBuyNumStepper
                {...{
                  dataSource: records,
                  onStepperChange: (buyNum: any) => {
                    const isExisted = dataSource.find(
                      (item: any) => item.id === records.product.id,
                    );
                    const dataIndex = dataSource?.findIndex((obj) => obj.id === records.product.id);

                    addItemToDataSource(dataIndex, { ...isExisted, buyNum });
                  },
                }}
              />
            ),
          },
          {
            title: '小计',
            dataIndex: 'supplyPrice',
            align: 'center',
            width: 200,
            // todo: 缓存计算结果
            render: Subtotal(),
          },
          {
            title: '操作',
            dataIndex: 'id',
            render: (_, record) => (
              <a
                onClick={() =>
                  Modal.confirm({
                    title: '确定删除该商品吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                      const dataIndex = dataSource?.findIndex((obj) => obj.id === record.id);
                      removeItemFromDataSource(dataIndex);
                      message.success('删除成功！');
                    },
                  })
                }
              >
                删除
              </a>
            ),
          },
        ]}
      />
    </>
  );
};
