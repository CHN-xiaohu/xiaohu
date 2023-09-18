import { useState } from 'react';
import { useMount } from 'ahooks';
import { NormalForm } from '@/components/Business/Formily';

import type { RouteChildrenProps } from '@/typings/basis';

import { useFields } from '../../../Form/components/Fields';

import type { IStoredValueColumn } from '../../../Api';
import { showStoredValue } from '../../../Api';
import { activeStatusMap } from '../../../Constant';

export const EventDetails = ({ match }: RouteChildrenProps) => {
  const [initialValues, setInitialValues] = useState<IStoredValueColumn>();

  const fields = useFields();

  useMount(() => {
    showStoredValue(match.params.id).then((res) => {
      const { data } = res;

      (data as any).expirationDate = [data.startTime, data.endTime];
      data.activeStatus = activeStatusMap[data.activeStatus];

      setInitialValues(data);
    });
  });

  return (
    <NormalForm
      {...{
        labelCol: { span: 2 },
        wrapperCol: { span: 15 },
        fields,
        editable: false,
        initialValues,
        previewPlaceholder: '暂无',
        schema: {
          basicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              type: 'inner',
              title: '基本信息',
            },
            properties: {
              activeStatus: {
                title: '生效状态',
                type: 'string',
              },
              name: {
                title: '活动名称',
                type: 'string',
              },
            },
          },

          discountLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              type: 'inner',
              title: '活动优惠',
            },
            properties: {
              expirationDate: {
                title: '生效时间',
                type: 'convenientDateRange',
              },
              content: {
                title: '优惠规则',
                type: 'textarea',
              },
              lists: {
                type: 'discountList',
              },
            },
          },
        },
      }}
    />
  );
};
