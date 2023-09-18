import { GeneralTableLayout, generateDefaultSelectOptions } from '@/components/Business/Table';

import { Modal, Button } from 'antd';
import { useState } from 'react';

import type { DesignerColumns } from '../Api';
import { getUnRegisterDesigner } from '../Api';

type Props = {
  onOk: (e: any) => void;
  onCancel: () => void;
};

const ChooseMerchant = ({ onOk, onCancel, ...unRegisterDesignerObt }: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any);

  const handleSelectChange = (_: any, selectedRows: any) => {
    setSelectedRowKeys(selectedRows);
  };

  const handleOk = () => {
    onOk(selectedRowKeys);
  };

  const columns = [
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      width: '50%',
    },
    {
      title: '注册手机',
      dataIndex: 'registerPhone',
      width: '25%',
    },
    {
      title: '商家类型',
      dataIndex: 'hasVip',
      width: '25%',
      render: (data: any) => <span>{Number(data) === 1 ? '普通商家' : '金牌商家'}</span>,
    },
  ];

  return (
    <Modal
      footer={
        <div>
          最多可选商家20个，已选：商家（
          <span style={{ color: 'red' }}>{selectedRowKeys.length}</span>）个
          <Button onClick={() => handleOk()} style={{ marginLeft: '10px' }} type="primary">
            确定
          </Button>
        </div>
      }
      onCancel={onCancel}
      {...unRegisterDesignerObt}
    >
      <GeneralTableLayout<DesignerColumns, any>
        request={(params = {} as any) =>
          getUnRegisterDesigner({
            pageSize: params.size,
            pageNo: params.current,
            ...params,
            size: undefined,
            current: undefined,
          }) as any
        }
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              selectField: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '店铺名称、注册手机、联系手机',
                },
              },
              hasVip: {
                title: '会员身份',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '普通商家', value: 1 },
                      { label: '金牌商家', value: 0 },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        columns={columns}
        tableProps={{
          rowKey: 'storeId',
          rowSelection: {
            onChange: handleSelectChange,
          },
        }}
      />
    </Modal>
  );
};

export default ChooseMerchant;
