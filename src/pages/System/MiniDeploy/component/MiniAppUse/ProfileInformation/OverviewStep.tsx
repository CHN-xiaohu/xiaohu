import { useRequest } from 'ahooks';
import { Avatar, Button, Card, Image, Space, Spin } from 'antd';
import { Icons } from '@/components/Library/Icon';

import { useEffect } from 'react';

import { useMallTemplateForm } from './MallTemplateForm';
import { authorizeNow, withdrawalOfReview, releaseOnline } from './OverviewOperation';
import { VersionForm } from './VersionForm';

import { getExperienceCode, getOfficialCode, getReleaseHistory } from '../../../Api';

const QrCode = () => {
  const { data: experienceCode, loading: experienceLoading } = useRequest(
    () => getExperienceCode('/pages/index/index'),
    {
      formatResult: (res) => res,
    },
  );
  const { data: officialCode, loading: officiallyLoaded } = useRequest(
    () => getOfficialCode('/pages/index/index'),
    {
      formatResult: (res) => res,
    },
  );

  return (
    <Space size="large">
      <Card
        size="small"
        title={<div style={{ textAlign: 'center' }}>体验码</div>}
        loading={experienceLoading}
      >
        <Image style={{ width: '150px', height: '150px' }} src={experienceCode} />
      </Card>
      <Card
        size="small"
        title={<div style={{ textAlign: 'center' }}>正式码</div>}
        loading={officiallyLoaded}
      >
        <Image style={{ width: '150px', height: '150px' }} src={officialCode} />
      </Card>
    </Space>
  );
};

export const StepOne = ({ visible, refresh }: { visible: boolean; refresh: any }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          使用微信小程序管理员账号扫码进行授权，授权过程中请勾选所有权限以确保小程序功能完整性。
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!visible && (
            <Avatar
              size={14}
              style={{
                color: '#FFF',
                backgroundColor: '#1890FF',
                fontSize: '12px',
                margin: '0 11px 0 0',
              }}
            >
              !
            </Avatar>
          )}
          <Button type="primary" onClick={() => authorizeNow(refresh)}>
            {visible ? '已有小程序立即授权' : '重新授权'}
          </Button>
        </div>
      </div>
      {visible && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <a target="_blank" href={'https://docs.qq.com/doc/DZGJIWWVuR3RNaHhX'}>
            &nbsp; 没有小程序，查看如何快速注册
            <Icons type="RightOutlined" />
          </a>
        </div>
      )}
      {!visible && <QrCode />}
    </>
  );
};

export const Render = ({ isRender, children }: { isRender: boolean; children: any }) => {
  return isRender ? <div style={{ margin: '-20px 0 0 ' }}>{children}</div> : null;
};

export const StepTwo = ({ visible }: { visible: boolean }) => {
  // 查看提交审核记录
  const { data: auditRecord, loading, refresh, run, cancel } = useRequest(
    () => getReleaseHistory(),
    {
      formatResult: (res) => res.data,
      ready: visible,
      pollingInterval: 1000,
      pollingWhenHidden: false,
    },
  );

  const { openForm, ModalFormElement } = useMallTemplateForm(refresh);

  const releaseStatus = auditRecord?.releaseStatus;

  useEffect(() => {
    if (releaseStatus === '9') {
      run();
    } else {
      cancel();
    }
  }, [releaseStatus]);

  return (
    <Spin spinning={loading}>
      {ModalFormElement}
      <div style={{ margin: '0 0 15px 0', display: 'flex', justifyContent: 'space-between' }}>
        <div>提交微信审核（最长14个工作日），审核通过后即可立即发布版本。</div>
        <Render isRender={['8', '7', '6', '5', '3', '1'].includes(releaseStatus)}>
          <Button
            type="primary"
            onClick={() => openForm()}
            style={{ display: visible ? 'block' : 'none' }}
          >
            提交审核
          </Button>
        </Render>
        <Render isRender={['2', '4'].includes(releaseStatus)}>
          <Button
            onClick={() => withdrawalOfReview(refresh)}
            style={{ display: visible ? 'block' : 'none' }}
          >
            撤回审核
          </Button>
        </Render>
        <Render isRender={['9'].includes(releaseStatus)}>
          <Button loading={true} style={{ display: visible ? 'block' : 'none' }}>
            提交审核处理中
          </Button>
        </Render>
        <Render isRender={releaseStatus === '0'}>
          <Button
            type="primary"
            onClick={() => releaseOnline(refresh)}
            style={{ display: visible ? 'block' : 'none' }}
          >
            发布上线
          </Button>
        </Render>
      </div>
      {releaseStatus !== '8' && visible && <VersionForm auditRecord={auditRecord} />}
    </Spin>
  );
};
