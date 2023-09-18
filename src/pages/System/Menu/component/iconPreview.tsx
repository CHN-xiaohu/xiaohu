import { Icons } from '@/components/Library/Icon';

import { useState } from 'react';
import { Modal, Input, Radio } from 'antd';

// eslint-disable-next-line import/no-extraneous-dependencies
import type { RadioButtonProps } from 'antd/lib/radio/radioButton';

const { Search } = Input;

export type FieldNamesType = {
  value?: string;
  label?: string;
};

type IRadioGroupProps = {
  value?: string | number;
  dataSource: (FieldNamesType & { value: any })[];
  onChange?: (value: any) => void;
} & RadioButtonProps;

const IconPreview = (props: IRadioGroupProps) => {
  const [openModal, setOpenModal] = useState(false);
  const { value, dataSource = [], ...lastProps } = props;

  console.log('ppp', props);

  const handleOnFocus = () => {
    setOpenModal(true);
  };

  const iconOpt = {
    visible: openModal,
    width: 800,
    title: '图标选择',
    onCancel() {
      setOpenModal(false);
    },
    onOk() {
      setOpenModal(false);
    },
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  console.log('lastProps', lastProps);

  return (
    <>
      <Modal {...iconOpt}>
        <Radio.Group {...lastProps}>
          {dataSource.map((item) => (
            <Radio.Button style={{ margin: '10px' }} key={item.label} value={item.label}>
              <Icons
                keys={item.value}
                type={`anticon-${item.label}`}
                style={{ fontSize: '30px' }}
                onClick={handleClose}
              />
            </Radio.Button>
          ))}
        </Radio.Group>
      </Modal>
      <Search
        placeholder="请选择菜单图标"
        onSearch={handleOnFocus}
        prefix={<Icons type={value ? `anticon-${value}` : 'anticon-setting'} />}
        value={value}
        enterButton
      />
    </>
  );
};

export default IconPreview;
