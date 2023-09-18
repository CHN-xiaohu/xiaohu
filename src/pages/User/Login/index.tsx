import { useCallback, useEffect } from 'react';
import { SchemaForm } from '@/components/Business/Formily';
import { Icons } from '@/components/Library/Icon/Icons';
import { useIntl } from 'umi';
import { AppConfig } from '@/config';

import { Typography } from 'antd';

import { useRequest } from 'ahooks';

import styles from './index.less';

import { getQueryTenant } from '../Api';

export default function UserLogin({ location }: { location: any }) {
  const intl = useIntl();
  const windows = typeof window !== 'undefined' ? window : ({} as any);
  const switchLink =
    windows.location?.href.indexOf('?') !== -1
      ? windows.location?.href.split('?')[0]
      : windows.location?.href;

  const handleLogin = useCallback(
    async (payload: any) => window.$fastDispatch((model) => model.user.login, payload),
    [],
  );

  const { data } = useRequest(() => getQueryTenant({ domain: window.location.host }), {
    formatResult: (res) => res.data,
  });

  const hanleWindowOpenKujiale = () => {
    windows.location.href = `https://oauth.kujiale.com/oauth2/show?client_id=${
      AppConfig.client_id
    }&redirect_uri=${encodeURI(
      AppConfig.apiUrl,
      // eslint-disable-next-line max-len
    )}%2Fzwx-user%2Foauth%2Fredirect%2FredirectTo&scope=get_user_info,get_design,get_budget_list,get_render_pic,solution_of_marketing,get_brandgood_info&response_type=code&state=${switchLink}`;
  };

  const KujialeBtn = () => {
    return (
      <div className={styles.kujiale} onClick={() => hanleWindowOpenKujiale()}>
        <img
          src="https://static.zazfix.com/web/images/2021-05-14/s60zS3c6ydMXq67qm3g3.png"
          className={styles.kujialeIcon}
        />
        <Typography.Text>酷家乐账号登录</Typography.Text>
      </div>
    );
  };

  useEffect(() => {
    if (location.query?.code && location.query?.grantType) {
      if (location.query?.grantType === 'kujiale') {
        handleLogin({
          is_sub_account: 'NO',
          code: location.query?.code,
          grant_type: location.query?.grantType,
        });
      }
      if (location.query?.account && location.query?.grantType === 'pps_oauth') {
        handleLogin({
          is_sub_account: 'NO',
          code: location.query?.code,
          grant_type: location.query?.grantType,
          account: location.query?.account,
        });
      }
    }
  }, [location.query?.code, location.query?.grantType]);

  return (
    <div className={styles.login}>
      <SchemaForm
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onSubmit={handleLogin}
        size="large"
        defaultValue={{
          is_sub_account: 'NO',
          tenant_code: window.injectionGlobalDataSource.code,
        }}
        components={{ KujialeBtn }}
        schema={{
          is_sub_account: {
            type: 'radioGroup',
            default: 'NO',
            'x-props': {
              itemClassName: styles.radioGroup,
            },
            'x-component-props': {
              dataSource: [
                { label: '主账号登陆', value: 'NO' },
                { label: '子账号登陆', value: 'YES' },
              ],
            },
          },
          tenant_code: {
            type: 'string',
            display: !window.injectionGlobalDataSource.code,
            default: window.injectionGlobalDataSource.code,
            'x-component-props': {
              className: styles.other,
              prefix: <Icons type="SafetyOutlined" className={styles.prefixIcon} />,
              placeholder: intl.formatMessage({
                id: 'app.login.tenantCode',
                defaultMessage: '租户号',
              }),
            },
            'x-rules': [{ required: true, message: '请输入租户号' }],
          },
          username: {
            type: 'string',
            'x-component-props': {
              className: styles.other,
              prefix: <Icons type="UserOutlined" className={styles.prefixIcon} />,
              placeholder: '登录账号',
            },
            'x-rules': [
              { required: true, message: '请输入登录密码' },
              { range: [3, 22], message: '账号长度为 %s ~ %s 位' },
            ],
          },
          password: {
            type: 'password',
            'x-component-props': {
              className: styles.other,
              prefix: <Icons type="LockOutlined" className={styles.prefixIcon} />,
              placeholder: '登录密码',
            },
            'x-rules': [
              { required: true, message: '请输入登录密码' },
              { range: [6, 32], message: '密码长度为 %s ~ %s 位' },
            ],
          },
          submitButton: {
            type: 'submitButton',
            'x-component-props': {
              children: '登录',
              style: {
                width: '100%',
                marginTop: 10,
              },
            },
          },
          kujiale: {
            type: 'string',
            visible: data?.source === 'KUJIALE',
            'x-component': 'KujialeBtn',
          },
        }}
      />
    </div>
  );
}
