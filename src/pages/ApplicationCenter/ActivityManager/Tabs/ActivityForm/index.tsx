import { useState } from 'react';

import { InputNumber } from 'antd';

import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import type { SwitchOnChangeParams } from '@/components/Business/Table';

import BookingManageModal from '../../component/BookingManage';
import ChooseActivityForm from '../../component/ChooseActivityForm';

import type { ActivityFormColumns } from '../../Api';
import { deleteActivity } from '../../Api';
import {
  createSiteAndPage,
  getActivityFormList,
  updateActivityStatus,
  chooseTemplate,
  updateSerial,
} from '../../Api';

import { useMiniprogramActivityQR } from '../../component/MiniprogramActivityQR';

export const openDesignEditorPage = (siteId: string, pageId: string) => {
  // https://pps-dev.zazfix.com/design/editor/1?pageId=1
  window.open(`/design/editor/${siteId}?pageId=${pageId}`);
};

export const ActivityForm = () => {
  const { openMiniprogramActivityQR, MiniprogramActivityQRElement } = useMiniprogramActivityQR();
  const { actionsRef } = useGeneralTableActions<ActivityFormColumns>();
  const [openBookingModal, setOpeBookingModal] = useState(false);
  const [openChooseActivity, setOpenChooseActivity] = useState(false);
  const [pageId, setPageId] = useState('');
  const [isSortValue, setIsSortValue] = useState(false);
  const [sortValue, setSortValue] = useState('');
  const [sortIndex, setSortIndex] = useState(0);

  const bookingManageObj = {
    title: '查看预约信息',
    visible: openBookingModal,
    pageId,
    onCancel() {
      setOpeBookingModal(false);
    },
    onOk() {
      setOpeBookingModal(false);
    },
  };

  const chooseActivityObj = {
    title: '选择活动表单',
    visible: openChooseActivity,
    onCancel() {
      setOpenChooseActivity(false);
    },
    onOk(templateId?: string) {
      return createSiteAndPage().then(async (res) => {
        if (templateId) {
          await chooseTemplate({ templateId, pageId: res.data.id, settleType: 'cover' });
        }

        openDesignEditorPage(res.data.designSiteId, res.data.id);

        setOpenChooseActivity(false);

        actionsRef.current.reload();
      });
    },
  };

  const handleSetMessage = (records: ActivityFormColumns) => {
    setPageId(records.id);
    setOpeBookingModal(true);
  };

  const handleChangeStatus = ({
    dataSource: { row },
    value,
  }: SwitchOnChangeParams<ActivityFormColumns, { status: string }>) => {
    return updateActivityStatus({
      id: row.id,
      ...value,
    }).then(() => actionsRef.current.reload());
  };

  const handleChangeSort = (sortI: number, serial: string) => {
    setSortIndex(sortI);
    setSortValue(serial || 0);
    setIsSortValue(true);
  };

  const handlePressEnter = () => {
    updateSerial({ id: pageId, serial: sortValue }).then(() => {
      setIsSortValue(false);
      actionsRef.current.reload();
    });
  };

  const handleChangeSortValue = (v: any, records: ActivityFormColumns) => {
    setSortValue(v);
    setPageId(records.id);
  };

  const handleOnBlur = (e: any, records: any, ii: number) => {
    setSortValue(records.serial || 0);
    setSortIndex(ii);
    setIsSortValue(false);
  };

  return (
    <>
      {MiniprogramActivityQRElement}

      {/* TODO 这里的 modal 待优化 */}
      {openChooseActivity && <ChooseActivityForm {...chooseActivityObj} />}

      {openBookingModal && <BookingManageModal {...bookingManageObj} />}

      <GeneralTableLayout<ActivityFormColumns>
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          items: [
            {
              name: {
                title: '页面名称',
                type: 'string',
                'x-component-props': {
                  placeholder: '页面名称',
                },
                col: 10,
              },
            },
          ],
        }}
        request={(params) =>
          getActivityFormList({ ...params, businessCode: 'GET_CUSTOMER' }) as any
        }
        operationButtonListProps={{
          list: [
            {
              text: '新增活动',
              type: 'primary',
              onClick: () => setOpenChooseActivity(true),
            },
          ],
        }}
        columns={[
          {
            title: '活动名称',
            dataIndex: 'name',
            align: 'center',
            width: 300,
          },
          {
            title: '活动封面图',
            dataIndex: 'coverImage',
            align: 'center',
            image: true,
          },
          {
            title: '预约次数',
            dataIndex: 'bookNum',
            align: 'center',
            width: 140,
          },
          {
            title: '启用状态',
            dataIndex: 'status',
            align: 'center',
            switchProps: {
              activeValue: 1,
              inactiveValue: 2,
              modalProps: ({ value }) => ({
                children: value === 1 ? '确定禁用该活动？' : '确定启用该活动？',
              }),
              onChange: handleChangeStatus,
            },
          },
          {
            title: '排序值',
            dataIndex: 'serial',
            width: 140,
            align: 'center',
            render: (data, records, index: number) => {
              return (
                <>
                  {isSortValue && index === sortIndex ? (
                    <InputNumber
                      onBlur={(e) => handleOnBlur(e, records, index)}
                      onPressEnter={() => handlePressEnter()}
                      onChange={(value) => handleChangeSortValue(value, records)}
                      value={sortValue}
                    />
                  ) : (
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleChangeSort(index, data)}
                    >
                      {data}
                    </span>
                  )}
                </>
              );
            },
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            buttonListProps: {
              align: 'center',
              isLink: true,
              list: ({ row }) => [
                {
                  text: '编辑',
                  type: 'primary',
                  onClick: () => openDesignEditorPage(row.designSiteId, row.id),
                },
                {
                  text: '查看预约',
                  type: 'primary',
                  disabled: !row.isPublish,
                  onClick: () => handleSetMessage(row),
                },
                {
                  text: '推广',
                  type: 'primary',
                  disabled: !row.isPublish,
                  onClick: () => openMiniprogramActivityQR({ id: row.id, name: row.name }),
                },
                {
                  text: '删除',
                  modalProps: {
                    title: '确认删除活动表单吗？',
                    content: '删除活动会同步删除收集的客户信息！',
                    onOk: () =>
                      deleteActivity(row.id).then(() => {
                        actionsRef.current.reload();
                      }),
                  },
                },
              ],
            },
          },
        ]}
      />
    </>
  );
};
