import { memo } from 'react';
import { Form, InputNumber } from 'antd';

const { Item } = Form;

type Prop = {
  watchMinPrice: (v: any) => void;
  watchMaxPrice: (v: any) => void;
};

export const SupplyRange = memo(({ watchMinPrice, watchMaxPrice }: Prop) => {
  return (
    <div className="supply-range-content">
      <Form>
        <Item label="供货价">
          <Item name="minPrice" style={{ display: 'inline-block', margin: '0 8px' }}>
            <InputNumber onChange={watchMinPrice} />
          </Item>
          <span>-</span>
          <Item name="maxPrice" style={{ display: 'inline-block', margin: '0 8px' }}>
            <InputNumber onChange={watchMaxPrice} />
          </Item>
        </Item>
      </Form>
    </div>
  );
});
