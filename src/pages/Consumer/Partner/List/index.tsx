import {
  generateDefaultSelectOptions,
  useGeneralTableActions,
  GeneralTableLayout,
} from '@/components/Business/Table';

import { SwitchPlus } from '@/components/Library/Switch';

import { useState, useCallback } from 'react';

import type { partnerColumns } from '../Api';
import { getPartnerList, updateStatus } from '../Api';
import { usePartnerForm } from '../Form';

import OfflineStoreList from '../component/OfflineStoreList';
import PartnerPartnerList from '../component/PartnerPartnerlist';

export default function PartnerList() {
  const [openModal, setOpenModal] = useState(0);
  const [partnerId, setPartnerId] = useState('');
  const { actionsRef } = useGeneralTableActions<partnerColumns>();

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = usePartnerForm({
    onAddSuccess: handleCreateAdSuccess,
  });

  const handleOpenofflineStores = (record: any) => {
    setPartnerId(record.id);
    setOpenModal(1);
  };

  const handleChangeStatus = (_: any, record: any) => {
    return updateStatus(record.id).then(() => {
      actionsRef.current.reload();
    });
  };

  const handleOpenPartnerPartners = (record: any) => {
    setPartnerId(record.id);
    setOpenModal(2);
  };

  const offlineListOpt = {
    title: '查看线下商家',
    visible: openModal === 1,
    width: 1000,
    partnerId,
    onCancel() {
      setOpenModal(0);
    },
    onOk() {
      setOpenModal(0);
    },
  };

  const partnerPartnerOpt = {
    title: '查看合伙人',
    visible: openModal === 2,
    width: 1000,
    partnerId,
    onCancel() {
      setOpenModal(0);
    },
    onOk() {
      setOpenModal(0);
    },
  };

  return (
    <>
      {ModalFormElement}
      {openModal === 1 && <OfflineStoreList {...offlineListOpt} />}
      {openModal === 2 && <PartnerPartnerList {...partnerPartnerOpt} />}
      <GeneralTableLayout<partnerColumns, any>
        request={getPartnerList as any}
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          items: [
            {
              selectField: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '合伙人姓名、注册手机',
                },
              },
              '[selectStartDate,selectEndDate]': {
                title: '注册时间',
                type: 'daterange',
                col: 16,
                props: {
                  format: 'YYYY-MM-DD',
                },
              },
            },
            {
              status: {
                title: '启用状态',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '正常', value: '1' },
                      { label: '禁用', value: '0' },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          text: '新增合伙人',
          onClick: () => openForm(),
        }}
        columns={[
          {
            title: '姓名',
            dataIndex: 'partnerName',
          },
          {
            title: '注册手机',
            dataIndex: 'partnerPhone',
          },
          {
            title: '所在地区',
            dataIndex: 'area',
            width: '20%',
            render: (_: any, records: any) => (
              <span>
                {records.province}
                {records.city}
                {records.area}
              </span>
            ),
          },
          {
            title: '上线合伙人',
            dataIndex: 'parentAccount',
          },
          {
            title: '线下合伙人',
            dataIndex: 'sonPartnerCount',
          },
          {
            title: '线下商家',
            dataIndex: 'sonStoreCount',
          },
          {
            title: '启用状态',
            dataIndex: 'status',
            render: (data, record, index) => (
              <SwitchPlus
                field="status"
                value={data}
                onChange={() => handleChangeStatus(index, record)}
                modalProps={{
                  children: (
                    <span>
                      {
                        // eslint-disable-next-line no-extra-boolean-cast
                        Boolean(data) ? (
                          <span>
                            确定禁用该合伙人？
                            <br />
                            禁用后无法登录合伙人后台
                          </span>
                        ) : (
                          '确定启用该合伙人？'
                        )
                      }
                    </span>
                  ),
                }}
              />
            ),
          },
          {
            title: '注册时间',
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
                  onClick: () =>
                    openForm({
                      ...row,
                      place: [row.province, row.city, row.area],
                    }),
                },
                { text: '查看商家', onClick: () => handleOpenofflineStores(row) },
                { text: '查看合伙人', onClick: () => handleOpenPartnerPartners(row) },
              ],
            },
          },
        ]}
      />
    </>
  );
}
