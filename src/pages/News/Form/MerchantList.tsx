import { Modal, Button } from 'antd';
import { GeneralTableLayout } from '@/components/Business/Table/Layout/GeneralTableLayout';
import { useZWXExclusiveTable } from '@/foundations/hooks/Antd/useZWXExclusiveTable';
import type { SearchFromProps } from '@/components/Business/Form/SearchForm';

import { getMerchantList } from '../Api';

const MerchantList = ({
  onCancel,
  onOk,
  selectedProductRowKeys,
  handleSelectChange,
  ...manualOpt
}: any) => {
  const request = (params: any) => {
    const query = {
      size: params.pageSize,
      current: params.current,
      ...params,
    };
    return getMerchantList({ ...query });
  };

  const { tableProps, searchSubmit, searchRefresh } = useZWXExclusiveTable(request, {
    defaultPageSize: 20,
  });

  const searchProps: SearchFromProps<any>['items'] = [
    {
      content: {
        type: 'string',
        title: '模糊搜索',
        placeholder: '商家名称/手机号',
      },
      hasVip: {
        title: '会员等级',
        type: 'checkableTags',
        default: 3,
        props: {
          options: [
            {
              label: '全部',
              value: 3,
            },
            {
              label: '普通商家',
              value: 1,
            },
            {
              label: '金牌商家',
              value: 0,
            },
          ],
        },
      },
    },
  ];

  const columns = [
    {
      title: '商家名称',
      dataIndex: 'storeName',
    },
    {
      title: '商家手机',
      dataIndex: 'linkPhone',
    },
    {
      title: '会员身份',
      dataIndex: 'hasVip',
      render: (data: any) => <span>{!Number(data) ? '金牌商家' : '普通商家'}</span>,
    },
  ];

  return (
    <Modal
      footer={
        <div>
          最多可选商家200个，已选：商家（
          <span style={{ color: 'red' }}>{selectedProductRowKeys.length}</span>）个
          <Button onClick={onOk} style={{ marginLeft: '10px' }} type="primary">
            确定
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </div>
      }
      onCancel={onCancel}
      {...manualOpt}
    >
      <GeneralTableLayout
        searchProps={{
          onSearch: searchSubmit,
          items: searchProps,
          onReset: () => searchRefresh(),
        }}
        isOperationButton={false}
        tableProps={{
          rowSelection: {
            selectedRowKeys: selectedProductRowKeys,
            onChange: handleSelectChange,
          },
          rowKey: 'id',
          columns,
          ...tableProps,
        }}
      />
    </Modal>
  );
};

export default MerchantList;
