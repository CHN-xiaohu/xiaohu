import { useMemo } from 'react';
import * as React from 'react';

import type { IBScrollParams } from '@/foundations/hooks';
import { useBScroll, useMutationObserver } from '@/foundations/hooks';

type IScrollProps = {
  className?: string;
  style?: React.CSSProperties;
} & Omit<IBScrollParams, 'onInit' | 'scrollContainerRef'>;

const Main: React.FC<IScrollProps> = ({
  options,
  listenScrolls,
  className,
  style,
  children,
  direction,
}) => {
  const { targetDomRef: scrollContainerRef } = useMutationObserver<HTMLDivElement>({
    config: { attributeFilter: ['offsetHeight'] },
  });

  const { scrollInstance } = useBScroll({
    scrollContainerRef,
    options,
    direction,
    listenScrolls,
  });

  React.useEffect(() => {
    scrollInstance?.refresh?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(scrollContainerRef.current?.firstElementChild as HTMLElement)?.offsetHeight]);

  return useMemo(
    () => (
      <div ref={scrollContainerRef} style={style} className={className}>
        <div>{children}</div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [style, className, children],
  );
};

export const Scroll = React.memo(Main) as React.FC<IScrollProps>;
