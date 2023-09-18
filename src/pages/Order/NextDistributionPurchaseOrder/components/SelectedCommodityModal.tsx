import { useState } from 'react';
import { ButtonList } from '@/components/Library/ButtonList';
import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

import { SelectedCommodity } from './SelectedCommodity';

type Props = {
  setVisible: any;
  onProductChange: ({ data }: { data: any[] }) => void;
  dataSource: any[];
};

export const SelectedCommodityModal = ({
  setVisible,
  dataSource,
  onProductChange,
}: React.PropsWithChildren<Props>) => {
  const [selectedVisible, setSelectedVisible] = useState(false);

  const handleCancel = () => {
    setSelectedVisible(false);
  };

  const Child = () => {
    return (
      <SelectedCommodity
        showAddButton={false}
        dataSource={dataSource}
        onProductChange={onProductChange}
      />
    );
  };

  return (
    <>
      <span
        onClick={() => {
          setVisible(false);
          setSelectedVisible(true);
        }}
        style={{ marginRight: 24 }}
      >
        已选商品 (<strong style={{ color: 'red', margin: '0 2px' }}>{dataSource?.length}</strong>
        件)
      </span>

      <ModalWrapper
        {...{
          title: <strong style={{ marginRight: 24 }}>查看已选商品</strong>,
          visible: selectedVisible,
          bodyStyle: {
            backgroundColor: '#f0f2f5',
          },
          onCancel: handleCancel,
          onOk: handleCancel,
          footer: ({ onOk }) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <ButtonList
                list={[
                  {
                    text: '返回选择商品',
                    type: 'default',
                    onClick: () => {
                      setVisible(true);
                      setSelectedVisible(false);
                    },
                  },
                  {
                    text: '确定',
                    type: 'primary',
                    onClick: onOk,
                  },
                ]}
              />
            </div>
          ),
          children: <Child />,
        }}
      />
    </>
  );
};
