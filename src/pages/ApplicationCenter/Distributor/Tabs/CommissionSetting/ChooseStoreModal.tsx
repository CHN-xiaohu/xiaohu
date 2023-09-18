import { useState } from 'react';
import { Button } from 'antd';
import {
  useGeneralTableActions,
  GeneralTableLayout,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useWatch } from '@/foundations/hooks';

import { ButtonList } from '@/components/Library/ButtonList';

import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

import { useSetCommissionForm } from './useSetCommissionForm';

import type { UnsetCommissionStoresColumns } from '../../api';
import { saveBatchStoreCommission, getUnsetCommissionStores } from '../../api';

type Props = {
  onSuccess: () => void;
};

export const ChooseStore = ({ children, onSuccess }: React.PropsWithChildren<Props>) => {
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const { actionsRef } = useGeneralTableActions<UnsetCommissionStoresColumns>();

  const handleCancel = () => {
    setVisible(false);
  };

  useWatch(() => {
    if (visible) {
      setSelectedRowKeys([]);
      actionsRef.current.reload?.();
    }
  }, [visible]);

  const { openSetCommissionForm, ModalFormElement } = useSetCommissionForm(() => {
    handleCancel();
    onSuccess();
  }, saveBatchStoreCommission);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        {children}
      </Button>

      {ModalFormElement}

      <ModalWrapper
        {...{
          title: '选择商家',
          visible,
          bodyStyle: {
            backgroundColor: '#f0f2f5',
          },
          onCancel: handleCancel,
          onOk: () => openSetCommissionForm({ ids: selectedRowKeys }),
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
              request={getUnsetCommissionStores}
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
                        placeholder: '商家名称/手机号',
                      },
                    },
                    hasVip: {
                      title: '会员等级',
                      type: 'checkableTags',
                      'x-component-props': {
                        options: generateDefaultSelectOptions([
                          { label: '普通商家', value: 1 },
                          { label: '金牌商家', value: 0 },
                        ]),
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
                  title: '商家名称',
                  dataIndex: 'storeName',
                },
                {
                  title: '手机号',
                  dataIndex: 'linkPhone',
                  placeholder: true,
                },
                {
                  title: '会员身份',
                  dataIndex: 'hasVip',
                  render: (data) => <span>{Number(data) ? '普通商家' : '金牌商家'}</span>,
                },
              ]}
            />
          ),
        }}
      />
    </>
  );
};
