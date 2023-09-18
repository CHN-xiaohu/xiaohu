/* eslint-disable import/no-extraneous-dependencies */
import { useCallback } from 'react';
import { List } from 'antd';

import type { ISchemaFieldComponentProps } from '@formily/antd';
import { SchemaField, FormPath } from '@formily/antd';
import { toArr } from '@formily/antd/esm/shared';

import { ButtonList } from '@/components/Library/ButtonList';

import styles from '../index.less';

export const CouponList = (props: ISchemaFieldComponentProps) => {
  const { value, schema, path, mutators } = props;

  const values = toArr(value);

  const onAdd = useCallback(() => {
    const items = Array.isArray(schema.items)
      ? schema.items[schema.items.length - 1]
      : schema.items;

    if (items && values.length < (schema.maxItems || 100000)) {
      mutators.push(items.getEmptyValue());
    }
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={values}
      className={styles.couponListWrapper}
      renderItem={(item, index) => (
        <List.Item
          actions={[
            <ButtonList
              isLink
              list={[
                index
                  ? { text: '删除', onClick: () => mutators.remove(index) }
                  : { text: '添加', onClick: onAdd },
              ]}
            />,
          ]}
        >
          <List.Item.Meta title={<SchemaField path={FormPath.parse(path).concat(index)} />} />
        </List.Item>
      )}
    />
  );
};
