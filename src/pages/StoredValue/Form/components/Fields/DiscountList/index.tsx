import { useCallback } from 'react';
import { List, Empty } from 'antd';
import { ButtonList } from '@/components/Library/ButtonList';
import { cloneDeepByJSON } from '@/utils';

type Props = {
  value: any[];
  onChange: (value: any[]) => void;
  readOnly?: boolean;
};

export const Main = ({ value = [], onChange, readOnly }: Props) => {
  const handleDeleteDiscountByIndex = useCallback(
    (index: number) => () => {
      const newValue = cloneDeepByJSON(value);

      newValue.splice(index, 1);

      onChange && onChange(newValue);
    },
    [onChange, value],
  );

  const renderListItem = (item: any) => (
    <span>
      活动期间内充值：
      <span style={{ fontWeight: 600 }}>
        <span style={{ margin: '0 20px' }}>≥ {item.overAmount}</span>

        <span>
          {[
            ...(item.amount ? [`送储值卡金额：${item.amount}`] : []),
            ...(item?.couponLists?.length
              ? [
                  `送优惠券：${item.couponLists
                    .map((v: any) => `${v.couponName}  x${v.num}`)
                    .join('，')}`,
                ]
              : []),
          ].join('，')}
        </span>
      </span>
    </span>
  );

  const actions = (index: number) =>
    readOnly
      ? []
      : [
          <ButtonList
            isLink
            list={[
              {
                text: '删除优惠',
                popconfirmProps: {
                  title: '确认删除优惠吗？',
                  onConfirm: handleDeleteDiscountByIndex(index),
                },
              },
            ]}
          />,
        ];

  return (
    <List
      itemLayout="horizontal"
      dataSource={value}
      style={{
        margin: '0 2%',
      }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{
              margin: 0,
            }}
            description="暂无活动优惠"
          />
        ),
      }}
      renderItem={(item, index) => (
        <List.Item actions={actions(index)}>
          <List.Item.Meta title={renderListItem(item as any)} />
        </List.Item>
      )}
    />
  );
};

export const DiscountList = Main;
