import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import type { BookingManageColumns } from '../../Api';
import { getBookingList } from '../../Api';
import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

const BookingManageModal = ({ pageId, ...bookingManageObj }: any) => {
  const { actionsRef } = useGeneralTableActions<BookingManageColumns>();

  return (
    <ModalWrapper {...bookingManageObj}>
      <GeneralTableLayout
        request={(params) => getBookingList({ ...params, pageId }) as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        searchProps={{
          minItem: 2,
          items: [
            {
              '[startTime,endTime]': convenientDateRangeSchema({ title: '预约时间' }),
            },
          ],
        }}
        columns={[
          {
            title: '预约信息',
            dataIndex: 'vals',
            width: 350,
            render: (records) =>
              records?.map((items: any, index: number) => {
                // eslint-disable-next-line react/no-array-index-key
                return <div key={items + index}>{items}</div>;
              }),
          },
          {
            title: '预约时间',
            dataIndex: 'createTime',
            width: 200,
          },
          {
            title: '处理人',
            dataIndex: 'distribution',
            width: 200,
            render: (data: any, records: BookingManageColumns) => {
              const handler = { ...records.distributor, ...records.store };
              return (
                <div>
                  {handler?.storeName === undefined && handler.name === undefined ? (
                    <div>平台</div>
                  ) : (
                    <div>
                      <div>{handler?.storeName || handler?.name}</div>
                      <div>{handler?.linkPhone || handler?.phone}</div>
                    </div>
                  )}
                </div>
              );
            },
          },
        ]}
      />
    </ModalWrapper>
  );
};

export default BookingManageModal;
