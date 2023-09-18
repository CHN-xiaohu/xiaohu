import { SchemaForm } from '@/components/Business/Formily';
import { useRequest } from 'ahooks';
import { Button, Empty, Spin } from 'antd';
import { memo } from 'react';

import { useConfigureTheServerForm, useBusinessDomainNameForm } from './ConfigureEditForm';

import { getBusinessDomainName, getServerDomainName } from '../../../Api';

const Branch = (props: any) => {
  const domainArray = props.value?.split(';').filter((domain: any) => domain);
  return (
    <div>
      {domainArray?.map((domain: any) => (
        <div key={domain}>{domain}</div>
      ))}
    </div>
  );
};

Branch.isFieldComponent = true;

const serverProperties = {
  requestDomain: {
    type: 'string',
    title: 'request合法域名',
    'x-component': 'Branch',
  },
  wsRequestDomain: {
    type: 'string',
    title: 'socket合法域名',
    'x-component': 'Branch',
  },
  uploadDomain: {
    type: 'string',
    title: 'uploadFile合法域名',
    'x-component': 'Branch',
  },
  downloadDomain: {
    type: 'string',
    title: 'downloadFile合法域名',
    'x-component': 'Branch',
  },
};

const businessProperties = {
  webViewDomain: {
    type: 'string',
  },
};

export const DevelopmentSettings = memo(() => {
  const { data: serverDomainData, loading: serverLoading, refresh: getServer } = useRequest(
    () => getServerDomainName(),
    {
      formatResult: (res) => res.data,
    },
  );

  const { data: businessDomainData, loading: businessLoading, refresh: getBusiness } = useRequest(
    () => getBusinessDomainName(),
    {
      formatResult: (res) => res.data,
    },
  );

  const isServerConfigured = serverDomainData?.configured;
  const isBusinessConfigured = businessDomainData?.configured;
  const { openServerForm, ModalServerFormElement } = useConfigureTheServerForm(getServer);
  const { openBusinessForm, ModalBusinessFormElement } = useBusinessDomainNameForm(getBusiness);

  const UnconfigureServer = () => {
    const {
      openServerForm: openEmptyServerForm,
      ModalServerFormElement: ModalEmptyServerFormElement,
    } = useConfigureTheServerForm(getServer);

    return (
      <>
        {ModalEmptyServerFormElement}
        <Empty
          image={'https://static.zazfix.com/web/images/2021-03-18/DP692rUJ6g4a7J30yv3D.png'}
          description={<span>暂未配置服务器域名</span>}
        >
          <Button
            onClick={() =>
              openEmptyServerForm({
                initialValues: {
                  requestDomain:
                    'https://api-dev.zazfix.com;https://mmbiz.qpic.cn;https://pano3.p.kujiale.com;https://res.wx.qq.com;https://restapi.amap.com;https://sentry.zazfix.com;https://server.zazfix.com;https://static.zazfix.com',
                  wsRequestDomain: 'wss://static.zazfix.com',
                  uploadDomain:
                    'https://mmbiz.qpic.cn;https://res.wx.qq.com;https://static.zazfix.com',
                  downloadDomain:
                    'https://mmbiz.qpic.cn;https://res.wx.qq.com;https://static.zazfix.com',
                },
              })
            }
            type="primary"
          >
            开始配置
          </Button>
        </Empty>
      </>
    );
  };

  const NotConfiguredService = () => {
    const {
      openBusinessForm: openEmptyBusinessForm,
      ModalBusinessFormElement: ModalEmptyBusinessFormElement,
    } = useBusinessDomainNameForm(getBusiness);
    return (
      <>
        {ModalEmptyBusinessFormElement}
        <Empty
          image={'https://static.zazfix.com/web/images/2021-03-18/DP692rUJ6g4a7J30yv3D.png'}
          description={<span>暂未配置业务域名</span>}
        >
          <Button
            onClick={() =>
              openEmptyBusinessForm({
                initialValues: { webViewDomain: [{ damain: 'https://pano61.p.kujiale.com' }] },
              })
            }
            type="primary"
          >
            开始配置
          </Button>
        </Empty>
      </>
    );
  };

  return (
    <>
      {ModalServerFormElement}
      {ModalBusinessFormElement}

      {isServerConfigured && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '20px 0 15px',
          }}
        >
          <div style={{ fontSize: '20px' }}>服务器域名</div>
          <Button
            type="primary"
            onClick={() =>
              openServerForm({
                initialValues: {
                  requestDomain: serverDomainData.requestDomain,
                  wsRequestDomain: serverDomainData.wsRequestDomain,
                  uploadDomain: serverDomainData.uploadDomain,
                  downloadDomain: serverDomainData.downloadDomain,
                },
              })
            }
          >
            修改
          </Button>
        </div>
      )}
      <Spin spinning={serverLoading}>
        <SchemaForm
          {...{
            colon: false,
            editable: false,
            className: 'formUnderline',
            components: { UnconfigureServer, Branch },
            value: serverDomainData,
            labelCol: { span: 3 },
            wrapperCol: { span: 12, offset: 1 },
            schema: {
              serverDomainName: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  type: 'inner',
                  title: '服务器域名',
                },
                properties: isServerConfigured
                  ? serverProperties
                  : { UnconfigureServer: { type: 'UnconfigureServer' } },
              },
            },
          }}
        />
      </Spin>

      {isBusinessConfigured && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '50px 0 15px',
          }}
        >
          <div style={{ fontSize: '20px' }}>业务域名</div>
          <Button
            type="primary"
            onClick={() =>
              openBusinessForm({
                initialValues: {
                  webViewDomain: businessDomainData.webViewDomain
                    ?.split(';')
                    .map((damain: any) => ({ damain })),
                },
              })
            }
          >
            修改
          </Button>
        </div>
      )}
      <Spin spinning={businessLoading}>
        <SchemaForm
          {...{
            colon: false,
            editable: false,
            components: { NotConfiguredService },
            value: businessDomainData,
            schema: {
              serverDomainName: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  title: '域名',
                  type: 'inner',
                },
                properties: isBusinessConfigured
                  ? businessProperties
                  : { NotConfiguredService: { type: 'NotConfiguredService' } },
              },
            },
          }}
        />
      </Spin>
    </>
  );
});
