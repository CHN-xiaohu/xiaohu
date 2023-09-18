import { useCallback } from 'react';
import { Divider, List } from 'antd';

import { useImmer } from 'use-immer';

import { MoneyText } from '@/components/Library/MoneyText';

import { useDebounceWatch } from '@/foundations/hooks';

import styles from './index.less';

import { ModalForm } from './components/ModalForm';

export type IDiscountInfoListItems = {
  money: {
    type: 'money';
    amount: number;
  };
  coupon: {
    type: 'coupon';
    couponLists: { couponId: string; num: number; couponName: string }[];
  };
};

export type TDiscountInfoList = (
  | IDiscountInfoListItems['money']
  | IDiscountInfoListItems['coupon']
)[];

type AddDiscountListProps = {
  value: any;
  onChange: (value: any) => void;
};

export const Main = ({ value, onChange }: AddDiscountListProps) => {
  const [state, setState] = useImmer({
    discountInfoObject: {} as IDiscountInfoListItems,
  });

  useDebounceWatch(() => {
    if (value === undefined) {
      setState((draft) => {
        draft.discountInfoObject = {} as IDiscountInfoListItems;
      });
    }
  }, [value]);

  useDebounceWatch(() => {
    onChange(Object.keys(state.discountInfoObject).length ? state.discountInfoObject : undefined);
  }, [state.discountInfoObject]);

  const handleDeleteMoney = () => {
    setState((draft) => {
      delete draft.discountInfoObject.money;
    });
  };

  const handleDeleteCouponByIndex = (index: number) => () => {
    setState((draft) => {
      draft.discountInfoObject.coupon.couponLists.splice(index, 1);
    });
  };

  const addSuccess = useCallback(
    (values: { type: keyof IDiscountInfoListItems } & Record<string, any>) => {
      setState((draft) => {
        const { type, ...lastValues } = values;

        // eslint-disable-next-line default-case
        switch (type) {
          case 'money':
            if (!draft.discountInfoObject[type]) {
              draft.discountInfoObject[type] = { amount: lastValues.amount } as any;
            } else {
              draft.discountInfoObject[type].amount += lastValues.amount;
            }
            break;

          // 同一个优惠券，选了多次，自动叠加数量, 送的储值卡金额也一样
          case 'coupon': {
            if (!draft.discountInfoObject[type]) {
              draft.discountInfoObject[type] = { couponLists: lastValues.couponLists } as any;
            } else {
              (lastValues.couponLists as IDiscountInfoListItems['coupon']['couponLists']).forEach(
                (item) => {
                  const { couponLists } = draft.discountInfoObject[type];
                  const index = couponLists.findIndex((v) => v.couponId === item.couponId);

                  if (index === -1) {
                    couponLists.push(item);
                  } else {
                    couponLists[index].num += item.num;
                  }
                },
              );
            }
          }
        }
      });
    },
    [],
  );

  const renderListItem = (item: TDiscountInfoList[0]) => {
    switch (item.type) {
      case 'money': {
        return (
          <div className={styles.couponListItem}>
            <span>
              送储值卡金额：<MoneyText>{item.amount}</MoneyText>
            </span>

            <a onClick={handleDeleteMoney}>删除</a>
          </div>
        );
      }

      case 'coupon': {
        return item.couponLists?.map((v, idx) => (
          <div key={v.couponId} className={styles.couponListItem}>
            <span>
              送优惠券：{v.couponName} <span style={{ marginLeft: 6 }}>x{v.num}</span>
            </span>

            <a onClick={handleDeleteCouponByIndex(idx)}>删除</a>
          </div>
        ));
      }

      default:
        return '';
    }
  };

  return (
    <div className={styles.wrapper}>
      <Divider />
      <div className={styles.header}>
        <div>活动优惠（必选一个优惠）</div>
        <ModalForm addSuccess={addSuccess} />
      </div>

      <List
        itemLayout="horizontal"
        dataSource={Object.keys(state.discountInfoObject).map((type) => ({
          type,
          ...state.discountInfoObject[type],
        }))}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={renderListItem(item)} />
          </List.Item>
        )}
      />
    </div>
  );
};

export const AddDiscountList = Main;
