import { SchemaField, FormPath } from '@formily/antd';

// eslint-disable-next-line import/no-extraneous-dependencies

export const CouponTime = ({ path }: any) => (
  <div className="coupon-add__ant-form-item">
    <div style={{ display: 'flex' }}>
      <SchemaField path={FormPath.parse(path).concat('validStartTime')} />
      &nbsp;&nbsp;
      <SchemaField path={FormPath.parse(path).concat('validEndTime')} />
    </div>
  </div>
);
