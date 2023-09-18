// import { Swiper } from '@/components/Library/Swiper';
import { convertToChinese } from '@/utils';
import { useRequest } from 'ahooks';
import { Button, Checkbox, message, Spin } from 'antd';
import { useRef, useState } from 'react';

import { FormButtonGroup } from '@formily/antd';

import { useForceUpdate } from '@/foundations/hooks';

import styles from './index.less';

import { useCustomizeBackgroundImgForm } from './useCustomizeBackgroundImgForm';

import { getDistributorExtension, saveOrUpdateDistributorExtensionStyle } from '../../../api';

export const getPosterList = () => [
  {
    title: '',
    // 二维码高度
    qrCodeHeight: 140,
    // 二维码宽度
    qrCodeWidth: 140,
    // 背景图宽度
    backgroundImageWidth: 750,
    // 背景图高度
    backgroundImageHeight: 1334,
    // 二维码左边距
    qrCodeLeft: 520,
    // 二维码顶边距
    qrCodeTop: 1114,
    // 风格
    style: 1,
    // 如果设置了自定义背景图，那么这个字符就是预设的背景图 link src
    defaultBackgroundImg: '',
    backgroundImg: 'https://static.zazfix.com/web/images/2020-12-15/oEnDXT9vB9FyffHVruQr.png',
  },
];

export const PosterSetting = () => {
  const [state, setState] = useState([1]);

  // 减少渲染
  const posterListRef = useRef(
    getPosterList().map((item, index) => ({
      ...item,
      title: `风格${convertToChinese(index + 1)}`,
    })),
  );

  const forceUpdate = useForceUpdate();

  const { openForm, ModalFormElement } = useCustomizeBackgroundImgForm({
    onSuccess: (v) => {
      posterListRef.current[v.style - 1] = v;

      forceUpdate();

      return Promise.resolve();
    },
  });

  const { loading } = useRequest(getDistributorExtension, {
    formatResult: (res) => {
      const selectKeys = res.data.styleJson.map((item) => {
        const idx = item.style - 1;

        if (posterListRef.current[idx].backgroundImg !== item.backgroundImg) {
          posterListRef.current[idx].defaultBackgroundImg =
            posterListRef.current[idx].backgroundImg;
        }

        posterListRef.current[idx] = { ...posterListRef.current[idx], ...item };

        return Number(item.style);
      });

      if (selectKeys.length) {
        setState(selectKeys);
      }
    },
  });

  const { loading: uploadLoading, run } = useRequest(saveOrUpdateDistributorExtensionStyle, {
    manual: true,
    debounceInterval: 120,
  });

  const handleCheck = (type: boolean, style: number) => {
    if (type) {
      setState([...state, style]);
    } else {
      setState(state.filter((v) => v !== style));
    }
  };

  const handleDelete = (index: number) => {
    posterListRef.current[index].backgroundImg = posterListRef.current[index].defaultBackgroundImg;
    posterListRef.current[index].defaultBackgroundImg = '';

    forceUpdate();
  };

  const handleSubmit = () => {
    if (!state.length) {
      message.error('请至少选择一个风格');

      return;
    }

    run(state.map((idx) => posterListRef.current[idx - 1]));
  };

  return (
    <Spin spinning={loading || uploadLoading}>
      {ModalFormElement}

      <div className={styles.wrap}>
        <div style={{ padding: '0 24px' }}>
          {/* <Swiper {...{ slidesPerView: 'auto', hreshold: 50, touchAngle: 10, spaceBetween: 30 }}> */}
          {posterListRef.current.map((item, index) => {
            return (
              <div
                key={item.style}
                className={styles.itemWrap}
                style={{ width: item.backgroundImageWidth / 2.5 }}
              >
                <div className={styles.imgBox}>
                  <img src={item.backgroundImg} alt={item.title} />
                  <div className={styles.feat}>
                    {item.defaultBackgroundImg ? (
                      <span className={styles.delete} onClick={() => handleDelete(index)}>
                        删除自定义背景图
                      </span>
                    ) : null}
                    <span className={styles.set} onClick={() => openForm(item)}>
                      设置自定义背景图
                    </span>
                  </div>
                </div>

                <div className={styles.content}>
                  <Checkbox
                    checked={state.includes(item.style)}
                    onChange={(e) => {
                      e.stopPropagation();

                      handleCheck(e.target.checked, item.style);
                    }}
                  >
                    {item.title}
                  </Checkbox>
                </div>
              </div>
            );
          })}
          {/* </Swiper> */}
        </div>

        <FormButtonGroup sticky>
          <Button type="primary" onClick={handleSubmit}>
            保存设置
          </Button>
        </FormButtonGroup>
      </div>
    </Spin>
  );
};
