import { memo, useEffect, useState } from 'react';

import { Steps } from 'antd';

import { StepOne, StepTwo } from './OverviewStep';

const { Step } = Steps;

export const ProfileInformation = memo(({ result, refresh }: { result: any; refresh: any }) => {
  const [current, setCurrent] = useState(0);

  const isItAuthorized = result?.success ?? false;

  useEffect(() => {
    if (isItAuthorized) {
      setCurrent(1);
    } else {
      setCurrent(0);
    }
  }, [isItAuthorized]);

  return (
    <Steps direction="vertical" current={current}>
      <Step
        title={'小程序授权'}
        style={{ padding: '0 0 100px 0' }}
        description={<StepOne visible={current === 0} refresh={refresh} />}
      />
      <Step
        title={'提交审核并发布小程序'}
        style={{ padding: '0 0 100px 0' }}
        description={<StepTwo visible={current === 1} />}
      />
    </Steps>
  );
});
