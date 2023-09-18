import type { SwitchOnChangeParams } from '@/components/Business/Table';
import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useState, useCallback } from 'react';

import { Modal } from 'antd';

import { useValueManager } from './ValueManager';

import { usePropertyForm } from './Form';

import type { PropertyColumns } from '../Api';
import { updatePropertyStatus, getPropertyList, deleteParams } from '../Api';

import { CategoriesTree } from '../components/CategoriesTree';

export default function ProductParams() {
  const [treeSelecteKeys, setTreeSelecteKeys] = useState<string[]>([]);
  const { actionsRef } = useGeneralTableActions<PropertyColumns>();

  const [modal, ModalContextHolder] = Modal.useModal();

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

  const handleDelete = useCallback((row: PropertyColumns) => {
    modal.confirm({
      title: '确定删除该参数？',
      content: '若删除该参数，品牌商下的参数设置也将被删除',
      onOk: () => deleteParams(row.id).then(() => actionsRef.current.reload()),
    });
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {PropertyFormElement}
      {ValueManagerElement}
      {ModalContextHolder}

      <CategoriesTree selectedTreeKeys={treeSelecteKeys} onTreeSelected={handleTreeSelected} />

      <div style={{ flex: 1 }}>
        <GeneralTableLayout<PropertyColumns>
          request={(params) => getPropertyList({ ...params, propType: 2 })}
          getActions={actionsRef}
          searchProps={{
            onReset: handleSearchFormReset,
            items: [
              {
                name: {
                  title: '模糊搜素',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '参数名称',
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
              {
                optionType: {
                  title: '选择类型',
                  type: 'checkableTags',
                  'x-component-props': {
                    options: generateDefaultSelectOptions([
                      { label: '下拉', value: 1 },
                      { label: '多选', value: 2 },
                      { label: '文本', value: 3 },
                    ]),
                  },
                },
                status: {
                  title: '参数状态',
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
            text: '新增参数',
            onClick: () => openPropertyForm({ categoryId: treeSelecteKeys[0] }),
          }}
          columns={[
            {
              title: '参数名称',
              dataIndex: 'name',
            },
            {
              title: '所属类目',
              dataIndex: 'categoryName',
            },
            {
              title: '选项类型',
              dataIndex: 'optionType',
              formatterValue: ({ value }) => ({ 1: '下拉', 2: '多选', 3: '文本' }[Number(value)]),
            },
            {
              title: '是否必填',
              dataIndex: 'required',
              // formatterValue: value => value ? '是' : '否',
              formatterValue: (valueMap) => {
                const { value } = valueMap;
                return value ? '是' : '否';
              },
            },
            {
              title: '是否可搜索',
              dataIndex: 'search',
              // formatterValue: value => value ? '是' : '否',
              formatterValue: (valueMap) => {
                const { value } = valueMap;
                return value ? '是' : '否';
              },
            },
            {
              title: '属性排序',
              dataIndex: 'serial',
            },
            {
              title: '状态',
              dataIndex: 'status',
              switchProps: {
                modalProps: ({ value }) => ({
                  children: value ? '确定禁用该参数吗' : '确定启用该参数吗',
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
                  { text: '编辑', onClick: () => openPropertyForm(row) },
                  ...(row.optionType === 3
                    ? []
                    : [
                        {
                          text: '参数值管理',
                          onClick: () => openValueManagerModal({ propertyId: row.id }),
                        },
                      ]),
                  {
                    text: '删除',
                    onClick: () => handleDelete(row),
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
