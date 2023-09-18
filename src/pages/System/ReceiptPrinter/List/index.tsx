import { useCallback } from 'react';
import { Spin, Card, Alert, message } from 'antd';
import { useGeneralTableActions, GeneralTableLayout } from '@/components/Business/Table';

import { usePrinterForm } from './Form';

import type { IPrinterColumns } from '../Api';
import { getPrinterList, deletePrinter } from '../Api';

import './index.less';

export default function SystemReceiptPrinterList() {
  const { actionsRef } = useGeneralTableActions<IPrinterColumns>();

  // 创建成功
  const handleCreatePrinterSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = usePrinterForm({
    onAddSuccess: handleCreatePrinterSuccess,
  });

  // 删除打印机
  const handleDelete = (values: any) => {
    const { id, brand, machineCode, privateKey } = values;
    deletePrinter({ id, brand, machineCode, privateKey }).then(() => {
      message.success('删除成功');
      handleCreatePrinterSuccess();
    });
  };

  return (
    <>
      {ModalFormElement}
      <Card className="tip">
        <Alert message="小票打印机：网页版仅支持连接WIFI打印机，请确保打印机已连接网络" />
      </Card>
      <Spin spinning={false}>
        <GeneralTableLayout
          {...{
            request: (params) => {
              delete params?.current;
              delete params?.pageSize;
              return getPrinterList(params);
            },
            getActions: actionsRef,
            useTableOptions: {
              formatResult: ({ data }) => ({ data, total: 0 }),
            },
            defaultAddOperationButtonListProps: {
              text: '新增打印机',
              onClick: () => openForm(),
            },
            columns: [
              {
                title: '设备名称',
                dataIndex: 'name',
              },
              {
                title: '设备品牌',
                dataIndex: 'brandName',
              },
              {
                title: '设备号码',
                dataIndex: 'machineCode',
              },
              {
                title: '设备密钥',
                dataIndex: 'privateKey',
              },
              {
                title: '添加时间',
                dataIndex: 'createTime',
              },
              {
                title: '操作',
                dataIndex: 'id',
                width: 110,
                buttonListProps: {
                  list: ({ row }) => [
                    {
                      text: '编辑',
                      onClick: () => openForm(row),
                    },
                    {
                      text: '删除',
                      modalProps: {
                        content: (
                          <>
                            <p>确定删除该打印机吗？</p>
                          </>
                        ),
                        onOk: () => handleDelete(row),
                      },
                    },
                  ],
                },
              },
            ],
            tableProps: {
              pagination: false,
            },
          }}
        />
      </Spin>
    </>
  );
}
