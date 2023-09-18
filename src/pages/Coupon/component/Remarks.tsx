import { Input } from 'antd';

import Styles from '../style.less';

const { TextArea } = Input;

const Remarks = ({ timeRemark, ruleRemark, usedRemark }: any) => (
  <div className={Styles.remark}>
    <div className={Styles.title}>参与活动商品：</div>
    <TextArea value={`${timeRemark}\n${usedRemark}${ruleRemark}`} className={Styles.textWidth} />
  </div>
);

export default Remarks;
