/* eslint-disable no-confusing-arrow */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import classNames from 'classnames';
import { Button, Dropdown, Menu, Popconfirm, Tooltip, Popover, Modal } from 'antd';
import type { ButtonSize, ButtonProps } from 'antd/lib/button';
import type { IconProps } from '@/components/Library/Icon';
import { Icons, icons } from '@/components/Library/Icon';

import type { PopconfirmProps } from 'antd/lib/popconfirm';
import type { TooltipProps } from 'antd/lib/tooltip';
import type { PopoverProps } from 'antd/lib/popover';

import { isObj } from '@/utils';

import type { ModalFuncProps } from 'antd/es/modal';

import styles from './index.less';

export type TDescription =
  | ({ type: 'tooltip' } & TooltipProps)
  | ({ type: 'popover' } & PopoverProps);

export type ActionButtonProps = {
  text: string | React.ReactNode;
  onClick?: (params?: any | React.MouseEvent) => void;
  // 是否隐藏
  visible?: boolean;
  popconfirmProps?: Partial<PopconfirmProps>;
  modalProps?: Partial<ModalFuncProps>;
  render?: (props: ButtonProps) => React.ReactNode;
  description?: TDescription | string | React.ReactNode;
  icon?: IconProps['type'];
} & ButtonProps;

export type ButtonListProps = {
  className?: string;
  style?: React.CSSProperties;
  list: ActionButtonProps[];
  size?: ButtonSize;

  // 直接展示的个数
  maxCount?: number;

  isDivider?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;

  // 自定义更多操作节点
  more?: React.ReactNode;
  moreText?: string | React.ReactNode;
  moreType?: 'text' | 'icon' | 'simple';
  isLink?: boolean;

  align?: 'left' | 'center' | 'right';
};

const prefixCls = 'ant-button-list';

const PopconfirmButton: React.FC<{
  btnProps: ButtonProps;
  popconfirmProps: Partial<PopconfirmProps>;
}> = ({ btnProps, popconfirmProps }) => (
  <Popconfirm
    {...{
      title: '您确定要删除该项嘛?',
      okText: '确定',
      cancelText: '取消',
      ...popconfirmProps,
    }}
  >
    <Button {...btnProps} />
  </Popconfirm>
);

const filterVisible = (list: ButtonListProps['list']) =>
  list.filter((item) => item.visible !== false);

export const Main: React.FC<ButtonListProps> = (props) => {
  const {
    maxCount = 3,
    size,
    isLink = false,
    moreType = 'text',
    moreText = '更多',
    isDivider = false,
    className,
    style,
    more,
    isLoading,
    isDisabled,
    list = [],
    align = 'left',
  } = props;

  const [modal, contextHolder] = Modal.useModal();

  const moreRender = () => {
    if (more) {
      return more;
    }

    if (moreType === 'text') {
      return (
        <span>
          {moreText} <icons.DownOutlined />
        </span>
      );
    }

    return (
      <span>
        <icons.MoreOutlined />
      </span>
    );
  };

  const renderButtons = () => {
    const buttons = filterVisible(list).slice(0, maxCount);

    return buttons.map((item, index) => {
      const {
        text,
        type,
        className: currentClassName,
        visible,
        loading,
        disabled,
        popconfirmProps,
        modalProps,
        icon,
        ...buttonProps
      } = item;

      let IconComponent;
      if (icon) {
        IconComponent = <Icons type={icon} />;
      }

      const currentButtonProps = {
        size: isLink ? size || 'small' : size,
        loading: isLoading || loading,
        disabled: isDisabled || disabled,
        ...buttonProps,
        type: isLink ? 'link' : type,
        icon: IconComponent,
        className: classNames(currentClassName, {
          [`${prefixCls}__button-${type}`]: isLink,
          [`${prefixCls}__divider`]: isDivider,
        }),
      };

      const commonProps = {
        key: index,
        btnProps: { ...currentButtonProps, children: text },
      };

      const wrapButtonProps = { key: commonProps.key, ...commonProps.btnProps };

      // 自定义渲染
      if (item.render) {
        return item.render(wrapButtonProps);
      }

      // button 渲染内容
      let ContextRender = (
        <Button
          {...{
            ...wrapButtonProps,
            onClick: (e) =>
              modalProps
                ? modal.confirm({
                    title: '提示',
                    ...modalProps,
                  })
                : wrapButtonProps.onClick?.(e),
          }}
        />
      );

      if (popconfirmProps) {
        ContextRender = (
          <PopconfirmButton
            {...{
              ...commonProps,
              popconfirmProps,
            }}
          />
        );
      }

      // 带有 description 参数的 button, 会以 Tooltip/Popover 的组件呈现
      if (item.description) {
        let DescriptionComponent: any = Tooltip;
        let descriptionProps = { title: item.description } as Record<string, any>;
        if (isObj(item.description) && (item.description as any).type) {
          const {
            type: descriptionType,
            ...lastDescriptionProps
          } = item.description as TDescription;

          descriptionProps = lastDescriptionProps;
          if (descriptionType === 'popover') {
            DescriptionComponent = Popover;
          }
        }

        return (
          <div key={index} className={styles.descriptionWrapper}>
            {ContextRender}
            <DescriptionComponent {...descriptionProps}>
              <icons.QuestionCircleOutlined />
            </DescriptionComponent>
          </div>
        );
      }

      // 默认渲染
      return ContextRender;
    });
  };

  const renderMoreMenus = () => {
    const menus = filterVisible(list).slice(maxCount);

    if (!menus.length) {
      return null;
    }

    return (
      <Dropdown
        overlay={
          <Menu>
            {menus.map((item, index) => (
              <Menu.Item
                key={index}
                onClick={(e) => {
                  item.modalProps
                    ? modal.confirm({
                        title: '提示',
                        ...item.modalProps,
                      })
                    : item.onClick?.(e);
                }}
                disabled={item.disabled}
              >
                {item.render || item.text}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        <Button size={size} type={isLink ? 'link' : 'default'}>
          {moreRender()}
        </Button>
      </Dropdown>
    );
  };

  return (
    <div
      className={classNames(
        className,
        prefixCls,
        {
          'is-link': isLink,
        },
        styles[`align-${align}`],
      )}
      style={style}
    >
      {contextHolder}
      {renderButtons()}
      {renderMoreMenus()}
    </div>
  );
};

export const ButtonList = React.memo(Main);
