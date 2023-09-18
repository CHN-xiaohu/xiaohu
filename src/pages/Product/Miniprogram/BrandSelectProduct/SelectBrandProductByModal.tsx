import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import { useState } from 'react';
import { Modal, message } from 'antd';

import { useDebounceFn } from 'ahooks';

import type { ProductColumns } from '../../Api';
import { getBrandProductNotSelf, getBrandProductSelf, copyProductToMiniProgram } from '../../Api';
import { showPriceOrBetween } from '../../Manager/Common';

type Props = {
  productState: number;
};

export function SelectBrandProduct({ productState }: Props) {
  const { actionsRef } = useGeneralTableActions<ProductColumns>();
  const [selectedKeys, setSelectKeys] = useState([] as any);
  const [isOpenAdd, setOpenAdd] = useState(false);

  const handleProducts = () => {
    if (selectedKeys.length < 1) return message.warning('请选择商品！');
    setOpenAdd(true);
  };

  const { run: requestBatchToBrandProduct } = useDebounceFn(
    async (resolve, reject) => {
      try {
        for (const id of selectedKeys) {
          // eslint-disable-next-line no-await-in-loop
          await copyProductToMiniProgram({ id });
        }

        actionsRef.current.reload();
        setOpenAdd(false);

        message.success('操作成功');

        resolve();
      } catch (error) {
        message.error(error?.message);
        reject();
      }
    },
    { wait: 116 },
  );

  const handleOnChange = (values: any) => {
    setSelectKeys(values);
  };

  const handleCopyProducts = () => {
    return new Promise(requestBatchToBrandProduct);
  };

  return (
    <>
      <Modal
        onCancel={() => setOpenAdd(false)}
        onOk={handleCopyProducts}
        visible={isOpenAdd}
        title="提示"
        width={320}
      >
        确定批量添加商品吗？
        <br />
        需前往小程序商品/未上架中，修改商品
        <br />
        价格后进行上架哦！
      </Modal>
      <GeneralTableLayout<ProductColumns>
        useTableOptions={{
          cacheKey: undefined,
        }}
        getActions={actionsRef}
        request={(params) =>
          productState === 1
            ? getBrandProductSelf({ ...params, page: params.size, size: undefined })
            : (getBrandProductNotSelf({ ...params, page: params.size, size: undefined }) as any)
        }
        searchProps={{
          minItem: 3,
          items: [
            {
              name: {
                title: '商品名称',
                type: 'string',
                'x-component-props': {
                  placeholder: '商品名称',
                },
              },
            },
          ],
        }}
        tableProps={{
          rowSelection: {
            onChange: handleOnChange,
          },
        }}
        defaultAddOperationButtonListProps={{
          text: '批量上架商品',
          onClick: () => handleProducts(),
          visible: productState === 2,
        }}
        columns={[
          {
            title: '首图',
            width: 72,
            dataIndex: 'image',
            image: true,
          },
          {
            title: '商品名称',
            dataIndex: 'name',
          },
          {
            title: '供货价',
            dataIndex: 'minSalePrice',
            render: (_, item: any) =>
              showPriceOrBetween(item.minPurchasePrice, item.maxPurchasePrice),
          },
        ]}
      />
    </>
  );
}
