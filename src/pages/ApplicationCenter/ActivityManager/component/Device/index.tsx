import classNames from 'classnames';
import dayjs from 'dayjs';

import './index.less';

/**
 * @ref https://github.com/umijs/dumi/blob/7c10c8c79fdb8c262c24275cdc9f1fe4259e7871/packages/theme-mobile/src/components/Device.tsx
 */
export function Device({ className, url }: { className?: string; url: string }) {
  return (
    <div className={classNames('__dumi-default-device', className)} data-device-type="iOS">
      <div className="__dumi-default-device-status">
        <span>design</span>
        <span>{dayjs().format('HH:mm')}</span>
      </div>
      <iframe key={url} title="dumi-previewer" src={url} />
    </div>
  );
}
