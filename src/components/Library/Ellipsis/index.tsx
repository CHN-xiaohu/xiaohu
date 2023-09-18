/* eslint-disable no-shadow */
import * as React from 'react';
// import { unmountComponentAtNode } from 'react-dom';
import { Tooltip, Typography } from 'antd';
import { useSize, useDebounceFn } from 'ahooks';
import { useImmer } from 'use-immer';
import { areEqual } from 'react-window';

/**
 * @ref https://github.com/ant-design/ant-design/blob/master/components/typography/util.tsx
 * @ref https://github.com/ant-design/ant-design/blob/c7d376001aa9b58022265163155ef8de967c6b98/components/typography/Base.tsx#L320
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import findDOMNode from 'rc-util/lib/Dom/findDOMNode';
import measure from 'antd/lib/typography/util';

import { useDebounceWatch, useUnmountedFlag } from '@/foundations/hooks';

import { pxToNumber } from './Util';

import './index.less';

export type EllipsisProps = {
  rows?: number;
  isTooltip?: boolean;
  maxWidth?: number;
  minWidth?: number;
  copyable?: true;
  ellipsis?: boolean;
  children?: string;
};

const ELLIPSIS_STR = '...';

export const Component: React.FC<EllipsisProps> = ({
  rows = 1,
  isTooltip = true,
  maxWidth,
  // minWidth = 6,
  copyable = false,
  ellipsis = true,
  children,
}) => {
  const [state, setState] = useImmer({
    isEllipsis: false,
    text: '',
    content: [] as React.ReactNode,
    display: ellipsis ? 'none' : '',
  });

  const { unmountedFlag } = useUnmountedFlag();

  const targetDomRef = React.useRef<HTMLDivElement>(null);
  const targetDomSize = useSize(targetDomRef as any);

  const PerviousNodeWidth = React.useRef(1);

  // todo: 待优化计算（如果外部容器是定宽，就不会有多余计算的这种东西，但是因为大多数是用在 table 上的，这两者的宽度计算会重叠影响）
  const { run: syncEllipsis } = useDebounceFn(
    () => {
      requestAnimationFrame(() => {
        if (unmountedFlag.current) {
          return;
        }

        const { content, text, ellipsis: ellipsisValue } = measure(
          // eslint-disable-next-line react/no-find-dom-node
          findDOMNode(targetDomRef.current!),
          { rows },
          children,
          [],
          ELLIPSIS_STR,
        );

        setState((draft) => {
          if (unmountedFlag.current) {
            return;
          }

          if (draft.text !== text || draft.isEllipsis !== ellipsisValue) {
            draft.isEllipsis = ellipsisValue;
            draft.text = text;
            draft.content = content;
          }

          draft.display = '';
        });
      });
    },
    { wait: 16.6 },
  );

  React.useLayoutEffect(() => {
    // 提前获取当前容器节点的宽度，避免在下次计算的时候重复获取、操作，也避免跟类似 table 这种会自动再计算的组件冲突，减少不必须要的计算渲染
    const targetDom = targetDomRef.current!;
    const childrenElem = targetDom!.parentElement!.children || [];

    let childrenWidthCount = 0;
    if (childrenElem.length > 1) {
      for (let i = 1; i < childrenElem.length; i + 1) {
        childrenWidthCount += pxToNumber(childrenElem[i].clientWidth);
      }
    }

    const parentElementWidth = (targetDomRef.current!.parentElement as HTMLElement).clientWidth;

    /**
     * 获取当前节点的所有活动样式表
     *
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
     */
    const originStyle = window.getComputedStyle(targetDom, null);

    const lineHeight = originStyle.getPropertyValue('line-height');

    // 行高 * 显示行数 = 总的显示高度
    let maxHeight =
      pxToNumber(lineHeight) * rows +
      pxToNumber(originStyle.paddingTop) +
      pxToNumber(originStyle.paddingBottom);
    maxHeight = Number.isNaN(maxHeight) ? 0 : maxHeight;

    // 设置节点样式
    const styleCssText = [
      `height: ${Number.isNaN(maxHeight) ? 'auto' : maxHeight}px`,
      `width: ${pxToNumber(parentElementWidth) - childrenWidthCount}px`,
      'overflow: hidden',
      'display: block',
    ];

    if (maxWidth) {
      styleCssText.push(`max-width: ${maxWidth}px`);
    }

    targetDom.style.cssText = styleCssText.join('; ');
    targetDom.setAttribute('ellipsis-max-height', String(maxHeight));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(targetDomRef.current?.parentElement as HTMLElement)?.clientWidth]);

  useDebounceWatch(
    () => {
      if (!ellipsis) {
        return;
      }

      // 优化渲染计算次数，因为在 table, 可能会计算多次
      if (targetDomSize.width! && PerviousNodeWidth.current !== targetDomSize.width!) {
        PerviousNodeWidth.current = targetDomSize.width!;

        syncEllipsis();
      }
    },
    [targetDomSize.width, children],
    { ms: 16.6, isAreEqual: true, immediate: true },
  );

  return (
    <div className="ellipsis-container">
      <div ref={targetDomRef}>
        {/* 刚刚开始的时候，先隐藏起来再计算，避免高度抖动 */}
        <span style={{ display: state.display }}>
          {isTooltip && state.isEllipsis && ellipsis ? (
            <Tooltip title={String(children)}>
              {state.content}
              {ELLIPSIS_STR}
            </Tooltip>
          ) : (
            String(children)
          )}
        </span>
      </div>

      {copyable && <Typography.Paragraph copyable={{ text: String(children) }} />}
    </div>
  );
};

export const Ellipsis = React.memo(Component, areEqual);
