import { updateOpenTypeSalesmanSetting, getOpenTypeSalesmanSetting } from './Api';

import { Enable as EnableComp } from '../components/Enable';

export const Enable = () => {
  return (
    <EnableComp
      {...{
        text: '业务员',
        title: '业务员（裂变招商）',
        description: '业务员成功招募经销商，下单奖励订单分佣，快速提升销售额',
        helpHref: 'https://docs.qq.com/doc/DZGJDSXVMV2t2Y2RO',
        getStatus: getOpenTypeSalesmanSetting,
        updateStatus: updateOpenTypeSalesmanSetting,
      }}
    />
  );
};
