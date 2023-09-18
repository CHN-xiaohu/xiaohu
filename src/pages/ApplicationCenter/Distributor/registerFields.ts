import { connect } from '@formily/antd';

import { DetailEditor } from '@/pages/Product/Manager/Form/components/FormFields/DetailEditor';

export const registerFields = () => ({
  detailEditor: connect()(DetailEditor),
});
