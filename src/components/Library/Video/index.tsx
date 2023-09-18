/* eslint-disable @typescript-eslint/no-unused-expressions */

/**
 * 包一层，方便以后切换
 */
import * as React from 'react';
import { useDebounceEffect, useUnmount, useMount } from 'ahooks';
import classNames from 'classnames';

import VideoMain from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/sea/index.css';

import { isFn } from '@/utils';

type TLanguage = 'zh' | 'en';

type Props = {
  subtitles?: {
    language: TLanguage;
    url: string;
    label: string;
  }[];
  language?: TLanguage;
  src: string;
  poster?: string;
  options?: VideoMain.PlayerOptions;
  playInline?: boolean;
  crossOrigin?: string;
  style?: React.CSSProperties;
  className?: string;
  onTimeupdate?: () => void;
};

const DEFAULT_OPTIONS = {
  controls: true, // 是否显示控制条
  controlBar: {
    // 显示控制条内容
    timeDivider: true, // 时间分割线
    durationDisplay: true, // 显示时间
    remainingTimeDisplay: false, // 剩余时间显示
    fullscreenToggle: true, // 切换全屏
    subtitlesButton: true, // 字幕按钮
  },
  techOrder: ['html5'],
  autoplay: false, // 自动播放
  muted: false,
  loop: false, // 循环播放
  preload: 'none', // 预加载
  // language: 'zh', // 展示语言
  aspectRatio: '16:9', // 比例
  fluid: true,
  poster: '', // 封面图
  // sources: [],
  subtitles: [], // 字幕
  defaultSubtitle: '', // 默认字幕
  // width: document.documentElement.clientWidth,
};

// const DEFAULT_EVENTS = [
//   'loadeddata',
//   'canplay',
//   'canplaythrough',
//   'play',
//   'pause',
//   'waiting',
//   'playing',
//   'ended',
//   'error',
// ];

export const Video = React.memo(
  ({
    subtitles = [],
    language = 'zh',
    playInline = false,
    crossOrigin = '',
    src,
    poster,
    style,
    className,
    options = DEFAULT_OPTIONS,
    ...lastProps
  }: Props) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [player, setPlayer] = React.useState<VideoMain.Player>(null as any);

    const initialize = React.useCallback(() => {
      const { current: videoEl } = videoRef;

      if (!videoEl || player) {
        return;
      }

      // 添加行内播放
      if (playInline) {
        videoEl.setAttribute('webkit-playsinline', 'true');
        videoEl.setAttribute('playsInline', 'true');
        videoEl.setAttribute('x5-playsinline', 'true');
        videoEl.setAttribute('x5-video-player-type', 'h5');
        videoEl.setAttribute('x5-video-player-fullscreen', 'false');
      }

      // 跨域视频请求
      if (crossOrigin) {
        videoEl.crossOrigin = crossOrigin;
        videoEl.setAttribute('crossOrigin', crossOrigin);
      }

      // 防止出现报错： "VIDEOJS: ERROR: Unable to find plugin: __ob__"
      // if (options.plugins) {
      //   this.setState(prevState => {
      //     delete prevState.plugins.__ob__;
      //     return prevState;
      //   })
      // }

      const createPlayer = VideoMain(
        videoEl,
        { sources: [{ src }], poster, ...options },
        function (this: VideoMain.Player) {
          // events
          // const events = DEFAULT_EVENTS.concat(lastProps.events)

          // // 监听事件
          // const onEdEvents = {};
          // for (let i = 0; i < events.length; i += 1) {
          //   if (typeof events[i] === 'string' && onEdEvents[events[i]] === undefined) {
          //     (event => {
          //       onEdEvents[event] = null;
          //       this.on(event, () => {
          //         if (typeof context.props[event] === 'function') context.props[event](true);
          //       });
          //     })(events[i]);
          //   }
          // }

          // 监听事件更新事件
          // eslint-disable-next-line react/no-this-in-sfc
          this.on('timeupdate', function listener() {
            if (isFn(lastProps.onTimeupdate)) {
              lastProps.onTimeupdate();
            }
          });
        },
      );

      setPlayer(createPlayer);
    }, [crossOrigin, lastProps, options, playInline, player, poster, src]);

    useMount(() => {
      initialize();
    });

    useUnmount(() => {
      player?.dispose();
    });

    useDebounceEffect(
      () => {
        if (player) {
          src && player.src(src);
          poster && player.poster(poster);
        }
      },
      [poster, src],
      { wait: 100 },
    );

    const renderSubtitles = subtitles.map((item, index) => (
      <track
        // eslint-disable-next-line react/no-array-index-key
        key={item.url + index}
        src={item.url}
        kind="captions"
        srcLang={item.language}
        label={item.label}
        default={item.language === language}
      />
    ));

    return (
      <div>
        <video
          id="video_component"
          ref={videoRef}
          style={style}
          className={classNames('video-js vjs-theme-sea', className)}
        >
          {renderSubtitles}
        </video>
      </div>
    );
  },
);
