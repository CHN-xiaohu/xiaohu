/* eslint-disable @typescript-eslint/naming-convention */
/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 用户信息相关
|
*/
import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';
import type { LoginSuccessInfo } from '@/pages/User/Api';
import { accountLogin } from '@/pages/User/Api';
import { injectionTenantAndUserInfoToSentry } from '@/sentry';
import { UserAuthTokenCache, UserAuthorityCache, UserInfoCache, logout } from '@/services/User';

import { message } from 'antd';
import { history } from 'umi';

const ModelDefinition = extendBaseModel({
  namespace: 'user' as 'user',

  state: {
    userInfo: {} as Partial<{
      phone: string;
      avatar: string;
      name: string;
      username: string;
      isSubAccount: string;
    }>,
  },

  effects: {
    *getUserInfo(_: DvaAnyAction, { put }: DvaEffectsCommandMap) {
      const userInfo = UserInfoCache.get();
      if (!userInfo) {
        yield put({ type: 'logout' });

        return Promise.reject(new Error(''));
      }

      yield put({
        type: 'updateState',
        payload: {
          userInfo,
        },
      });

      return Promise.resolve(userInfo);
    },

    *login({ payload }: DvaAnyAction, { call, put }: DvaEffectsCommandMap) {
      const response: any = yield call(accountLogin, payload);

      if (response.error_description) {
        message.error(response.error_description);
        return Promise.reject();
      }
      if (!response?.sys_account_user_id) {
        message.error('没有找到对应的品牌商，请重新登录');
        return Promise.reject();
      }

      const {
        token_type,
        access_token,
        role_name,
        account,
        user_name,
        avatar,
        tenant_code,
        user_id,
        is_sub_account,
        source,
      } = response as LoginSuccessInfo;

      const userInfo = {
        avatar,
        account,
        source,
        name: user_name,
        authority: role_name,
        tenantCode: tenant_code,
        userId: user_id,
        isSubAccount: is_sub_account || 'NO',
      };

      UserAuthTokenCache.set(`${token_type} ${access_token}`);
      UserAuthorityCache.set(typeof role_name === 'string' ? role_name.split(',') : role_name);
      UserInfoCache.set(userInfo);

      injectionTenantAndUserInfoToSentry();

      yield put({
        type: 'updateState',
        payload: {
          userInfo,
        },
      });

      history.push('/');

      return Promise.resolve(userInfo);
    },

    *logout() {
      yield logout();
    },
  },
});

export default ModelDefinition;

type GeneralExtensionInheritance<V> = {
  // eslint-disable-next-line no-undef
  user: GetAssignMethods<V>;
};

declare global {
  interface GlobalModelState {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: typeof ModelDefinition.state;
  }

  interface GlobalModelReducers // eslint-disable-next-line no-undef
    extends GeneralExtensionInheritance<typeof ModelDefinition.reducers> {
    //
  }

  // eslint-disable-next-line no-undef
  interface GlobalModelEffects extends GeneralExtensionInheritance<typeof ModelDefinition.effects> {
    //
  }
}
