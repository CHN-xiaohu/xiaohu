import { Alert, Card, Tabs } from 'antd';

import { memo } from 'react';

import { TemplateMessage } from './TemplateMessage';
// import { useRequest } from 'ahooks';

const { TabPane } = Tabs;

export const News = memo(() => {
  return (
    <>
      <Card>
        <Alert
          message={
            <>
              <div>使用须知: </div>
              <div>1、使用微信小程序/公众号模板消息需先绑定小程序/公众号。</div>
              <div>
                2、每个认证服务号或小程序最多可同时启用25个模板ID（相同的模板编号为一个ID）；公众号或小程序已添加的模板一旦达到25个，可能无法正常推送消息，此时请商家进入微信公众号后台删除部分不启用的模板。
              </div>
              <div>3、公众号模板消息所要跳转的小程序，小程序的必须与公众号具有绑定关系</div>
            </>
          }
          type="info"
        />
        <Tabs defaultActiveKey="2">
          <TabPane tab="小程序订阅消息" key="1" />
          <TabPane tab="公众号模板消息" key="2">
            <TemplateMessage />
          </TabPane>
        </Tabs>
      </Card>
    </>
  );
});
