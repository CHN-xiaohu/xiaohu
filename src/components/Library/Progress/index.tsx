/**
 * 随机生成进度条进度
 */

import { useState, useEffect } from 'react';

import * as React from 'react';
import { Progress } from 'antd';

import { useUnmount, useMount } from 'ahooks';

type Props = {
  isOk: boolean;
  initProgress?: number;
  style?: React.CSSProperties;
};

// 生成随机数
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

let isUnmount = false;
export const ProgressByRandom = ({ isOk = false, initProgress = 1, style }: Props) => {
  // 初始进度 1%
  const [progress, setProgress] = useState(initProgress);

  const onProgress = () => {
    if (isUnmount) {
      return;
    }

    // 生成本次随机时间
    const timeout = random(60, 300);

    setTimeout(() => {
      if (isUnmount) {
        return;
      }

      // 如果页面加载完毕，则直接进度到 100%
      if (isOk) {
        setProgress?.(100);
        return;
      }

      // 随机进度
      let percent = progress + random(5, 15);
      // 随机进度不能超过 99
      if (percent >= 100) {
        percent = 99;
      }

      // 设置当前次进度
      setProgress?.(percent);
    }, timeout);
  };

  useMount(() => {
    isUnmount = false;
  });

  useUnmount(() => {
    isUnmount = true;
  });

  useEffect(() => {
    if (!isOk) {
      onProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return <Progress percent={progress} size="small" status="active" style={style} />;
};
