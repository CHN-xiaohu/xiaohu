import { useState, useCallback } from 'react';
import type { SwitchOnChangeParams } from '@/components/Business/Table';
import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useValueManager } from './ValueManager';

import { usePropertyForm } from './Form';

import type { PropertyColumns } from '../Api';
import { updatePropertyStatus, getPropertyList } from '../Api';

import { CategoriesTree } from '../components/CategoriesTree';

export default function ProductProperty() {
  const [treeSelecteKeys, setTreeSelecteKeys] = useState<string[]>([]);
  const { actionsRef } = useGeneralTableActions<PropertyColumns>();

  const { openPropertyForm, PropertyFormElement } = usePropertyForm({
    onSubmitSuccess: () => actionsRef.current.refresh(),
  });
  const { openValueManagerModal, ValueManagerElement } = useValueManager();

  const handleChangeStatus = ({
    dataSource: { row, index },
    value,
  }: SwitchOnChangeParams<PropertyColumns, { status: number }>) =>
    updatePropertyStatus({ id: row.id, ...value }).then(() =>
      actionsRef.current.setDataSource((source) => {
        // 直接更新数据，不用请求后端
        source[index] = {
          ...source[index],
          ...value,
        };
      }),
    );

  const handleTreeSelected = (values: string[]) => {
    setTreeSelecteKeys(values);

    actionsRef.current.addSearchParamsAndRefresh({ categoryId: values[0] });
  };

  const handleSearchFormReset = useCallback(() => {
    setTreeSelecteKeys([]);

    actionsRef.current.reload();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {PropertyFormElement}
      {ValueManagerElement}

      <CategoriesTree selectedTreeKeys={treeSelecteKeys} onTreeSelected={handleTreeSelected} />

      <div style={{ flex: 1 }}>
        <GeneralTableLayout<PropertyColumns>
          request={(params) => getPropertyList({ ...params, propType: 1 })}
          getActions={actionsRef}
          searchProps={{
            onReset: handleSearchFormReset,
            items: [
              {
                name: {
                  title: '模糊搜索',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '属性名称',
                  },
                },
                search: {
                  title: '是否可搜索',
                  type: 'checkableTags',
                  'x-component-props': {
                    options: generateDefaultSelectOptions([
                      { label: '是', value: 1 },
                      { label: '否', value: 0 },
                    ]),
                  },
                },
              },
              {
                status: {
                  title: '属性状态',
                  type: 'checkableTags',
                  'x-component-props': {
                    options: generateDefaultSelectOptions([
                      { label: '启用', value: 1 },
                      { label: '禁用', value: 0 },
                    ]),
                  },
                },
                required: {
                  title: '是否必填',
                  type: 'checkableTags',
                  'x-component-props': {
                    options: generateDefaultSelectOptions([
                      { label: '是', value: 1 },
                      { label: '否', value: 0 },
                    ]),
                  },
                },
              },
            ],
          }}
          defaultAddOperationButtonListProps={{
            text: '新增属性',
            onClick: () => openPropertyForm({ categoryId: treeSelecteKeys[0] }),
          }}
          columns={[
            {
              title: '属性名称',
              dataIndex: 'name',
            },
            {
              title: '所属类目',
              dataIndex: 'categoryName',
            },
            {
              title: '是否必填',
              dataIndex: 'required',
              render: (value) => <span>{value ? '是' : '否'}</span>,
            },
            {
              title: '是否可搜索',
              dataIndex: 'search',
              render: (value) => <span>{value ? '是' : '否'}</span>,
            },
            {
              title: '属性排序',
              dataIndex: 'serial',
            },
            {
              title: '状态',
              dataIndex: 'status',
              width: 100,
              switchProps: {
                modalProps: ({ value }) => ({
                  children: value ? '确定禁用该属性吗' : '确定启用该属性吗',
                }),
                onChange: handleChangeStatus,
              },
            },
            {
              title: '新增时间',
              dataIndex: 'createTime',
              width: 178,
            },
            {
              title: '操作',
              width: 160,
              buttonListProps: {
                list: ({ row }) => [
                  {
                    text: '编辑',
                    onClick: () => openPropertyForm(row),
                  },
                  {
                    text: '属性值管理',
                    onClick: () => openValueManagerModal({ propertyId: row.id }),
                  },
                ],
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
