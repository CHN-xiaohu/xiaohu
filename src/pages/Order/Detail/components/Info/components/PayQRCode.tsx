import QRCode from 'qrcode.react';

import styles from '../index.less';

const PayQRCode = ({ payUrl }: any) => {
  return (
    <div className={styles.qrCode}>
      <span>扫描下方二维码支付</span>
      <div className={styles.frame}>
        <div className={styles.frameBox}>
          <QRCode value={payUrl} style={{ width: '150px', height: '150px', padding: '4px' }} />
        </div>
      </div>
    </div>
  );
};

export default PayQRCode;
