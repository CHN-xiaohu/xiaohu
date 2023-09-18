import * as React from 'react';
import { Tag } from 'antd';
import classNames from 'classnames';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.less';

import styles from './index.less';

const { CheckableTag } = Tag;

export type CheckableTagsProps = {
  value?: string | number;
  options: { label: string; value: any }[];
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: any) => void;
};

const params = {
  // slidesPerView: 6,
  slidesPerView: 'auto',
  spaceBetween: 0,
};

const Main = (props: CheckableTagsProps) => {
  const { value, onChange, options = [], className, style } = props;

  const handleChange = (values: any) => () => {
    onChange?.(values);
  };

  return (
    <div className={classNames(styles.wrapper, className)} style={style}>
      <Swiper {...params}>
        {options.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={String(item.value) + index}>
            <CheckableTag checked={item.value === value} onChange={handleChange(item.value)}>
              {item.label || ''}
            </CheckableTag>
          </span>
        ))}
      </Swiper>
    </div>
  );
};

export const CheckableTags = React.memo(Main);
