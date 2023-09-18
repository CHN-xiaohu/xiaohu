import { useDebounceFn, useEventListener, useUnmount } from 'ahooks';
import { useRef, useState } from 'react';

const MAX_TRY_NUMBER = 10;

export function useModalScroll({ handleBottom }: { handleBottom: () => void }) {
  const tryCountRef = useRef(MAX_TRY_NUMBER);
  const tryIntervalRef = useRef(0);
  const [scrollDom, setScrollDom] = useState<HTMLDivElement | null>(null);

  const handleClearInterval = () => {
    tryIntervalRef.current && clearInterval(tryIntervalRef.current);
  };

  const { run } = useDebounceFn(
    () => {
      if (
        scrollDom &&
        scrollDom.scrollHeight - (scrollDom.clientHeight + scrollDom.scrollTop) < 100
      ) {
        handleBottom();
      }
    },
    { wait: 16.6 },
  );

  useEventListener('scroll', run, { target: scrollDom });

  const startScrollListener = () => {
    if (scrollDom) {
      return;
    }

    tryCountRef.current = MAX_TRY_NUMBER;

    // @ts-ignore
    tryIntervalRef.current = setInterval(() => {
      if (tryCountRef.current) {
        const dom = document.querySelector('.modalContainer .ant-modal-body');
        if (dom) {
          handleClearInterval();
          setScrollDom(dom as HTMLDivElement);
        }

        tryCountRef.current -= 1;

        return;
      }

      handleClearInterval();
    }, 16.6);
  };

  useUnmount(() => {
    handleClearInterval();
  });

  return {
    modalClassName: 'modalContainer',
    startScrollListener,
  };
}
