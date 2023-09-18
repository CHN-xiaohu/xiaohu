export const auditStatusMap = {
  [-1]: '待审核',
  0: '审核中',
  1: '审核通过',
  2: '审核未通过',
};

export const auditStatusColorMap = {
  [-1]: '#f5222d',
  0: '#1890ff',
  1: '#52c41a',
  2: '#f5222d',
};

// 日志操作类型
export const productLogOptTypeMap = {
  0: '新增',
  1: '上架',
  2: '下架',
  3: '修改',
  4: '删除',
};

// 日志是否有快照
export const productLogHasSnapshotMap = {
  0: '没有',
  1: '有',
};
