import React, { useCallback, useState } from 'react';

import { isObj } from '@/utils';

type OmitVisibleFromProps<P> = Omit<P, 'visible'>;

type Opts<P> = {
  ComponentElement: React.FunctionComponent<P> | React.ComponentClass<P>;
  defaultProps?: OmitVisibleFromProps<P>;
  deps?: any[];
  isAutoSetOnOkFunc?: boolean;
};

export const useMakeVisibleHooks = <
  P extends {
    onCancel?: Function;
  },
>({
  ComponentElement,
  defaultProps,
  deps = [],
  isAutoSetOnOkFunc = true,
}: Opts<P>) => {
  const [state, setState] = useState<P & { visible: boolean }>(defaultProps || ({} as any));

  const open = useCallback((props?: Partial<OmitVisibleFromProps<P>>) => {
    const realProps = isObj(props) ? props : {};

    setState((s) => ({ ...s, ...(realProps as P), visible: true as boolean }));
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  const renderElement = React.useMemo(() => {
    const props = { onCancel: close, ...state } as OmitVisibleFromProps<any>;

    if (isAutoSetOnOkFunc && !props.onOk) {
      props.onOk = close;
    }

    return React.createElement(ComponentElement, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, deps, isAutoSetOnOkFunc]);

  return {
    open,
    close,
    renderElement,
    props: state,
  };
};
