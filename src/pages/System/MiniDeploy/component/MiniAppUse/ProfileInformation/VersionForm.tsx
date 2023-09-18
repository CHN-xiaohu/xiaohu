import { SchemaForm } from '@/components/Business/Formily';

import { SafelySetInnerHTML } from '../../SafelySetInnerHTML';

export const auditStatus = {
  '0': '审核通过',
  '1': '审核拒绝',
  '2': '审核中',
  '3': '已撤回',
  '4': '审核延后',
  '5': '未提交',
  '6': '已发布',
  '7': '发布失败',
  '8': '没有提交记录',
  '9': '提交审核处理中',
};

export const VersionForm = ({ auditRecord }: { auditRecord: any }) => {
  const releaseStatus = auditRecord?.releaseStatus;
  const VersionReson = () => <SafelySetInnerHTML html={auditRecord?.reson} />;

  return (
    <SchemaForm
      {...{
        editable: false,
        value: {
          ...auditRecord,
          releaseStatus: auditStatus[releaseStatus],
        },
        components: { VersionReson },
        schema: {
          versionInformationLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '版本信息',
              type: 'inner',
            },
            properties: {
              userVersion: {
                type: 'string',
                title: '版本号',
              },
              userDesc: {
                type: 'string',
                title: '版本名称',
              },
              releaseStatus: {
                type: 'string',
                title: '版本状态',
              },
              submitTime: {
                type: 'string',
                title: '提交时间',
                'x-rules': {
                  required: true,
                },
              },
              reson: {
                type: 'string',
                'x-component': 'VersionReson',
                visible: releaseStatus === '1',
                title: '拒绝原因',
              },
            },
          },
        },
      }}
    />
  );
};
