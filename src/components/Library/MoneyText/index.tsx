import React from 'react';

import { isStr, isNum, convertNumberToChinese } from '@/utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface MoneyTextProps {
  digits?: number | string;
  toChinese?: true;
  toLocale?: true;
  className?: string;
  currency?: string | React.ReactNode;
  style?: React.CSSProperties;
}

export const toFixed = (val?: string | number, digits: string | number = 2) =>
  parseFloat((val as string) || '0').toFixed(Number(digits));

export const MoneyText: React.FC<MoneyTextProps> = React.memo(
  ({ children, toChinese, toLocale, className, digits = 2, currency = '￥', style }) => {
    let text = children;

    if (isStr(text) || isNum(text)) {
      if (digits) {
        text = toFixed(text, digits);
      }

      if (toChinese) {
        text = convertNumberToChinese(String(text));
      }

      if (toLocale) {
        text = text.toLocaleString();
      }
    }

    return (
      <span className={`money-text ${className || ''}`} style={style}>
        <span className="money-text--symbol">{currency}</span>
        {text}
      </span>
    );
  },
);
