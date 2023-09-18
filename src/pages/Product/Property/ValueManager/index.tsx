import { useCallback } from 'react';

import type { SwitchOnChangeParams } from '@/components/Business/Table';
import {
  generateDefaultSelectOptions,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import { useModal } from '@/foundations/hooks';

import { usePropertyValueForm } from './Form';

import type { PropertyValueColumns } from '../../Api';
import { updatePropertyValueStatus, getPropertyValueList } from '../../Api';

export const useValueManager = () => {
  const { actionsRef } = useGeneralTableActions<PropertyValueColumns>();

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

  const { openModal, modalElement: ValueManagerElement } = useModal({
    title: '属性值列表',
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
                  placeholder: '属性值名称',
                },
              },
              status: {
                title: '属性值状态',
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
          text: '新增属性值',
          onClick: () => openPropertyValueForm({ productPropKeyTemplateId: productPropertyId }),
        }}
        columns={[
          {
            title: '编码',
            dataIndex: 'INDEX',
            width: 100,
            render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
          },
          {
            title: '属性值名称',
            dataIndex: 'name',
          },
          {
            title: '属性值图标',
            dataIndex: 'image',
            width: 150,
            image: true,
          },
          {
            title: '属性值排序',
            dataIndex: 'serial',
            width: 150,
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: 100,
            switchProps: {
              modalProps: ({ value }) => ({
                children: value ? '确定禁用该属性值吗' : '确定启用该属性值吗',
              }),
              onChange: handleChangeStatus,
            },
          },
          {
            title: '新增时间',
            dataIndex: 'createTime',
            width: 200,
          },
          {
            title: '操作',
            width: 100,
            buttonListProps: {
              list: ({ row }) => [{ text: '编辑', onClick: () => openPropertyValueForm(row) }],
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
        {ValueManagerElement}
        {PropertyValueFormElement}
      </>
    ),
  };
};
