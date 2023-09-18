import * as React from 'react';
// import { Link } from 'umi';

import styles from './index.less';

export default function UserLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            {/* <Link to="/"> */}
            <img alt="logo" className={styles.logo} src={window.injectionGlobalDataSource.logo} />
            <span className={styles.title}>{window.injectionGlobalDataSource.name}</span>
            {/* </Link> */}
          </div>

          <div className={styles.desc}>{window.injectionGlobalDataSource.info}</div>
        </div>
        {children}
      </div>
    </div>
  );
}
