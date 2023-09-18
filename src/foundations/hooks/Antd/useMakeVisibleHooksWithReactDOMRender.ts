import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';

import { StandardWrapper } from '@/layouts/Wrapper/StandardWrapper';

export const useMakeVisibleHooksWithReactDOMRender = <P extends { onCancel?: Function }>(
  ContainerNode: Element,
  ComponentElement: React.FunctionComponent<P> | React.ComponentClass<P> | string,
) => {
  const [state, setState] = useState<P & { visible: boolean }>({} as any);

  const open = useCallback((props: Omit<P, 'visible'>) => {
    setState(() => ({ ...props, visible: true } as any));
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  const render = useCallback(
    (props: P) => {
      ReactDOM.render(
        React.createElement(
          StandardWrapper,
          {},
          React.createElement(ComponentElement, { onCancel: close, ...props }),
        ),
        ContainerNode,
      );
    },
    [ComponentElement, ContainerNode, close],
  );

  useEffect(() => {
    render(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    open,
    close,
    visible: state.visible,
  };
};
