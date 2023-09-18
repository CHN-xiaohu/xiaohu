import { useModal } from '@/foundations/hooks';
import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import { useRef } from 'react';
import { Modal, message } from 'antd';

import { cloneDeep } from 'lodash';

import type { CodeTemplateDraftColumns } from './Api';
import { addToTemplate, deleteTemplate, getFormalTemplateList, synchronizeData } from './Api';
import { useEditingTemplateForm } from './EditingTemplateForm';

export const useForm = (handleOpenForm: any) => {
  const { actionsRef } = useGeneralTableActions<CodeTemplateDraftColumns>();
  const paginationTablePropsRef = useRef({
    allData: [],
    current: 1,
    pageSize: 20,
  });

  const getCurrentPageDataSource = (current?: number, pageSize?: number) => {
    const realCurrent = current ?? paginationTablePropsRef.current.current;
    const realPageSize = pageSize ?? paginationTablePropsRef.current.pageSize;

    return paginationTablePropsRef.current.allData.slice(
      (realCurrent - 1) * realPageSize || 0,
      realPageSize * realCurrent,
    );
  };

  const batchDeletion = (selectedRowKeys: any[]) => {
    if (selectedRowKeys?.length < 1) {
      return message.warning('请勾选需要操作的模板！');
    }
    return Modal.confirm({
      title: '删除确认',
      content: '确定删除选中模板？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteTemplate({ templateId: selectedRowKeys }).then(() => {
          actionsRef.current.reload();
        });
      },
    });
  };

  const { openModal, modalElement } = useModal({
    title: '模板列表',
    footer: null,
    children: (
      <GeneralTableLayout<CodeTemplateDraftColumns, any>
        {...{
          request: () => {
            return getFormalTemplateList() as PromiseResponsePaginateResult<CodeTemplateDraftColumns>;
          },
          useTableOptions: {
            formatResult: (res) => {
              paginationTablePropsRef.current.allData = res.data;

              return {
                ...res,
                data: getCurrentPageDataSource(),
                total: res.data.length,
              };
            },
          },
          getActions: actionsRef,
          toolBarProps: false,
          selectedRowsAlertProps: {
            onDeleteSelected: (selectedRowKeys) => batchDeletion(selectedRowKeys),
          },
          tableProps: {
            rowKey: 'templateId',
            onChange: (pagination) => {
              actionsRef.current.setUseTableHookState((draft) => {
                draft.data = cloneDeep(
                  getCurrentPageDataSource(pagination.current!, pagination.pageSize!),
                );
                draft.current = pagination.current!;
                paginationTablePropsRef.current.current = pagination.current!;
                draft.pageSize = pagination.pageSize!;
                paginationTablePropsRef.current.pageSize = pagination.pageSize!;
              });
            },
          },
          operationButtonListProps: {
            list: [
              {
                text: '草稿箱同步模板',
                type: 'primary',
                onClick: () => synchronizeData().then(() => actionsRef.current.reload()),
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
              title: '版本描述',
              dataIndex: 'userDesc',
              ellipsisProps: true,
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              dateFormatter: (dayjs, dataSource) =>
                dayjs(dataSource.value * 1000).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              title: '操作',
              width: 140,
              buttonListProps: {
                list: ({ row }) => [
                  {
                    text: '添加模板',
                    onClick: () => handleOpenForm(row),
                  },
                  {
                    text: '删除',
                    danger: true,
                    popconfirmProps: {
                      onConfirm: () => {
                        deleteTemplate({ templateId: [row.templateId] }).then(() =>
                          actionsRef.current.reload(),
                        );
                      },
                    },
                  },
                ],
              },
            },
          ],
        }}
      />
    ),
  });

  return {
    openModal,
    modalElement,
  };
};

export const useCodeTemplateForm = (refresh: any) => {
  const { handleOpenForm, ModalFormElement } = useEditingTemplateForm({
    title: '模板设置',
    onSubmit: (values: any) => addToTemplate(values).then(() => refresh()),
  });

  const { openModal, modalElement } = useForm(handleOpenForm);

  return {
    ModalCodeTemplateFormElement: (
      <>
        {ModalFormElement}
        {modalElement}
      </>
    ),
    handleOpenCodeTemplateForm: openModal,
  };
};
