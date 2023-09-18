import { useState } from 'react';
import { Card, Row, Col, Popover, Spin } from 'antd';
import { useMount, useRequest } from 'ahooks';

import type { AdvColumns } from '../Api';
// import { getByBusinessDetail } from '../Api';
import { getAdvDetail, getProduct, getGroupDetail } from '../Api';

import { showLocation, skipLocation, advStatus } from '../components/index';

import style from '../style.less';

const AdvDetail = ({
  match: {
    params: { id },
  },
}: any) => {
  const [isMini, setIsMini] = useState(false);
  const [showName, setIsShowName] = useState('');

  useMount(() => {
    setIsMini(window.location.pathname.split('/').includes('miniProgram'));
  });

  const { loading, data: detail = {} as AdvColumns } = useRequest(() => getAdvDetail(id), {
    formatResult: (res) => {
      const { data } = res;
      console.log(data.skipLocation);
      // eslint-disable-next-line default-case
      switch (data.skipLocation) {
        case 'APP_PRODUCT_DETAIL':
          getProduct({ inculdeIds: data.skipValue } as any).then((proRes: any) => {
            const { records }: any = proRes.data;
            setIsShowName(records[0].name);
          });
          break;
        case 'GROUP_PURCHASE_PAGE':
          getGroupDetail(data.skipValue).then((resGroup) => {
            setIsShowName(resGroup.data.activityName);
          });
          break;
        // case 'ACTION_FORM_PAGE':
        //   getByBusinessDetail(data.skipValue).then((resDetail) => {
        //     console.log(resDetail, 'resDetail');
        //     setIsShowName(resDetail.data.activityName);
        //   });
        //   break;
        case 'BROADCAST_DETAIL':
          setIsShowName(`小程序直播房间号：${data.skipValue}`);
          break;
        case 'BROADCAST_LIST':
          setIsShowName(`小程序直播列表`);
          break;
      }

      return data;
    },
  });

  return (
    <Spin spinning={loading}>
      <Card className={style.detail} title="广告信息" bodyStyle={{ padding: 12 }}>
        <Row className={style.message} gutter={24}>
          <Col md={8} sm={24}>
            广告标题：{detail.name}
          </Col>
          {isMini ? (
            <Col md={8} sm={24}>
              <span>生效状态：{advStatus[Number(detail.status)]}</span>
            </Col>
          ) : (
            <Col md={8} sm={24}>
              展示终端：
              {Number(detail.terminal) === 1
                ? 'IOS'
                : Number(detail.terminal) === 2
                ? 'Android'
                : 'IOS&Android'}
            </Col>
          )}
          <Col md={8} sm={24}>
            广告位置：{showLocation(detail.location)}
          </Col>
        </Row>
        <Row className={style.message} gutter={24}>
          <Col md={8} sm={24}>
            广告跳转：{skipLocation(detail.skipLocation)}
            {showName && <span>（{showName}）</span>}
          </Col>
          <Col md={8} sm={24}>
            位置排序：{detail.sort}
          </Col>
          <Col md={8} sm={24}>
            生效时间：
            {detail.startTime !== '1999-01-01 00:00:00'
              ? `${detail.startTime}至${detail.endTime}`
              : '长期'}
          </Col>
        </Row>
        <Row className={style.pic}>
          <Col md={8} sm={24}>
            <div>广告图片：</div>
            <div className={style.divImg}>
              <Popover
                key={id}
                placement={id <= 2 ? 'right' : 'left'}
                content={<img src={detail.picUrl} width="400px" alt="" />}
              >
                <img
                  key={id}
                  alt="lencentPicture"
                  className={style.imgShowAnimation}
                  style={{ marginRight: 20 }}
                  src={detail.picUrl}
                  width="120px"
                  height="120px"
                />
              </Popover>
            </div>
          </Col>
          <Col md={8} sm={24}>
            <span style={{ marginLeft: '8px' }}>启用状态：{detail.isUsing ? '启用' : '禁用'}</span>
          </Col>
          {!isMini && (
            <Col md={8} sm={24}>
              <span style={{ marginLeft: '15px' }}>
                生效状态：{advStatus[Number(detail.status)]}
              </span>
            </Col>
          )}
        </Row>
      </Card>
    </Spin>
  );
};

export default AdvDetail;
