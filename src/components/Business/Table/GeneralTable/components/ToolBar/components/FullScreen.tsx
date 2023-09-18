import { memo } from 'react';
import type { IntlShape } from 'umi';
import { Tooltip } from 'antd';
import { icons } from '@/components/Library/Icon';
import { useFullscreen } from 'ahooks';

import { Container } from '../../../Container';

type IProps = {
  className?: string;
  intl: IntlShape;
};

export const FullScreen = memo<IProps>(({ intl }) => {
  const tableStore = Container.useContainer();

  const [isFullscreen, { toggleFull }] = useFullscreen(tableStore.containerRef);

  const id = isFullscreen ? 'table.toolBar.exitFullScreen' : 'table.toolBar.fullScreen';

  // 用 Icons 组件再包一层的话，会导致 forwardRef 异常，see: https://github.com/ant-design/ant-design/issues/21921
  const IconComponent = isFullscreen ? icons.FullscreenExitOutlined : icons.FullscreenOutlined;

  return (
    <Tooltip title={intl.formatMessage({ id })}>
      <IconComponent onClick={toggleFull} />
    </Tooltip>
  );
});
