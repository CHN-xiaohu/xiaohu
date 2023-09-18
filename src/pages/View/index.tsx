import type { RouteChildrenProps } from '@/typings/basis';
import { getContentContainerHeight } from '@/utils';
import { Card, Empty } from 'antd';

import styles from './index.less';

export default function View(props: RouteChildrenProps) {
  const { url } = props.location.query || {};

  return (
    <Card className={styles.frame}>
      {url ? (
        <iframe
          key={url}
          src={url}
          style={{
            height: getContentContainerHeight() - 8,
          }}
        />
      ) : (
        <Empty style={{ margin: '32vh 0' }} />
      )}
    </Card>
  );
}
