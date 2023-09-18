import { SchemaField, FormPath } from '@formily/antd';

// eslint-disable-next-line import/no-extraneous-dependencies

export const MoneyOff = ({ path }: any) => (
  <div className="coupon-add__ant-form-item">
    <div style={{ display: 'flex' }}>
      <SchemaField path={FormPath.parse(path).concat('withAmount')} />，
      <SchemaField path={FormPath.parse(path).concat('usedAmount')} />
      <SchemaField path={FormPath.parse(path).concat('usedDiscount')} />
    </div>
  </div>
);
