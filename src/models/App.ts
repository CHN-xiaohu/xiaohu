/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 全局通用相关
|
*/

import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';
import type { RouteChildrenProps } from '@/typings/basis';
import { UserAuthorityRoutesCache, UserButtonsAuthorityCache } from '@/services/User';
import type { AuthButtonsColumns } from '@/services/Api/Global';
import { getRoutes, getAuthButtons } from '@/services/Api/Global';
import type { MenuDataItem } from '@ant-design/pro-layout';

type State = {
  location: RouteChildrenProps['location'];
  breadcrumb: RouteChildrenProps['route']['routes']; // 面包屑集合
  currentRoute: RouteChildrenProps['route']['routes'][0];
  collapsed: boolean;
  menu: MenuDataItem[];
  authButtons: Record<string, AuthButtonsColumns>;
  menuLoading: boolean;
};

const ModelDefinition = extendBaseModel({
  namespace: 'app' as 'app',

  state: {
    location: {} as State['location'],
    breadcrumb: [], // 面包屑集合
    currentRoute: {} as State['currentRoute'],
    collapsed: false,
    menu: UserAuthorityRoutesCache.get<any[]>([]),
    authButtons: UserButtonsAuthorityCache.get({}),
    menuLoading: false,
  } as State,

  reducers: {
    //
  },

  effects: {
    *initialize(_: DvaAnyAction, { call, put }: DvaEffectsCommandMap) {
      // https://github.com/ant-design/pro-components/blob/2d2278b3bbac3f69904fad34e25ec196c98becfd/packages/layout/src/BasicLayout.tsx#L285
      // https://github.com/ant-design/pro-components/issues/803
      if (!UserAuthorityRoutesCache.get()) {
        yield put({
          type: 'updateState',
          payload: {
            menuLoading: true,
          },
        });
      }

      const currentRoutes = yield call(getRoutes);

      // 获取按钮的权限集合
      yield put({ type: 'handleAuthButtons' });

      // 储存到缓存中
      UserAuthorityRoutesCache.set(currentRoutes.data);

      yield put({
        type: 'updateState',
        payload: {
          menu: currentRoutes.data,
          menuLoading: false,
        },
      });
    },

    // 获取按钮的权限集合
    *handleAuthButtons(_: DvaAnyAction, { call, put }: DvaEffectsCommandMap) {
      const result: { path: string; children: { path: string }[] }[] = yield call(getAuthButtons);

      const authButtons = {};
      const flatAuthButtons = (arr: AuthButtonsColumns[]) => {
        for (let i = 0; i < arr.length; i += 1) {
          const item = arr[i];
          authButtons[item.path] = item;

          if (item.children) {
            flatAuthButtons(item.children);
          }
        }
      };

      yield flatAuthButtons((result?.length ? result : []) as any);

      // 设置到缓存
      UserButtonsAuthorityCache.set(authButtons);

      yield put({
        type: 'updateState',
        payload: {
          authButtons,
        },
      });
    },
  },
});

export default ModelDefinition;

type GeneralExtensionInheritance<V> = {
  // eslint-disable-next-line no-undef
  app: GetAssignMethods<V>;
};

declare global {
  interface GlobalModelState {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: typeof ModelDefinition.state;
  }

  // eslint-disable-next-line no-undef
  interface GlobalModelReducers // eslint-disable-next-line no-undef
    extends GeneralExtensionInheritance<typeof ModelDefinition.reducers> {
    //
  }

  // eslint-disable-next-line no-undef
  interface GlobalModelEffects extends GeneralExtensionInheritance<typeof ModelDefinition.effects> {
    //
  }
}
