const data = {
  article: 'article',
  'article.manage': 'article list',
  'article.category': 'article category',
  'article.form': 'create article',
  'article.form_edit': 'edit article',

  setting: 'setting',
  'setting.basis': 'setting basis',
  'setting.store': 'setting store',
  'setting.storage': 'setting storage',
  'setting.pay': 'setting pay',
  'setting.trade': 'setting trade',
  'setting.sms': 'setting sms',
  'setting.email': 'setting email',

  product: 'product',
  order: 'order',
  user: 'user',
  marketing: 'marketing',
  finance: 'finance',
  wechat: 'wechat',
  data_bi: 'data_bi',
  auth: 'auth',
  app: 'app',
};

export default Object.keys(data).reduce((previous, current) => {
  previous[`menu.${current}`] = data[current];

  return previous;
}, {});
