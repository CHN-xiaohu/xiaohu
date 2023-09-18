import { useState } from 'react';

import { Modal, Button } from 'antd';
import { useRequest } from 'ahooks';

import { AppConfig } from '@/config';

import './index.less';

import { Device } from '../Device';

import { getTemplateDesign } from '../../Api';
import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

type Props = {
  onOk: (e: any) => void;
};

const openPreview = (pageId: string) => {
  const content = <Device url={`${AppConfig.designPreviewUrl}/${pageId}`} />;

  Modal.info({
    className: 'preview-page-modal',
    content,
    width: 424,
    maskClosable: true,
    icon: null,
    okButtonProps: {
      style: {
        display: 'none',
      },
    },
  });
};

const Item = ({
  id,
  image,
  name,
  selectedKey,
  onSelected,
}: {
  id: string;
  selectedKey?: string;
  image?: string;
  name: string;
  onSelected?: () => void;
}) => {
  const currentIsSelected = selectedKey === id;

  const UseButton = (
    <Button
      type={currentIsSelected ? 'primary' : undefined}
      onClick={onSelected}
      className="buttonWidth"
    >
      {currentIsSelected ? '已选中' : '使用'}
    </Button>
  );

  return (
    <div className={`${image ? 'item' : 'emptyItem'}${currentIsSelected ? ' active' : ''}`}>
      {image && <img src={image} />}
      <div>{name}</div>

      {UseButton}

      {image && (
        <div className="mask">
          <div className="buttons">
            {UseButton}

            <Button
              onClick={() => {
                openPreview(id);
              }}
              className="buttonWidth"
            >
              预览
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const ChooseActivityForm = ({ onOk, ...chooseActivityObj }: Props) => {
  const [selectedKey, setSelectedKey] = useState('');

  const { data } = useRequest(() => getTemplateDesign({ current: 1, page: 100 }), {
    formatResult: (res) => {
      return [
        {
          businessCode: '',
          createDept: '',
          createTime: '',
          createUser: '',
          designType: 1,
          id: '',
          image: '',
          isDeleted: 0,
          name: '创建空白页',
          status: 1,
          updateTime: '',
          updateUser: '',
        },
        ...res.data?.records,
      ];
    },
  });

  return (
    <>
      <ModalWrapper {...{ ...chooseActivityObj, onOk: () => onOk?.(selectedKey) }}>
        <div className="chooseActivityStyle">
          {data?.slice(0, 4)?.map((v, index: number) => {
            // eslint-disable-next-line react/no-array-index-key
            return (
              <Item
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                id={v.id}
                image={v.image}
                name={v.name}
                selectedKey={selectedKey}
                onSelected={() => setSelectedKey(v.id)}
              />
            );
          })}
        </div>
      </ModalWrapper>
    </>
  );
};

export default ChooseActivityForm;
