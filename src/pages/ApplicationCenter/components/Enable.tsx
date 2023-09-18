import { SwitchPlus } from '@/components/Library/Switch';
import { useForceUpdate } from '@/foundations/hooks';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card } from 'antd';
import { useRef } from 'react';

type Props = {
  text: string;
  title: string;
  description: string;
  helpHref: string;
  getStatus: () => PromiseResponseResult<number>;
  updateStatus: (type: any) => PromiseResponseResult<number>;
};

export const Enable = ({ title, description, text, helpHref, getStatus, updateStatus }: Props) => {
  // 减少一次请求
  const activeRef = useRef<0 | 1>(0);
  const forceUpdate = useForceUpdate();

  const { loading } = useRequest(getStatus, {
    formatResult: (res) => {
      activeRef.current = res.data as 0;
    },
  });

  const update = () => {
    const value = Number(!activeRef.current) as 0;

    return updateStatus(value).then(() => {
      activeRef.current = value;
      forceUpdate();
    });
  };

  const typeText = activeRef.current ? '开启' : '关闭';

  return (
    <Card style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{title}</span>

          <SwitchPlus
            field="openStatus"
            value={activeRef.current}
            inactiveValue={1}
            activeValue={0}
            loading={loading}
            modalProps={{
              children: `${typeText}${text}功能，新订单将${
                activeRef.current ? '' : '不'
              }参与分佣，是否确定${typeText}？`,
            }}
            onChange={update}
          />
        </div>

        <a target="_blank" rel="noreferrer" href={helpHref}>
          <QuestionCircleOutlined />
          <span style={{ marginLeft: '5px' }}>查看{text}帮助文档</span>
        </a>
      </div>

      <div style={{ color: '#999', marginTop: '5px' }}>{description}</div>
    </Card>
  );
};
