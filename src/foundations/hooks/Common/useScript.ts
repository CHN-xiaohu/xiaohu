import { useState, useEffect } from 'react';

type IOptions = {
  load?: () => void;
  error?: () => void;
};

// 缓存加载过的 script url 集合
const cachedScripts: string[] = [];

export function useScript(src: string, options?: IOptions) {
  const { load, error } = options || {};
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    if (cachedScripts.includes(src)) {
      load?.();

      setState({
        loaded: true,
        error: false,
      });

      return () => {};
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = src;

    // 监听加载完成
    const onScriptLoad = () => {
      cachedScripts.push(src);

      load?.();

      setState({
        loaded: true,
        error: false,
      });
    };

    // 监听加载异常
    const onScriptError = () => {
      error?.();

      setState({
        loaded: true,
        error: true,
      });
    };

    script.addEventListener('load', onScriptLoad);
    script.addEventListener('error', onScriptError);

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', onScriptLoad);
      script.removeEventListener('error', onScriptError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return {
    ...state,
  };
}
