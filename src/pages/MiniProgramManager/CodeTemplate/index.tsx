import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useCodeTemplateForm } from './CodeTemplateForm';
import type { CodeTemplateColumns } from './Api';
import { deleteDbTemplate, editTemplate, getTemplateList } from './Api';
import { useEditingTemplateForm } from './EditingTemplateForm';

export default function CodeTemplate() {
  const { actionsRef } = useGeneralTableActions<CodeTemplateColumns>();

  const refresh = () => {
    actionsRef.current.reload();
  };

  const { handleOpenCodeTemplateForm, ModalCodeTemplateFormElement } = useCodeTemplateForm(refresh);

  const { handleOpenForm, ModalFormElement } = useEditingTemplateForm({
    title: '编辑模板',
    onSubmit: (values: any) => editTemplate(values).then(() => refresh()),
  });

  return (
    <>
      {ModalCodeTemplateFormElement}
      {ModalFormElement}
      <GeneralTableLayout<CodeTemplateColumns, any>
        {...{
          request: (params: AnyObject) => getTemplateList({ ...params }) as any,
          getActions: actionsRef,
          searchProps: {
            items: [
              {
                version: {
                  title: '模糊查询',
                  type: 'string',
                  'x-component-props': {
                    placeholder: '版本号',
                  },
                },
                type: {
                  title: '模板类型',
                  type: 'string',
                  enum: [
                    { label: '新零售直播版', value: '1' },
                    { label: '新零售普通版', value: '2' },
                  ],
                  'x-component-props': {
                    placeholder: '选择模板类型',
                    showSearch: true,
                    allowClear: true,
                  },
                },
              },
            ],
          },
          operationButtonListProps: {
            list: [
              {
                text: '添加代码模板',
                type: 'primary',
                onClick: () => handleOpenCodeTemplateForm(),
              },
            ],
          },
          columns: [
            {
              title: '版本号',
              dataIndex: 'userVersion',
              width: 140,
            },
            {
              title: '模板id',
              dataIndex: 'templateId',
              width: 140,
            },
            {
              title: '模板类型',
              dataIndex: 'type',
              render: (_, item) => {
                return item.type === '1' ? '新零售直播版' : '新零售普通版';
              },
            },
            {
              title: '版本描述',
              dataIndex: 'userDesc',
              ellipsisProps: true,
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              dateFormatter: true,
            },
            {
              title: '操作',
              dataIndex: 'id',
              width: 140,
              buttonListProps: {
                list: ({ row }) => [
                  {
                    text: '编辑',
                    onClick: () => handleOpenForm(row),
                  },
                  {
                    text: '删除',
                    danger: true,
                    popconfirmProps: {
                      onConfirm: () => {
                        deleteDbTemplate(row).then(() => refresh());
                      },
                    },
                  },
                ],
              },
            },
          ],
        }}
      />
    </>
  );
}
