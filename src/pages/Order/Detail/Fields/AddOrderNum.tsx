import { useCallback } from 'react';
import { List, message } from 'antd';

import type { ISchemaFieldComponentProps } from '@formily/antd';
import { SchemaField, FormPath } from '@formily/antd';
import { toArr } from '@formily/antd/esm/shared';

import { ButtonList } from '@/components/Library/ButtonList';

import styles from '../../index.less';

export const AddOrderNum = (props: ISchemaFieldComponentProps) => {
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

  const isMoreThanFive = () => message.warning('最多添加5个单号');

  return (
    <List
      bordered={false}
      dataSource={values}
      className={styles.addOrderNumWrapper}
      renderItem={(item, index) => (
        <List.Item
          actions={[
            <ButtonList
              style={{ width: '43px' }}
              isLink
              list={
                value[0]?.proCount > 1
                  ? []
                  : [
                      index
                        ? { text: '删除', onClick: () => mutators.remove(index) }
                        : { text: '添加', onClick: value.length > 4 ? isMoreThanFive : onAdd },
                    ]
              }
            />,
          ]}
        >
          <List.Item.Meta title={<SchemaField path={FormPath.parse(path).concat(index)} />} />
        </List.Item>
      )}
    />
  );
};
