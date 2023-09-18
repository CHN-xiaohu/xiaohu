import * as React from 'react';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useImmer } from 'use-immer';
import { useWatch } from '@/foundations/hooks';

const conditionOptions = {
  default: '综合',
  MinSupplyPrice: '供货价',
  updateTime: '更新时间',
};

type TConditionOptionsKeys = keyof typeof conditionOptions;

const conditionKeys = Object.keys(conditionOptions) as TConditionOptionsKeys[];

type TOrderTypes = 'ASC' | 'DESC';

type Props = {
  onChange: (v: any[]) => void;
};

export const Sorting = React.memo(({ onChange }: Props) => {
  const [state, setState] = useImmer({
    active: 'default',
    order: '' as TOrderTypes | '',
  });

  const getSortActiveColor = React.useCallback(
    (type: TOrderTypes) => (type === state.order ? '#188fff' : '#E0E0E0'),
    [state.order],
  );

  const handleClickConditionItem = (active: TConditionOptionsKeys) => () => {
    setState((draft) => {
      if (active !== 'default') {
        if (active !== draft.active) {
          draft.order = 'ASC';
        } else {
          draft.order = draft.order === 'ASC' ? 'DESC' : 'ASC';
        }
      } else {
        draft.order = '';
      }
      draft.active = active;
    });
  };

  const handleClickOrder = (obj: typeof state) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setState((draft) => {
      Object.assign(draft, obj);
    });
  };

  useWatch(() => {
    onChange([[state.active, state.order].join(',')]);
  }, [state]);

  return (
    <div className="sort-content">
      {conditionKeys.map((k) => {
        const OrderCom = () => {
          const getColor = (type: TOrderTypes) =>
            state.active === k ? getSortActiveColor(type) : '';

          const getCurrentObj = (order: TOrderTypes) => ({ active: k, order });

          return (
            <span className="icons">
              <CaretUpOutlined
                className="up-icon"
                style={{ color: getColor('ASC') }}
                onClick={handleClickOrder(getCurrentObj('ASC'))}
              />
              <CaretDownOutlined
                className="down-icon"
                onClick={handleClickOrder(getCurrentObj('DESC'))}
                style={{ color: getColor('DESC') }}
              />
            </span>
          );
        };

        return (
          <div
            key={k}
            className={state.active === k ? 'active-item' : 'sort-item'}
            onClick={handleClickConditionItem(k)}
          >
            <span>{conditionOptions[k]}</span>
            {k !== 'default' && OrderCom()}
          </div>
        );
      })}
    </div>
  );
});
