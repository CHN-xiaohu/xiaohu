import { Alert, Button } from 'antd';

import type { cellectColumn } from '../../Api';
import styles from '../index.less';

export const RenderBtn = ({
  view,
  reviewStatus,
  distributionId,
  handleShowDetail,
  handleSetValue,
  setOpenDistributor,
}: {
  view: cellectColumn['view'];
  reviewStatus: any;
  distributionId: cellectColumn['distributionId'];
  handleShowDetail: any;
  handleSetValue: any;
  setOpenDistributor: any;
}) => {
  const DistributionButton = () => {
    return (
      <>
        {distributionId?.length > 2 ? (
          <Button onClick={() => handleShowDetail()} type="primary">
            查看分销商品
          </Button>
        ) : (
          <>
            <Button onClick={() => handleSetValue(1)} type="primary">
              上架到店铺
            </Button>
            <Button onClick={() => handleSetValue(2)} className={styles.addButton}>
              添加到仓库
            </Button>
          </>
        )}
      </>
    );
  };

  if (view?.belongChannel !== '0') {
    if (view?.isBelongApply || view?.isBelongProduct) {
      return <DistributionButton />;
    }
    if (!view?.isBelongApply) {
      return (
        <Alert
          message={
            <span style={{ width: '100%', color: '#1890FF' }}>
              请联系渠道商申请开通该商品的分销权限
            </span>
          }
          type="info"
        />
      );
    }
    return <></>;
  }
  if (view?.belongChannel === '0') {
    if (!view?.isSelfApply) {
      return (
        <>
          {(reviewStatus?.auditStatus === 2 || reviewStatus?.auditStatus === 3) && (
            <Button onClick={() => setOpenDistributor(true)} type="primary">
              {reviewStatus?.auditStatus === 2 ? '重新成为经销商' : '申请合作'}
            </Button>
          )}
          {reviewStatus?.auditStatus === 2 && (
            <Alert
              style={{ marginTop: '12px' }}
              message={
                <span style={{ width: '100%', color: '#F33E3E' }}>
                  审核未通过原因：{reviewStatus?.refuseReason}
                </span>
              }
              type="error"
            ></Alert>
          )}
          {reviewStatus?.auditStatus === 0 && (
            <Button type="primary" disabled>
              分销商申请审核中，请耐心等待！
            </Button>
          )}
        </>
      );
    }
    return <DistributionButton />;
  }
  return <></>;
};

export const ModalFoot = ({
  handleDetermine,
  handleCancel,
}: {
  handleDetermine: () => void;
  handleCancel: () => void;
}) => {
  return (
    <>
      <Button
        onClick={() => {
          handleDetermine();
        }}
        type="primary"
      >
        确认
      </Button>
      <Button
        onClick={() => {
          handleCancel();
        }}
      >
        不，再看看
      </Button>
    </>
  );
};

export const handleNumber = (min: any, max: any, cash: any) => {
  if (min === '' && max === '') {
    if (cash) {
      return '￥***';
    }
    return '**%';
  }
  if (Number(min) === Number(max)) {
    if (cash) {
      return `￥${Number(min).toFixed(2)}`;
    }
    return `${(Number(min) * 100).toFixed(2)}%`;
  }
  if (Number(min) !== Number(max)) {
    if (cash) {
      return `￥${Number(min).toFixed(2)} ~ ￥${Number(max).toFixed(2)}`;
    }
    return `${(Number(min) * 100).toFixed(2)}% ~ ${(Number(max) * 100).toFixed(2)}%`;
  }
  return '';
};
