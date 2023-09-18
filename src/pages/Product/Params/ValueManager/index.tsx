import { useCallback } from 'react';

import type { SwitchOnChangeParams } from '@/components/Business/Table';
import {
  generateDefaultSelectOptions,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import { useModal } from '@/foundations/hooks';

import { Modal } from 'antd';

import { usePropertyValueForm } from './Form';

import type { PropertyValueColumns } from '../../Api';
import { updatePropertyValueStatus, getPropertyValueList, deleteParamsValue } from '../../Api';

export const useValueManager = () => {
  const { actionsRef } = useGeneralTableActions<PropertyValueColumns>();
  const [modal, ModalContextHolder] = Modal.useModal();

  let productPropertyId = '';

  const { openPropertyValueForm, PropertyValueFormElement } = usePropertyValueForm({
    onSubmitSuccess: () => actionsRef.current.refresh(),
  });

  const handleChangeStatus = ({
    dataSource: { row, index },
    value,
  }: SwitchOnChangeParams<PropertyValueColumns, { status: number }>) => {
    return updatePropertyValueStatus({
      id: row.id,
      ...value,
    }).then(() =>
      actionsRef.current.setDataSource((source) => {
        source[index] = {
          ...source[index],
          ...value,
        };
      }),
    );
  };

  const handleDelete = (row: PropertyValueColumns) => {
    modal.confirm({
      title: '确定删除该参数值？',
      content: '若删除该参数值，品牌商下的参数设置也将被删除',
      onOk: () => deleteParamsValue(row.id).then(() => actionsRef.current.refresh()),
    });
  };

  const { openModal, modalElement: ValueManagerElement } = useModal({
    title: '参数值列表',
    style: {
      top: '6vh',
      minWidth: '80vw',
    },
    bodyStyle: {
      height: '75vh',
      overflow: 'auto',
      backgroundColor: '#f0f2f5',
    },
    children: (
      <GeneralTableLayout<PropertyValueColumns>
        request={(params) =>
          getPropertyValueList({ ...params, productPropKeyTemplateId: productPropertyId })
        }
        useTableOptions={{
          cacheKey: 'PropertyValueManager',
        }}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              name: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '参数值名称',
                },
              },
              status: {
                title: '参数值状态',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions([
                    { label: '启用', value: 1 },
                    { label: '禁用', value: 0 },
                  ]),
                },
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          text: '新增参数值',
          onClick: () => openPropertyValueForm({ productPropKeyTemplateId: productPropertyId }),
        }}
        columns={[
          {
            title: '编码',
            dataIndex: 'INDEX',
            render: (_, __, index) => <span>{index + 1}</span>,
          },
          {
            title: '参数值名称',
            dataIndex: 'name',
          },
          {
            title: '参数值图标',
            dataIndex: 'image',
            image: true,
          },
          {
            title: '参数值排序',
            dataIndex: 'serial',
          },
          {
            title: '状态',
            dataIndex: 'status',
            switchProps: {
              modalProps: ({ value }) => ({
                children: value ? '确定禁用该参数值吗' : '确定启用该参数值吗',
              }),
              onChange: handleChangeStatus,
            },
          },
          {
            title: '新增时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            buttonListProps: {
              list: ({ row }) => [
                { text: '编辑', onClick: () => openPropertyValueForm(row) },
                { text: '删除', onClick: () => handleDelete(row) },
              ],
            },
          },
        ]}
      />
    ),
  });

  const openValueManagerModal = useCallback(
    ({ propertyId }: { propertyId: string }) => {
      productPropertyId = propertyId;

      openModal();

      setTimeout(() => {
        actionsRef.current.reload();
      });
    },
    [openModal],
  );

  return {
    openValueManagerModal,
    ValueManagerElement: (
      <>
        {ModalContextHolder}
        {ValueManagerElement}
        {PropertyValueFormElement}
      </>
    ),
  };
};
