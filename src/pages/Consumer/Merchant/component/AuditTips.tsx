import '../index.less';

export const AuditTips = () => {
  return (
    <div className="audit-deploy">
      <span className="mark-color">注</span>: 审核关闭，系统自动通过审核，即注册即可登录使用
      <br />
      审核开启，需人工进行审核，审核通过后才可登录使用
    </div>
  );
};
