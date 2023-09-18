import 'dayjs/locale/es';

import routes from './en-US/routes';
import table from './zh-CN/table';

export default {
  ...routes,
  ...table,

  'account.center': 'account center',
  'account.settings': 'settings',
  'account.logout': 'logout',

  cancel: 'cancel',
  ok: 'ok',
};
