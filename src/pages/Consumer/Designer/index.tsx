import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useCallback, useState } from 'react';

import { message } from 'antd';

import { useUpdateEquities } from './Form/useUpdateEquities';
import ChooseMerchant from './Form/useChooseMerchant';

import type { DesignerColumns } from './Api';
import { getDesignerList, registerDesigner } from './Api';

export default function Designer() {
  const { actionsRef } = useGeneralTableActions<DesignerColumns>();
  const [isUnRegisterDesigner, setUnRegisterDesigner] = useState(false);

  const handleCreateEquitiesSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm: openAddEquities, ModalFormElement } = useUpdateEquities({
    onAddSuccess: handleCreateEquitiesSuccess,
  });

  const columns = [
    {
      title: '店铺名称',
      dataIndex: 'storeName',
    },
    {
      title: '注册手机',
      dataIndex: 'registerPhone',
    },
    {
      title: '账号权益',
      dataIndex: 'equities',
      render: (data: any) => <span>{data === 'TOURIST' ? '游客' : '设计师'}</span>,
    },
    {
      title: '开通时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'id',
      buttonListProps: {
        list: ({ row }: any) => [
          {
            text: '编辑权益',
            onClick: () => openAddEquities({ ...row }),
          },
        ],
      },
    },
  ];

  const handleOpenUnRegisterDesigner = () => {
    setUnRegisterDesigner(true);
  };

  const unRegisterDesignerObt = {
    title: '选择商家',
    width: 900,
    visible: isUnRegisterDesigner,
    onCancel() {
      setUnRegisterDesigner(false);
    },
    onOk(values: any) {
      if (values.length < 1) {
        message.warning('请选择需要开通的商家信息！');
      } else {
        const params = values.map((items: any) => ({
          storeName: items.storeName,
          storeId: items.storeId,
          storeImgs: items.storeImgs,
        }));
        registerDesigner(params).then(() => {
          message.success('操作成功！');
          handleCreateEquitiesSuccess();
        });
        setUnRegisterDesigner(false);
      }
    },
  };

  return (
    <>
      <ChooseMerchant {...unRegisterDesignerObt} />
      {ModalFormElement}
      <GeneralTableLayout<DesignerColumns, any>
        request={(params = {} as any) =>
          getDesignerList({
            pageSize: params.size,
            pageNo: params.current,
            ...params,
            size: undefined,
            current: undefined,
          }) as any
        }
        columns={columns}
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          items: [
            {
              selectField: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '店铺名称、注册手机、联系手机',
                },
              },
              equities: {
                title: '账号权益',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '游客', value: 'TOURIST' },
                      { label: '设计师', value: 'STORE' },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        operationButtonListProps={{
          list: [
            {
              text: '开通商家账号权益',
              type: 'primary',
              onClick: () => {
                handleOpenUnRegisterDesigner();
              },
            },
            {
              text: '商家设置设计师权益属于增值服务项，费用100元/个/年，请谨慎设置',
              danger: true,
              type: 'link',
              icon: 'InfoCircleOutlined',
              style: {
                cursor: 'default',
              },
            },
          ],
        }}
      />
    </>
  );
}
