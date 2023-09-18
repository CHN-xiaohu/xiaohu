/* eslint-disable @typescript-eslint/consistent-type-definitions */
import * as React from 'react';
import classNames from 'classnames';

import type { IFormButtonGroupProps } from '@formily/antd';
import { FormButtonGroup, createVirtualBox } from '@formily/antd';

import styles from './index.less';

interface IProps extends React.PropsWithChildren<IFormButtonGroupProps> {
  schema: any;
}

declare global {
  interface GlobalDefaultFormSchemaLayouts {
    formButtonGroup: IFormButtonGroupProps;
  }
}

// 包装一下 FormButtonGroup, 以便可以在 schema 中使用
// eslint-disable-next-line arrow-body-style
const FormButtonGroupWrapper = ({ children, style = {}, ...lastProps }: IProps) => {
  // useMount(() => {
  //   setTimeout(() => {
  //     // 去除动画效果后的 transform
  //     // transform 会影响 fixed 的效果
  //     const appMainBody = document.getElementById('app-main-body')
  //     const stickyContainer = document.querySelector('.sticky-container') as HTMLElement

  //     if (appMainBody && stickyContainer && appMainBody.style.transform) {
  //       const [leftNumber] = stickyContainer.style.left.split('px')

  //       stickyContainer.style.left = `${Number(leftNumber) - 30}px`;

  //       appMainBody.style.transform = 'unset';
  //     }
  //   }, 600)
  // })

  // todo: 待解决
  // useMount(() => {
  //   setTimeout(() => {
  //     requestAnimationFrame(() => {
  //       const event = new Event('resize');

  //       window.dispatchEvent(event);
  //     });
  //   }, 160);
  // });

  return (
    <FormButtonGroup
      style={{
        paddingTop: 5,
        textAlign: 'center',
        ...style,
      }}
      sticky
      // offset={10}
      {...lastProps}
      className={classNames(styles.formButtonGroup, lastProps.className)}
    >
      {children}
    </FormButtonGroup>
  );
};

createVirtualBox('formButtonGroup', FormButtonGroupWrapper);

export {};
