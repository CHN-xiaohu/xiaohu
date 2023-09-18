/**
 * 自动补全的 base url 的 image 组件
 */
import * as React from 'react';

type Props = {
  //
} & React.ImgHTMLAttributes<any>;

export const Image = (props: Props) => {
  const src = /^(http|https)?:\/\//.test(props.src || '')
    ? props.src
    : `${window.$appBaseResourceUrl}${props.src}`;

  return <img {...{ alt: 'Invalid path', ...props, src }} />;
};
