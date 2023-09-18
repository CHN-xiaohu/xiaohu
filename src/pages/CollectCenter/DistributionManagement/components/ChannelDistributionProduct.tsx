import { GeneralTableLayout } from '@/components/Business/Table';

import { getMyApplicationRecordListEx } from '../../Api';

import { useDistributionProductModal } from '../../DistributionApplication/components/DistributionProductModal';

export default function DistributionGoods() {
  const {
    openDistributionProduct,
    ModalDistributionProductElement,
  } = useDistributionProductModal();

  return (
    <>
      {ModalDistributionProductElement}
      <GeneralTableLayout
        request={(params) => getMyApplicationRecordListEx({ ...params, auditStatus: 1 })}
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              tenantName: {
                title: '模糊查询',
                type: 'string',
                col: 8,
                'x-component-props': {
                  placeholder: '供货商名称',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '供货商名称',
            dataIndex: 'tenantName',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }: any) => [
                {
                  text: '查看商品',
                  onClick: () =>
                    openDistributionProduct({ title: row.tenantName, supplyId: row.supplyId }),
                },
              ],
            },
          },
        ]}
      />
    </>
  );
}
