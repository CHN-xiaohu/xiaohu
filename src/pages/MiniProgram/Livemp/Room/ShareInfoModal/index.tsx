import { useImperativeHandle, forwardRef, useRef } from 'react';
import { Button, Empty, Spin, Typography } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

import { download } from '@spark-build/web-utils';

import styles from './index.less';

import { getLiveRoomShareInfo } from '../../api';

export type RefProps = {
  open: (roomId: number) => void;
};

export const useShareInfoModalActionsRef = () => {
  const actionsRef = useRef<RefProps>(null);

  return {
    actionsRef,
  };
};

const ImageBlock = ({
  image,
  title,
  desc,
  imageClassName = styles.image,
}: {
  image: string;
  imageClassName?: string;
  title: string;
  desc: string;
}) => (
  <div className={styles.itemRow}>
    <div className={styles.text}>
      <div className={styles.title}>{title}</div>
      <div className={styles.desc}>{desc}</div>

      <Button type="primary" ghost style={{ marginTop: 20 }} onClick={() => download(image)}>
        保存图片
      </Button>
    </div>

    <img className={imageClassName} src={image.replace('http://', 'https://')} alt={title} />
  </div>
);

export const ShareInfoModal = forwardRef<RefProps, any>((_, ref) => {
  const [visible, visibleActions] = useBoolean();

  const { run, loading, data } = useRequest(getLiveRoomShareInfo, {
    manual: true,
    formatResult: (res) => res.data,
  });

  useImperativeHandle(ref, () => ({
    open: (roomId: number) => {
      visibleActions.toggle();
      run({ roomId });
    },
  }));

  return (
    <ModalWrapper
      {...{
        title: '分享',
        visible,
        bodyStyle: {
          backgroundColor: '#f0f2f5',
        },
        footer: false,
        onCancel: () => visibleActions.setFalse(),
        isNativeAntdStyle: true,
        width: 808,
        style: {
          height: 550,
        },
        children: (
          <Spin spinning={loading}>
            <div className={styles.wrap}>
              {(data && data.cdnUrl && (
                <>
                  <div className={styles.flexRow}>
                    <div className={styles.poster}>
                      <ImageBlock
                        image={data.posterUrl}
                        title="直播间分享海报"
                        desc="小程序码不带参数"
                      />
                    </div>

                    <div className={styles.code}>
                      <ImageBlock
                        image={data.cdnUrl}
                        imageClassName={styles.qrcode}
                        title="直播间小程序码"
                        desc="小程序码不带参数"
                      />
                    </div>
                  </div>
                  <div className={styles.flexRow}>
                    <div className={styles.pagePath}>
                      <div className={styles.column}>
                        <div className={styles.title}>直播间页面路径</div>
                        <div className={styles.content}>
                          <Typography.Text copyable type="secondary">
                            {data.pagePath}
                          </Typography.Text>
                        </div>
                        <div className={styles.desc}>
                          链接是直播间原始页面路径，如需加入参数，详见
                          <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/liveplayer/live-player-plugin.html">
                            使用方法
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )) || (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ marginTop: '13%' }}
                  description="暂无分享数据"
                />
              )}
            </div>
          </Spin>
        ),
      }}
    />
  );
});
