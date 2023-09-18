import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import { Card, message, Modal, Tabs } from 'antd';
import { useState } from 'react';
import { showPriceOrBetween } from '@/pages/Product/Manager/Common';

import { useDebounceFn } from 'ahooks';

import styles from './index.less';

import {
  distributeCommodity,
  getDistributionBelongPage,
  getShareBelongPage,
  getSupplierDistributionBelongPage,
  getSupplierShareBelongPage,
} from '../../DistributionManagement/Api';

const { TabPane } = Tabs;

type DistributionProductProps = {
  tabPaneOpts: any[];
  supplyId?: string;
};

export default function DistributionProduct({ tabPaneOpts, supplyId }: DistributionProductProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { actionsRef } = useGeneralTableActions();

  const { run: requestBatchToWarehouse } = useDebounceFn(
    async (resolve, reject) => {
      try {
        for (const fromProductInfoId of selectedRowKeys) {
          // eslint-disable-next-line no-await-in-loop
          await distributeCommodity({ fromProductInfoId, productState: 2 });
        }

        actionsRef.current.reload();
        message.success('操作成功');

        resolve();
      } catch (error) {
        message.error(error?.message);
        reject();
      }
    },
    { wait: 116 },
  );

  const batchToWarehouse = () => {
    if (selectedRowKeys.length === 0) {
      return message.warning('请选择商品');
    }
    return Modal.confirm({
      title: (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>确定批量添加商品到仓库吗？</span>
          <span>需前往分销商品/仓库中,修改商品价格后再进行上架哦！</span>
        </div>
      ),
      onOk: () => {
        return new Promise(requestBatchToWarehouse);
      },
    });
  };

  return (
    <Card bodyStyle={{ padding: 0 }} className={styles.wrapper}>
      <Tabs>
        {tabPaneOpts.map((item) => (
          <TabPane tab={item.title} key={item.state}>
            <GeneralTableLayout
              getActions={actionsRef}
              request={(params) => {
                if (supplyId) {
                  return item.state === 1
                    ? getSupplierShareBelongPage({ ...params, supplyId })
                    : getSupplierDistributionBelongPage({
                        ...params,
                        supplyId,
                      });
                }
                return item.state === 1
                  ? getShareBelongPage(params)
                  : getDistributionBelongPage({ ...params, productState: 1 });
              }}
              placeholder="--"
              operationButtonListProps={{
                list: [
                  {
                    text: '批量添加到仓库',
                    type: 'primary',
                    onClick: () => batchToWarehouse(),
                    visible: item.showSelection,
                  },
                ],
              }}
              toolBarProps={false}
              tableProps={{
                tableLayout: 'auto',
                ...(item.showSelection
                  ? {
                      rowSelection: {
                        selectedRowKeys,
                        onChange: (keys: any) => setSelectedRowKeys(keys as string[]),
                      },
                    }
                  : {}),
              }}
              searchProps={{
                items: [
                  {
                    name: {
                      title: '商品名称',
                      type: 'string',
                      'x-component-props': {
                        placeholder: '商品名称',
                      },
                    },
                  },
                ],
              }}
              columns={[
                {
                  title: '商品名称',
                  dataIndex: 'name',
                },
                {
                  title: '供货价',
                  dataIndex: 'linkPhone',
                  render: (_, records) =>
                    showPriceOrBetween(records.minSupplyPrice, records.maxSupplyPrice),
                },
              ]}
            />
          </TabPane>
        ))}
      </Tabs>
    </Card>
  );
}
