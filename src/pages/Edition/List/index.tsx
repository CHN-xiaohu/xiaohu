import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useState, useCallback } from 'react';
import { Modal } from 'antd';

import { useEditionForm } from '../Form';
import type { editionColumns } from '../Api';
import { getEditonList, deleteEdition } from '../Api';

export default function EditionList() {
  const { actionsRef } = useGeneralTableActions<editionColumns>();
  const isForce = ['否', '是'];
  const phoneType = ['Android', 'IOS'];

  const [isOpenDelete, setOpenDelete] = useState(false);
  const [id, setId] = useState('');

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = useEditionForm({
    onAddSuccess: handleCreateAdSuccess,
  });

  // const openForm = EditionForm({
  //   onAddSuccess: handleCreateAdSuccess,
  // });

  const handleOpenDelete = (records: any) => {
    setOpenDelete(true);
    setId(records.id);
  };

  const deleteMessage = {
    title: '提示',
    width: 250,
    visible: isOpenDelete,
    onCancel() {
      setOpenDelete(false);
    },
    onOk() {
      deleteEdition(id).then(() => handleCreateAdSuccess());
      setOpenDelete(false);
    },
  };

  return (
    <>
      {ModalFormElement}
      <Modal {...deleteMessage}>
        确认删除版本号？
        <br />
        删除后不会再提醒用户的更新
      </Modal>
      <GeneralTableLayout<editionColumns, any>
        request={getEditonList as any}
        getActions={actionsRef}
        defaultAddOperationButtonListProps={{
          text: '新增版本',
          onClick: () => openForm(),
        }}
        columns={[
          {
            title: '版本号',
            dataIndex: 'editionCode',
          },
          {
            title: '版本序列',
            dataIndex: 'editionSerialCode',
          },
          {
            title: '系统',
            dataIndex: 'mobileSystem',
            render: (data) => <span>{phoneType[Number(data)]}</span>,
          },
          {
            title: '强制更新',
            dataIndex: 'forceUpdate',
            render: (data) => <span>{isForce[Number(data)]}</span>,
          },
          {
            title: '最低更新版本',
            dataIndex: 'lowestEditionCode',
          },
          {
            title: '更新内容',
            dataIndex: 'updateContent',
            width: '25%',
          },
          {
            title: '生效时间',
            dataIndex: 'effectiveTime',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [{ text: '删除', onClick: () => handleOpenDelete(row) }],
            },
          },
        ]}
      />
    </>
  );
}
