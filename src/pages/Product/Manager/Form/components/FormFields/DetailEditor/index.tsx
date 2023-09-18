import { useRef, memo, useCallback } from 'react';

import { Input, Empty, Card, Button, Alert } from 'antd';
import classNames from 'classnames';

import { useImmer } from 'use-immer';

import type { FileItem } from '@/components/Library/Upload';
import { UploadSection } from '@/components/Library/Upload';
import { strRandom } from '@/utils';
import type { ProductColumns } from '@/pages/Product/Api';
import { useDebounceWatch, useWatch } from '@/foundations/hooks';
import { getImageWidthAndHeightBySrc } from '@/components/Library/Upload/Util';
import { icons } from '@/components/Library/Icon';

import styles from './index.less';

type Props = {
  value?: ProductColumns['introductions'];
  readOnly?: boolean;
  onChange?: (value: ProductColumns['introductions']) => void;
  style?: React.CSSProperties;
};

export const generateDetailEditorItemId = () => `internal_${strRandom(10)}`;

const getContentByType = (
  type: 'text' | 'image',
  content: string = '',
  contentAttribute: string = '',
) => ({
  id: generateDetailEditorItemId(),
  content,
  contentAttribute,
  contentType: {
    text: 1,
    image: 2,
  }[type],
});

const Main: React.FC<Props> = ({ value, readOnly, onChange, style }) => {
  const [state, setState] = useImmer({
    values: [] as ProductColumns['introductions'],
    defaultFileValue: '',
  });
  const isDefaultChangeRef = useRef(false);

  useDebounceWatch(
    () => {
      if (value?.length) {
        setState((draft) => {
          isDefaultChangeRef.current = true;

          // 兼容某些后端接口没有返回对应 id 的情况
          draft.values = value.map((item) => {
            if (!item.id) {
              item.id = generateDetailEditorItemId();
            }

            return item;
          });
        });
      }
    },
    [value],
    { isAreEqual: true, immediate: true },
  );

  useWatch(() => {
    if (isDefaultChangeRef.current) {
      isDefaultChangeRef.current = false;

      return;
    }

    onChange?.(state.values);
  }, [state.values]);

  const addText = useCallback(() => {
    setState((draft) => {
      draft.values = [...draft.values, getContentByType('text')];
    });
  }, [setState]);

  const addImage = useCallback(
    (files: FileItem[]) => {
      if (!files?.length) {
        return;
      }

      Promise.all(files.map((file) => getImageWidthAndHeightBySrc(file.url))).then((attributes) => {
        setState((draft) => {
          draft.values = [
            ...draft.values,
            ...attributes.map((attribute) => {
              const { src, ...last } = attribute;
              return getContentByType('image', src, JSON.stringify(last));
            }),
          ];
          draft.defaultFileValue = '';
        });
      });
    },
    [setState],
  );

  const updateValue = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();

      setState((draft) => {
        draft.values[index].content = e.target.value;
      });
    },
    [setState],
  );

  const upOrDown = useCallback(
    (type: 'up' | 'down', index: number) => {
      const newIndex = {
        up: -1,
        down: 1,
      }[type];

      setState((draft) => {
        const old = draft.values[index];

        draft.values.splice(index, 1);
        draft.values.splice(index + newIndex, 0, old);
      });
    },
    [setState],
  );

  const del = useCallback(
    (index: number) => {
      setState((draft) => {
        draft.values.splice(index, 1);
      });
    },
    [setState],
  );

  // eslint-disable-next-line no-confusing-arrow
  const renderInput = (index: number, data: string) =>
    readOnly ? <p>{data}</p> : <Input defaultValue={data} onChange={updateValue(index)} />;

  const renderImage = (_: number, src: string) => <img className={styles.image} src={src} alt="" />;

  const renderBody = () => {
    const components = {
      1: renderInput,
      2: renderImage,
    };

    return state.values.map((item, index) => (
      <div key={item.id} className={styles.item}>
        {components[item.contentType](index, item.content)}

        {!readOnly && (
          <div className={styles.features}>
            {index > 0 && <span onClick={() => upOrDown('up', index)}>上移</span>}
            {state.values.length > 1 && index !== state.values.length - 1 && (
              <span onClick={() => upOrDown('down', index)}>下移</span>
            )}
            <span onClick={() => del(index)}>删除</span>
          </div>
        )}
      </div>
    ));
  };

  const renderHeader = (
    <>
      <Button type="primary" onClick={addText}>
        <icons.EditOutlined /> 添加文本
      </Button>
      <UploadSection
        listType="text"
        isAutoClearAfterSuccessfulUpload
        showUploadList={false}
        rule={false}
        multiple
        limit={10}
        onChange={addImage as any}
      >
        <Button>
          <icons.UploadOutlined /> 上传图片
        </Button>
      </UploadSection>
    </>
  );

  return (
    <div className={styles.wrapper}>
      {!readOnly && (
        <Alert
          message="建议图片尺寸"
          description="宽度 750 像素，高度 1500 像素以内，单张图片大小 1M 以内"
          banner
        />
      )}

      <Card
        title={!readOnly && renderHeader}
        type="inner"
        style={style}
        className={classNames(styles.wrapper, { [styles.viewWrapper]: readOnly })}
      >
        {!state.values.length ? <Empty style={{ marginTop: '35%' }} /> : renderBody()}
      </Card>
    </div>
  );
};

export const DetailEditor = memo(Main);
