import React from 'react';
import type { ButtonListProps } from '@/components/Library/ButtonList';
import { ButtonList } from '@/components/Library/ButtonList';

export interface ISkuActionsProps {
  loading?: boolean;
  buyButtonProps?: Omit<ButtonListProps['list'][number], 'onClick'>;
  addCartButtonProps?: ISkuActionsProps['buyButtonProps'];
  showAddCartBtn?: boolean;
  showBuyBtn?: boolean;
  onAddCart?: () => void;
  onBuy?: () => void;
}

export const SkuActions = ({
  loading,
  buyButtonProps,
  addCartButtonProps,
  showAddCartBtn,
  showBuyBtn,
  onAddCart,
  onBuy,
}: ISkuActionsProps) => {
  return (
    <div className="sku-actions">
      <ButtonList
        list={[
          {
            size: 'large',
            type: 'primary',
            visible: showAddCartBtn,
            text: '加入购物车',
            loading,
            ...addCartButtonProps,
            onClick: onAddCart,
          },
          {
            size: 'large',
            type: 'primary',
            ghost: true,
            loading,
            visible: showBuyBtn,
            text: '立即购买',
            ...buyButtonProps,
            style: {
              width: showAddCartBtn ? undefined : '100%',
              ...(buyButtonProps?.style || {}),
            },
            onClick: onBuy,
          },
        ]}
      />
    </div>
  );
};
