import type { LiveRoomColumn } from '@/pages/MiniProgram/Livemp/api';
import { getLiveRooms } from '@/pages/MiniProgram/Livemp/api';
import type { IFieldState } from '@/components/Business/Formily';

export const liveLinkageEffects = (
  resetSkipValueFieldState: (cb: (f: IFieldState) => void) => void,
  type: string,
) => {
  // 详情
  if (type === 'BROADCAST_DETAIL') {
    resetSkipValueFieldState((state) => {
      const message = '请选择跳转的直播间';

      state.props['x-component'] = 'SelectByLoadMore';
      state.props['x-component-props'] = {
        placeholder: message,
        request: (params: AnyObject) =>
          getLiveRooms(params).then((res) => ({
            data: (res.data.records as LiveRoomColumn[]).map((item) => ({
              label: item.name,
              value: item.roomid,
            })),
            total: res.data.total,
          })),
      };

      state.props['x-rules'] = [
        {
          required: true,
          message,
        },
      ];
    });
  } else if (type === 'BROADCAST_LIST') {
    resetSkipValueFieldState((state) => {
      state.visible = false;
    });
  }
};
