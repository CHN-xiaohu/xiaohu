import 'dayjs/locale/zh-cn';
import routes from './zh-CN/routes';
import table from './zh-CN/table';

export default {
  ...routes,

  ...table,

  'app.login.tenantCode': '租户号',

  'account.password': '修改密码',
  'account.settings': '个人设置',
  'account.logout': '退出登录',

  'product.table.alert.shelves': '批量上架',
  'product.table.alert.takeOff': '批量下架',
  'product.table.alert.modifyInventoryInBulk': '批量修改库存',
  'product.table.alert.batchModifyInventoryWarning': '批量修改库存预警',
  'distributionProduct.table.alert.delete': '删除所选无效商品',

  cancel: '取消',
  ok: '确定',
};
