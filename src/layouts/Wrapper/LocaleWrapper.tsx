import EventEmitter from 'events';

import * as React from 'react';
import { ConfigProvider } from 'antd';
import { getLocale, getIntl, RawIntlProvider, localeInfo } from 'umi';

export const event = new (EventEmitter as any)();
event.setMaxListeners(5);
export const LANG_CHANGE_EVENT = Symbol('LANG_CHANGE');

/**
 * 用于封装 hooks 的时候，在 ReactDOM.render 的时候，做外层的包装，以保证多语言的设置跟项目是一致的
 *
 * @see /pages/.umi/LocaleWrapper.jsx
 */
export function LocaleWrapper(props: React.PropsWithChildren<{}>) {
  const [locale, setLocale] = React.useState(() => getLocale());
  const [intl, setContainerIntl] = React.useState(() => getIntl(locale, true));

  const handleLangChange = (localeValue: any) => {
    setLocale(localeValue);
    setContainerIntl(getIntl(localeValue));
  };

  React.useLayoutEffect(() => {
    event.on(LANG_CHANGE_EVENT, handleLangChange);
    return () => {
      event.off(LANG_CHANGE_EVENT, handleLangChange);
    };
  }, []);

  return (
    <ConfigProvider locale={localeInfo[locale]?.antd}>
      <RawIntlProvider value={intl}>{props.children}</RawIntlProvider>
    </ConfigProvider>
  );
}
