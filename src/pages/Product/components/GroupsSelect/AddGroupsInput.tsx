import { useState } from 'react';
import { Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

type GroupColumns = {
  loading: boolean;
  handleAddGroup: (e: string) => void;
};

export function AddGroupsInput({ loading, handleAddGroup }: GroupColumns) {
  const [name, setName] = useState('');

  const handleName = () => {
    if (!name) {
      message.warning('请输入名称！');
      return;
    }

    handleAddGroup(name);
    setName('');
  };

  return (
    <div style={{ display: 'flex', marginTop: '10px' }}>
      <Input
        placeholder="请输入名称"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        style={{ width: '70%' }}
      />
      <Button
        onClick={() => handleName()}
        loading={loading}
        icon={<PlusOutlined />}
        style={{ marginLeft: '20px' }}
      >
        添加分组
      </Button>
    </div>
  );
}
