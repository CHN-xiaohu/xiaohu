import { useCallback, useEffect } from 'react';
import { Spin } from 'antd';

import { stringify } from 'qs';
import { useBoolean, useRequest, useEventListener } from 'ahooks';

import { history } from 'umi';

import { safeJsonParse } from '@/utils';

import { getToken, syncDesign } from './Api';

import styles from './index.less';

const defaultDest = 4;

const Design = () => {
  const [loading, loadingAction] = useBoolean(true);
  const { location } = history;

  useEffect(() => {
    window.document
      .getElementsByTagName('section')[0]
      .getElementsByTagName('div')[0].style.display = 'none';
    window.document.getElementsByTagName('aside')[0].style.display = 'none';
    window.document.getElementsByTagName('main')[0].style.margin = '0';
    window.document.getElementsByTagName('header')[0].style.display = 'none';
  }, []);

  const { data: accessToken } = useRequest(
    () =>
      getToken({
        dest: defaultDest,
        ...location.query,
      }),
    {
      formatResult: (res) => res.data,
      onError: () => {
        history.replace('/users/login');
      },
    },
  );

  /**
   * 监听方案变动
   *
   * @ref https://open.kujiale.com/open/apps/1/docs?doc_id=67&kpm=qkWL.005853d39357deef.27d250e.1600654923184
   */
  const handleKuJiaLePostMessage = useCallback((e: MessageEvent) => {
    /**
     * @ref https://open.kujiale.com/open/apps/1/docs?doc_id=67&kpm=qkWL.005853d39357deef.27d250e.1600656743653
     */
    if (
      String(e.data).indexOf('{"action":') !== 0 ||
      ![
        'http://www.kujiale.com',
        'http://yun.kujiale.com',
        'https://www.kujiale.com',
        'https://yun.kujiale.com',
      ].includes(e.origin)
    ) {
      return;
    }

    const data = safeJsonParse(e.data);

    // eslint-disable-next-line default-case
    switch (data.action) {
      case 'kjl_saved':
        // 同步保存方案
        syncDesign();
        break;

      // 加载完成
      case 'kjl_loaded':
        loadingAction.setFalse();
        break;
    }
  }, []);

  useEventListener('message', handleKuJiaLePostMessage, { target: () => window, capture: false });

  return (
    <Spin spinning={loading} tip="设计编辑器加载中..." size="large">
      <div className={styles.wrap}>
        {accessToken && (
          <iframe
            title="design"
            src={`https://www.kujiale.com/v/auth?${stringify({
              accesstoken: accessToken,
              dest: defaultDest,
              ...location.query,
            })}`}
          />
        )}
      </div>
    </Spin>
  );
};

export default Design;
