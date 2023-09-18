/**
 * 自动补全的 base url 的 image 组件
 */
import * as React from 'react';

type Props = {
  src: string;
  style?: React.CSSProperties;
  className?: string;
};

export const BackgroundImage = (props: Props) => {
  const { src, style, ...other } = props;
  const newSrc = /^(http|https)?:\/\//.test(src || '')
    ? src
    : `${window.$appBaseResourceUrl}${src}`;

  const defaultStyle = {
    backgroundColor: 'transparent',
    backgroundSize: 'contain',
    backgroundPosition: '50% center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-color 0.3s ease 0s',
    backgroundImage: `url(${newSrc})`,
  };

  return <div {...{ style: { ...defaultStyle, ...style }, ...other }} />;
};
