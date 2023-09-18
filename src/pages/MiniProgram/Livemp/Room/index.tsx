import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import dayjs from 'dayjs';

import styles from './index.less';

import { ShareInfoModal, useShareInfoModalActionsRef } from './ShareInfoModal';

import type { LiveRoomColumn } from '../api';
import { deleteLiveRoom } from '../api';
import { getLiveRooms } from '../api';
import { canEditLiveRoom, liveStatusMap } from '../constants';

const goToWeiXinLiveConsole = () => window.open(`https://live.weixin.qq.com/`);

export default function LivempRoom() {
  const { actionsRef: tableActionsRef } = useGeneralTableActions<LiveRoomColumn>();
  const { actionsRef } = useShareInfoModalActionsRef();

  return (
    <>
      <ShareInfoModal ref={actionsRef} />

      <GeneralTableLayout<LiveRoomColumn>
        request={getLiveRooms}
        bordered={false}
        className={styles.wrap}
        getActions={tableActionsRef}
        tableProps={{
          rowKey: 'roomid',
          bordered: false,
        }}
        toolBarProps={false}
        selectedRowsAlertProps={'completelyHidden' as const}
        operationButtonListProps={{
          list: [
            {
              text: '如何创建直播间',
              type: 'link',
              size: 'small',
              icon: 'QuestionCircleOutlined',
              onClick: () => {
                window.open(
                  'https://static.zazfix.com/docs/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%9B%B4%E6%92%AD%E8%BF%90%E8%90%A5%E6%89%8B%E5%86%8C.pdf',
                );
              },
            },
            {
              text: '创建直播间',
              size: 'large',
              type: 'primary',
              onClick: goToWeiXinLiveConsole,
            },
          ],
        }}
        columns={[
          {
            title: '最近开播',
            dataIndex: 'start_time',
            width: 200,
            render: (_, row) => {
              const [startDate, endDate] = [row.start_time, row.end_time].map((t) => [
                dayjs.unix(t).format('M月D日'),
                dayjs.unix(t).format('HH:mm'),
              ]);

              return (
                <div className={styles.tc}>
                  <p className={styles.main}>{startDate[0]}</p>
                  <p className={styles.desc}>
                    {startDate[1]} - {startDate[0] === endDate[0] ? endDate[1] : endDate.join(' ')}
                  </p>
                </div>
              );
            },
          },
          {
            title: '直播间信息',
            dataIndex: 'share_img',
            render: (data, row) => (
              <div className={styles.liveInfo}>
                <div
                  className={styles.cover}
                  style={{
                    backgroundImage: `url(${data?.replace('http://', 'https://')})`,
                  }}
                />

                <div className={styles.infoBox}>
                  <p className={`${styles.title} ellipsis-two`}>{row.name}</p>
                  <p className={styles.desc}>
                    <span className={styles.head}>房间号:</span>
                    {row.roomid}
                  </p>
                  <p className={styles.desc}>
                    <span className={styles.head}>主播:</span>
                    {row.anchor_name}
                  </p>
                </div>
              </div>
            ),
          },
          {
            title: '直播状态',
            dataIndex: 'live_status',
            width: 100,
            render: (type) => <span className={styles.liveStatus}>{liveStatusMap[type]}</span>,
          },
          {
            title: '操作',
            dataIndex: 'roomid',
            width: 200,
            buttonListProps: {
              maxCount: 3,
              list: ({ row }) => {
                return [
                  {
                    text: '控制台',
                    onClick: goToWeiXinLiveConsole,
                  },
                  // {
                  //   text: '分享',
                  //   disabled: !canShowShare(row.live_status),
                  //   onClick: () => actionsRef.current?.open(row.roomid),
                  // },
                  {
                    text: '编辑',
                    disabled: !canEditLiveRoom(row.live_status),
                    onClick: goToWeiXinLiveConsole,
                  },
                  {
                    text: '删除',
                    modalProps: {
                      title: '确定删除直播间吗？',
                      onOk: () =>
                        deleteLiveRoom(row.roomid).then(() => {
                          tableActionsRef.current.reload();
                        }),
                    },
                  },
                ];
              },
            },
          },
        ]}
      />
    </>
  );
}
