import { useState, useEffect } from 'react';
import * as React from 'react';
import type { Location } from 'history';
import { history } from 'umi';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { check } from '../../permission';

type IProps = {
  location: Location;
};

export const Authorized: React.FC<IProps> = React.memo(({ children, location }) => {
  const { userInfo } = useStoreState('user');
  const [isRender, setIsRender] = useState(false);

  useEffect(() => {
    // 执行验证
    const executeAuthorized = async () => {
      // 判断权限
      const checkResult = await check(location.pathname, userInfo);
      if (checkResult) {
        history.push({
          ...location,
          pathname: checkResult,
        });

        return;
      }

      // 没有问题再渲染
      setIsRender(true);
    };

    executeAuthorized();
  }, [location, userInfo]);

  return <>{isRender ? children : null}</>;
});
