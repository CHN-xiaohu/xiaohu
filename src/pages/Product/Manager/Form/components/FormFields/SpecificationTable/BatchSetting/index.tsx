import * as React from 'react';

import { InputNumber, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { useDebounceByMemo } from '@/foundations/hooks';

import { useShowTakeProductPrice } from '@/pages/Product/Miniprogram/useShowTakeProductsPriceModal';

import styles from '../index.less';

export type IInitBatchSettingValues = {
  minimumSale?: number;
  factoryPrice?: number;
  vipPurchasePrice?: number;
  purchasePrice?: number;
};

export type SpecificationTableProps = {
  onBatchSetting: (values: IInitBatchSettingValues) => Promise<void>;
  expandColumnsFieldPropsMap: AnyObject;
  fromProductInfoId?: string;
};

const Main: React.FC<SpecificationTableProps> = ({
  onBatchSetting,
  expandColumnsFieldPropsMap,
  fromProductInfoId,
}) => {
  const [columnInputValue, setColumnInputValue] = React.useState({});

  const handleBatchSetting = React.useCallback(() => {
    if (Object.keys(columnInputValue).length && onBatchSetting) {
      onBatchSetting(columnInputValue).then(() => {
        setColumnInputValue({});
      });
    }
  }, [columnInputValue, onBatchSetting]);

  // column input onChange 事件
  const handleChange = React.useCallback((column: string, value?: number) => {
    setColumnInputValue((s) => ({ ...s, [column]: value }));
  }, []);

  const { openShowTakeProductPrice, ShowTakeProductPriceElement } = useShowTakeProductPrice({});

  const handleChangeDebounce = useDebounceByMemo(handleChange, { delay: 60 });

  return (
    <div>
      {ShowTakeProductPriceElement}
      <div className={styles.batchSetting}>
        批量设置
        {Object.keys(expandColumnsFieldPropsMap).map((column) => (
          <div key={column} className={styles.batchSettingItem}>
            <div className={styles.batchSettingItemLabel}>
              {(expandColumnsFieldPropsMap[column].placeholder as string).replace('请输入', '')}
            </div>

            <InputNumber
              {...{
                ...expandColumnsFieldPropsMap[column],
                value: columnInputValue[column],
                onChange: (value) => handleChangeDebounce(column, value as number),
              }}
            />
          </div>
        ))}
        <Button type="primary" className={styles.button} onClick={handleBatchSetting}>
          应用设置
        </Button>
      </div>
      {fromProductInfoId && (
        <div style={{ marginBottom: '10px' }}>
          <QuestionCircleOutlined />
          <span
            onClick={() => openShowTakeProductPrice()}
            style={{ color: '#1890ff', marginLeft: '10px', cursor: 'pointer' }}
          >
            查看商品拿货价
          </span>
        </div>
      )}
    </div>
  );
};

export const SpecificationTableBatchSetting = React.memo(Main);
