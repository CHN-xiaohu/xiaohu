import styles from '../../index.less';

export const SupplyCancelTips = () => {
  return (
    <div className={styles.supplyCancelTips}>
      <span className={styles.tipsSize}>确认取消订单？</span>
      <div>
        <span className={styles.mark}>注：</span>
        取消该订单，关联的订单也会被取消，请谨慎操作
      </div>
    </div>
  );
};
