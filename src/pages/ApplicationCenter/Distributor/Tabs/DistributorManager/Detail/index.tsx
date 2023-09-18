import { Button, Card, Statistic } from 'antd';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import styles from '@/pages/Dashboard/Workplace/index.less';

import { useImmer } from 'use-immer';
import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

import { useRequest } from 'umi';

import { useEditUserInfoForm } from './useEditUserInfoForm';

import type { DistributorColumns } from '../../../api';
import { getUserBonus } from '../../../api';

type Props = {
  onSuccess: () => void;
};

export type RefProps = {
  open: (v: DistributorColumns) => void;
};

const statisticOptions = [
  { title: '今日新增收益金额', key: 'userBonus' },
  { title: '待结算分佣金额', key: 'totalUnsettlementAmount' },
  { title: '可提现分佣金额', key: 'totalWithdrawalProfit' },
  { title: '累计收益分佣金额', key: 'totalProfit' },
  { title: '累计客户数', key: 'totalFansNum' },
];

const userInfoOptions = [
  { title: '名称', key: 'name' },
  { title: '注册手机号', key: 'registerPhone' },
  { title: '邀请者', key: 'invitationDistributorName' },
];

export const useDetailActionsRef = () => {
  const detailActionsRef = useRef<RefProps>(null);

  return {
    detailActionsRef,
  };
};

export const Detail = forwardRef<RefProps, Props>((props, ref) => {
  const [state, setState] = useImmer({
    visible: false,
    dataSource: {} as DistributorColumns,
    // 用于标记是否进行了分销员信息编辑
    dataIsChange: false,
  });

  const { data: userBonus = 0, run } = useRequest(getUserBonus, {
    manual: true,
    formatResult: (res) => res.data,
  });

  const { openEditUserInfoForm, ModalFormElement } = useEditUserInfoForm((selectedValue) => {
    setState((draft) => {
      draft.dataSource.invitationDistributorName = selectedValue.label;
      draft.dataSource.invitationDistributorId = selectedValue.value;
      draft.dataIsChange = true;
    });
  });

  const handleCancel = useCallback(() => {
    setState((draft) => {
      if (draft.dataIsChange) {
        props.onSuccess();
      }

      draft.visible = false;
      draft.dataIsChange = false;
    });
  }, []);

  const handleOpen = useCallback((dataSource: DistributorColumns) => {
    setState((draft) => {
      if (dataSource.userId !== draft.dataSource.userId) {
        run(dataSource.userId);
      }

      draft.visible = true;
      draft.dataSource = dataSource;
    });
  }, []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  return (
    <ModalWrapper
      {...{
        visible: state.visible,
        title: `${state.dataSource.name} - 信息详情`,
        onCancel: handleCancel,
        okButtonProps: {
          style: { display: 'none' },
        },
      }}
    >
      {ModalFormElement}

      <Card
        type="inner"
        title="分销员信息"
        style={{ marginBottom: 24 }}
        bodyStyle={{ display: 'flex', justifyContent: 'space-around' }}
        extra={
          <Button
            type="primary"
            size="small"
            onClick={() => openEditUserInfoForm(state.dataSource)}
          >
            编辑分销员信息
          </Button>
        }
      >
        {userInfoOptions.map((item) => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '33.33333%',
              justifyContent: 'flex-start',
            }}
          >
            <div>{item.title}：</div>
            <div>{state.dataSource[item.key] || '暂无'}</div>
          </div>
        ))}
      </Card>

      <Card type="inner" title="业绩统计" className={styles.cardWrapper}>
        {statisticOptions.map((item) => (
          <div key={item.title} className={styles.cardStatisticWrapper}>
            <Statistic
              title={item.title}
              value={item.key === 'userBonus' ? userBonus : state.dataSource[item.key] || 0}
              className={styles.cardStatistic}
            />
          </div>
        ))}
      </Card>
    </ModalWrapper>
  );
});
