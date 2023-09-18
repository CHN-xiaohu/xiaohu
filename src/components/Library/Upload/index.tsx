/* eslint-disable no-confusing-arrow */
/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 上传管理
|
*/

import * as React from 'react';
import { Upload } from 'antd';
import type { UploadFile, UploadListProps, UploadProps } from 'antd/lib/upload/interface';

import styles from './index.less';

import { useLogic } from './logic';

import { DraggableContainer, DraggableUploadListItem } from './Draggable';

import { icons } from '../Icon';

export type FileItem = {
  uid: UploadFile['uid'];
  url: string;
};

export type Props = React.PropsWithChildren<
  {
    value?: string | (string | FileItem)[];
    defaultValue?: string | (string | FileItem)[];
    extraParameters?: AnyObject;
    addonBefore?: React.ReactNode;
    limit?: number;
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    placeholder?: string;
    picKey?: number;
    isAutoClearAfterSuccessfulUpload?: boolean;
    rule?: { duration?: number; maxImageWidth?: number; maxImageHeight?: number } | false;
    readOnly?: boolean;
    isDraggableSort?: boolean;
    onRemove?: (file: UploadFile) => Promise<boolean> | boolean;
    onChange?: (fileList: string | (string | FileItem)[]) => void;
    onRealChange?: (fileList: File[] | File) => void;
    onUploadSuccessChange?: (data: any) => void;
  } & Omit<UploadProps, 'value' | 'onChange'>
>;

export const UploadSection: React.FC<Props> = React.memo((props: Props) => {
  const { uploadProps, files, limit, handleSort } = useLogic(props);

  const UploadAreaEl = (
    <>
      <icons.PlusOutlined />
      <div
        className="ant-upload-text"
        style={{
          fontWeight: 500,
          position: 'relative',
          top: '2px',
        }}
      >
        {props.placeholder || '上传图片'}
      </div>
    </>
  );

  const renderUpload = ({ itemRender }: { itemRender?: UploadListProps['itemRender'] }) => (
    <div className={`clearfix ${styles.uploadWrapper}`} style={{ lineHeight: 1 }}>
      {props.addonBefore && <div className="upload-file--addon-before">{props.addonBefore}</div>}

      <Upload
        {...{
          ...uploadProps,
          itemRender,
        }}
      >
        {(files.length >= limit && uploadProps.showUploadList) || props.readOnly
          ? null
          : props.children || UploadAreaEl}
      </Upload>
    </div>
  );

  return !props.isDraggableSort ? (
    renderUpload({})
  ) : (
    <DraggableContainer>
      {renderUpload({
        itemRender: (originNode, file, currFileList) => {
          const index = currFileList!.findIndex((item) => item.uid === file.uid);

          return (
            <DraggableUploadListItem originNode={originNode} index={index} moveRow={handleSort} />
          );
        },
      })}
    </DraggableContainer>
  );
});
