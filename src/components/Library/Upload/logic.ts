import { useCallback, useState } from 'react';

import { message } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import attrAccept from 'rc-upload/es/attr-accept';
import type { UploadFile, UploadProps } from 'antd/lib/upload/interface';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import update from 'immutability-helper';

import { isEqual } from 'lodash';

import { UploadStorage } from '@/services/Upload';

import { useDebounceWatch } from '@/foundations/hooks';

import { usePersistFn } from 'ahooks';

import {
  abort,
  isImage,
  isVideo,
  getVideoInfo,
  verifyImageWidthAndHeight,
  hasOwnProperty,
  isStr,
  generateImageObject,
} from './Util';

import { usePreviewPicture } from '../PreviewPicture';
import type { Props } from '.';

export type FileItem = {
  uid: UploadFile['uid'];
  url: string;
};

export const useLogic = ({
  value,
  defaultValue,
  onChange,
  onRemove,
  placeholder,
  picKey = 0,
  listType = 'picture-card' as UploadProps['listType'],
  // extraParameters, // 额外的上传参数
  // onUploadSuccessChange,
  accept = '.jpg,.png,.jpeg,.gif',
  limit = 1,
  maxSize = 3,
  multiple = false,
  showUploadList = true,
  rule = { maxImageWidth: 1920, maxImageHeight: 8000 },
  isAutoClearAfterSuccessfulUpload = false,
  children,
  readOnly,
  addonBefore,
  ...lastProps
}: Props) => {
  const [files, setFileList] = useState([] as FileItem[]);
  const { open: openPreviewPicture } = usePreviewPicture();

  const handleEmit = usePersistFn((fileList: any[]) => {
    if (onChange) {
      onChange(limit === 1 ? fileList[0]?.url : fileList);

      if (isAutoClearAfterSuccessfulUpload) {
        setFileList([]);
      }
    }
  });

  const handleControlled = usePersistFn(
    (controlledValue: Props['value'], isDefaultValue = false) => {
      if (controlledValue === null || isEqual(controlledValue, files)) {
        return;
      }

      const urlMaps = files.reduce((p, c) => ({ ...p, [c.url]: c }), {});

      // eslint-disable-next-line no-nested-ternary
      const realValue = Array.isArray(controlledValue)
        ? controlledValue.map((item) =>
            isStr(item)
              ? generateImageObject(item)
              : {
                  ...generateImageObject(item.url || '', (item as any).id || item.uid || undefined),
                  ...item,
                },
          )
        : isStr(controlledValue) && controlledValue
        ? [generateImageObject(controlledValue)]
        : [];

      const fileValues = realValue.map((item) =>
        Object.keys(urlMaps).includes(item.url) ? urlMaps[item.url] : item,
      );

      if (isEqual(fileValues, files)) {
        return;
      }

      setFileList(fileValues);

      if (isDefaultValue) {
        handleEmit(fileValues);
      }
    },
  );

  // 方便其他业务的使用，还是改用 value 受控吧
  useDebounceWatch(
    (oldValue) => {
      // 以 value 为准
      handleControlled(value || defaultValue, isEqual(oldValue?.[1], defaultValue));
    },
    [value, defaultValue],
    { immediate: true, isAreEqual: true },
  );

  const handleBeforeUpload = usePersistFn(async (file: File, fileList: File[]) => {
    try {
      if (fileList?.length + (files?.length || 0) > limit) {
        abort(`当前只能上传 ${limit} 个`);
      }

      if (!attrAccept(file, accept)) {
        abort(`当前只允许上传：${accept} 类型的格式`);
      }

      if (file.size / 1024 / 1024 > maxSize) {
        abort(`当前只允许上传不超过 ${maxSize}mb 的文件`);
      }

      if (
        rule !== false &&
        isImage(file.type) &&
        hasOwnProperty(rule, 'maxImageWidth') &&
        hasOwnProperty(rule, 'maxImageHeight')
      ) {
        const { maxImageWidth, maxImageHeight } = rule;
        const errorMessage = await verifyImageWidthAndHeight(
          file,
          maxImageWidth as number,
          maxImageHeight as number,
        );

        if (errorMessage) {
          abort(errorMessage);
        }
      }

      if (rule !== false && isVideo(file.type) && rule.duration) {
        const videoInfo = await getVideoInfo(file);
        if (videoInfo.duration > rule.duration) {
          abort(`当前只允许上传 ${rule.duration}秒以内的视频`);
        }
      }

      return await Promise.resolve();
    } catch (error) {
      message.error(error.message);

      return Promise.reject();
    }
  });

  // 上传文件状态回调
  const handleFileChange = usePersistFn(
    ({ file, fileList }: { file: UploadFile; fileList: UploadFile[] }) => {
      // 获取当前文件的上传状态
      const { status } = file;

      let newFileList = fileList;
      if (status === 'error') {
        // 过滤掉上传失败的文件
        newFileList = newFileList.filter((f) => f.status !== 'error');
      }

      if (status === 'done') {
        newFileList = newFileList.map((item) => item.response || item);
      }

      setFileList(newFileList as []);

      // 从上面的条件中分离，防止组件被卸载了，但是还在执行赋值
      if (status === 'done' && newFileList.every((item) => item.url)) {
        handleEmit(newFileList);
      }
    },
  );

  // https://ant-design.gitee.io/components/upload-cn/#components-upload-demo-transform-file
  // const transformFile = () => {
  //   //
  // }

  const handleRemove = (file: UploadFile) => {
    if (onRemove) {
      return onRemove(file);
    }

    handleEmit(files.filter((item) => item.uid !== file.uid));

    return true;
  };

  const customRequest = usePersistFn(
    async ({ file, onSuccess, onProgress, onError }: RcCustomRequestOptions) => {
      UploadStorage.uploadFile<string>(file as any, {
        onProgress: (percent: number) => (onProgress as any)?.({ percent }, file),
      })
        .then((url) => {
          const currentFile = generateImageObject(url, file.uid);

          onSuccess?.(currentFile, file as any);
        })
        .catch(onError);
    },
  );

  const handlePreview = useCallback(
    (file: UploadFile) => {
      openPreviewPicture({
        src: file.url as string,
        title: file.url,
        subtitle: '',
      });
    },
    [openPreviewPicture],
  );

  const handleSort = usePersistFn((oldIndex: number, newIndex: number) => {
    const rowData = files[oldIndex];
    if (!rowData) {
      return;
    }

    const newFiles = update(files, {
      $splice: [
        [oldIndex, 1],
        [newIndex, 0, rowData],
      ],
    });

    setFileList(newFiles);
    handleEmit(newFiles);
  });

  return {
    files,
    limit,
    handleSort,
    uploadProps: {
      key: picKey,
      accept,
      multiple,
      listType,
      fileList: files as any[],
      customRequest,
      onRemove: handleRemove,
      onPreview: handlePreview,
      onChange: handleFileChange,
      beforeUpload: handleBeforeUpload,
      showUploadList,
      ...lastProps,
    },
  };
};
