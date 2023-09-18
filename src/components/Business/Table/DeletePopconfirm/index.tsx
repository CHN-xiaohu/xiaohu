import * as React from 'react';
import { Popconfirm } from 'antd';

type Props = {
  title?: string;
  onOk?: () => void;
};

export const DeletePopconfirm: React.FC<Props> = ({ title, onOk }) => (
  <Popconfirm title="您确定要删除该项嘛?" onConfirm={onOk} okText="确定" cancelText="取消">
    <a>{title || '删除'}</a>
  </Popconfirm>
);
