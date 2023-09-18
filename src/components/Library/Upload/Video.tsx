/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 上传管理
|
*/

import { useEffect } from 'react';

import * as React from 'react';
import { Spin, Button } from 'antd';
import classNames from 'classnames';
import type { UploadFile } from 'antd/lib/upload/interface';
import { useDebounceEffect } from 'ahooks';
import { useImmer } from 'use-immer';

import { useLoadingWrapper } from '@/foundations/hooks';

import styles from './index.less';

import { getFirstFrameOfVideo } from './Util';

import { UploadSection } from '.';
import { Video } from '../Video';
import { icons } from '../Icon';

type FileItem = {
  uid: UploadFile['uid'];
  url: string;
};

export type Props = {
  value: string;
  defaultValue?: string;
  extraParameters?: AnyObject;
  limit?: number;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  placeholder?: string;
  duration?: number;
  width?: number;
  height?: number;
  readOnly?: boolean;
  className?: string;
  onChange?: (fileList: FileItem[] | string) => void;
};

export const UploadVideo: React.FC<Props> = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  accept = '.mp4,.ogv,.webm,.m3u8,.mpd',
  limit = 1,
  maxSize = 1,
  multiple = false,
  width = 182,
  height = 102,
  duration = 60 * 60 * 60,
  readOnly,
  className,
}) => {
  const [state, setState] = useImmer({
    poster: '',
    source: '',
  });

  const { isLoading, runRequest } = useLoadingWrapper();

  const handleFirstFrameOfVideo = React.useCallback(
    (src) => {
      if (!src) {
        return Promise.reject();
      }

      return runRequest(() =>
        getFirstFrameOfVideo(src, { width, height })
          .then((poster) => {
            setState((draft) => {
              draft.poster = poster;
              draft.source = src;
            });
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log(e, 'getFirstFrameOfVideo error');
          }),
      );
    },
    [runRequest, width, height, setState],
  );

  const handleChange = React.useCallback(
    (src: any) => {
      handleFirstFrameOfVideo(src).catch(() => {});

      onChange?.(src);
    },
    [handleFirstFrameOfVideo, onChange],
  );

  const clearState = React.useCallback(() => {
    setState((draft) => {
      draft.poster = '';
      draft.source = '';
    });
  }, [setState]);

  const handleRemove = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      handleChange('');
      clearState();
    },
    [clearState, handleChange],
  );

  useEffect(() => {
    if (value && value !== state.source) {
      handleFirstFrameOfVideo(value).catch(() =>
        setState((draft) => {
          draft.source = value;
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useDebounceEffect(
    () => {
      if (defaultValue) {
        handleChange(defaultValue);
      }
    },
    [defaultValue],
    { wait: 300 },
  );

  const renderBody = () =>
    state.source ? (
      <>
        {!readOnly && (
          <Button
            shape="circle"
            icon={<icons.DeleteOutlined />}
            danger
            className={styles.videoClose}
            onClick={handleRemove}
          />
        )}
        <Video src={state.source} poster={state.poster} />
      </>
    ) : (
      !readOnly && (
        <UploadSection
          {...{
            accept,
            multiple,
            limit,
            maxSize,
            placeholder,
            rule: { duration },
            onChange: handleChange,
          }}
        />
      )
    );

  return (
    <div className={classNames(className, styles.videoWrapper)} style={{ width, height }}>
      {isLoading ? (
        <Spin
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
          }}
        />
      ) : (
        renderBody()
      )}
    </div>
  );
};
