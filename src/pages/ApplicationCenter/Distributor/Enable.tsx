import { getDistributorEnableStatus, updateDistributorEnableStatus } from './api';

import { Enable as EnableComp } from '../components/Enable';

export const Enable = () => {
  return (
    <EnableComp
      {...{
        text: '分销员',
        title: '分销员（粉丝裂变）',
        description: '分销员成功招募粉丝，下单奖励订单分佣，快速提升销售额',
        helpHref: 'https://docs.qq.com/doc/DZEZZcVliYm1maUpp',
        getStatus: getDistributorEnableStatus,
        updateStatus: updateDistributorEnableStatus,
      }}
    />
  );
};
