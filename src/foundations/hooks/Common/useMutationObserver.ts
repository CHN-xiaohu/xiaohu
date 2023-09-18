import { useEffect, useRef, useState, useCallback } from 'react';

import { useDebounceByMemo } from '../Help';

export type State = {
  //
} & Partial<MutationRecord>;

type IOptions = {
  config?: MutationObserverInit;
  debounceMs?: number;
  mutationCallback?: (mutations: MutationRecord[], observer: MutationObserver) => MutationRecord;
};

export const useMutationObserver = <TR = HTMLElement>({
  config = {},
  mutationCallback,
  debounceMs = 160,
}: IOptions) => {
  const mutationObserverRef = useRef<MutationObserver>();
  const [state, setState] = useState<State>({});
  const targetDomRef = useRef<TR>() as React.RefObject<TR>;
  const mutationObserverClose = useRef(false);

  const handleMutationCallback: MutationCallback = useCallback(
    (mutationsList, observe) => {
      if (mutationObserverClose.current) {
        return;
      }

      const data = mutationCallback
        ? mutationCallback(mutationsList, observe)
        : mutationsList[mutationsList.length - 1];

      setState(data);
    },
    [mutationCallback],
  );

  const mutationCallbackDebounce = useDebounceByMemo(handleMutationCallback, { delay: debounceMs });

  const handleMutationObserver = useCallback(() => {
    if (targetDomRef.current) {
      // 创建 observer 实例
      mutationObserverRef.current = new MutationObserver(mutationCallbackDebounce);

      /**
       * 开启 observer 监听
       *
       * @see https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/observe
       */
      mutationObserverRef.current.observe(
        targetDomRef.current as any,
        // @see https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserverInit
        {
          attributes: true,
          childList: false,
          characterData: false,
          subtree: false,
          ...config,
        },
      );

      // 用于触发一次初始渲染，以便能精准进行计算
      setState(Object.create({}));
    }
  }, [config, mutationCallbackDebounce]);

  const reMutationObserver = useCallback(
    (newDom?: HTMLDivElement | HTMLElement | Element) => {
      if (mutationObserverRef.current) {
        // 先停止原先的 observer
        mutationObserverRef.current.disconnect();
      }

      if (newDom) {
        (targetDomRef as any).current = newDom;
      }

      handleMutationObserver();
    },
    [handleMutationObserver],
  );

  useEffect(() => {
    handleMutationObserver();

    return () => {
      mutationObserverClose.current = true;

      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDomRef.current]);

  return {
    targetDomRef,
    targetDom: targetDomRef.current,
    reMutationObserver,
    ...state,
  };
};
