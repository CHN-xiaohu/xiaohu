import { useState } from 'react';
import { Button, Modal } from 'antd';
import { useGeneralTableActions, GeneralTableLayout } from '@/components/Business/Table';

import { useWatch } from '@/foundations/hooks';

import { ButtonList } from '@/components/Library/ButtonList';

import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

import type { NotRegisteredDistributorColumns } from '../../api';
import { applyDistributor, getNotRegisteredDistributor } from '../../api';

type Props = {
  onSuccess: () => void;
};

export const ChooseConsumer = ({ children, onSuccess }: React.PropsWithChildren<Props>) => {
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { actionsRef } = useGeneralTableActions<NotRegisteredDistributorColumns>();
  const [modal, ModalContextHolder] = Modal.useModal();

  const handleCancel = () => {
    setVisible(false);
  };

  useWatch(() => {
    if (visible) {
      actionsRef.current.reload?.();
      setSelectedRowKeys([]);
    }
  }, [visible]);

  const handleOk = () => {
    return modal.confirm({
      title: '提示',
      content: '确定开通所选用户的分销员身份吗？',
      onOk: () =>
        applyDistributor(selectedRowKeys).then(() => {
          handleCancel();

          onSuccess();
        }),
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        {children}
      </Button>

      {ModalContextHolder}
      <ModalWrapper
        {...{
          title: '选择消费者用户',
          visible,
          bodyStyle: {
            backgroundColor: '#f0f2f5',
          },
          onCancel: handleCancel,
          onOk: handleOk,
          footer: ({ onCancel, onOk }) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ marginRight: 24 }}>
                最多可选用户 50 个，已选用户
                <strong style={{ color: 'red', margin: '0 2px' }}>{selectedRowKeys.length}</strong>
                个
              </span>

              <ButtonList
                list={[
                  {
                    text: '取消',
                    onClick: onCancel,
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
          children: (
            <GeneralTableLayout
              request={getNotRegisteredDistributor}
              useTableOptions={{
                manual: true,
              }}
              getActions={actionsRef}
              placeholder="--"
              searchProps={{
                minItem: 3,
                items: [
                  {
                    content: {
                      title: '模糊查询',
                      type: 'string',
                      'x-component-props': {
                        placeholder: '用户昵称/手机号',
                      },
                    },
                  },
                ],
              }}
              operationButtonListProps={false}
              tableProps={{
                rowSelection: {
                  selectedRowKeys,
                  onChange: (keys) => setSelectedRowKeys(keys as string[]),
                },
              }}
              columns={[
                {
                  title: '用户名称',
                  dataIndex: 'name',
                },
                {
                  title: '手机号',
                  dataIndex: 'registerPhone',
                  placeholder: true,
                },
              ]}
            />
          ),
        }}
      />
    </>
  );
};
