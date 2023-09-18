import { useModalForm } from '@/components/Business/Formily';
import { createAsyncFormActions } from '@formily/antd';
import { useMount } from 'ahooks';
import { useCallback, useRef } from 'react';

import type { DistributorColumns } from '../../../api';
import { updateDistributor, getAllDistributor } from '../../../api';

const formActions = createAsyncFormActions();

type CLabeledValue = LabeledValue<string | undefined, string>;

export function useEditUserInfoForm(onSuccess: (inviter: CLabeledValue) => void) {
  const allDistributorRef = useRef([{ label: '平台', value: '-1' }] as CLabeledValue[]);

  useMount(() => {
    getAllDistributor().then((res) => {
      allDistributorRef.current = allDistributorRef.current.concat(
        res.data.map((item) => ({
          // ...item,
          label: item.name,
          value: item.id,
        })),
      );
    });
  });

  const { openModalForm, ModalFormElement } = useModalForm({
    title: '编辑分销员',
    actions: formActions,
    isNativeAntdStyle: true,
    onSubmit: (value: DistributorColumns) =>
      updateDistributor({
        ...value,
        invitationDistributorId:
          value.invitationDistributorId === '-1' ? undefined : value.invitationDistributorId,
      }).then(() =>
        onSuccess(
          // 现在数据量不大，先用这种方式，后面可以用 labelInValue prop 进行优化
          allDistributorRef.current.find((item) => item.value === value.invitationDistributorId)!,
        ),
      ),
    schema: {
      id: {
        type: 'string',
        display: false,
      },
      registerPhone: {
        type: 'string',
        title: '注册手机号',
        editable: false,
      },
      invitationDistributorId: {
        type: 'string',
        title: '邀请者',
        enum: [],
        required: true,
        'x-component-props': {
          placeholder: '请选择上级分销员',
        },
      },
    },
  });

  const openEditUserInfoForm = useCallback((values: DistributorColumns) => {
    openModalForm({
      initialValues: {
        ...values,
      },
    }).then(() => {
      formActions.setFieldState('invitationDistributorId', (state) => {
        // 过滤当前用户自己
        state.props.enum = allDistributorRef.current.filter((item) => item.value !== values.id);
      });
    });
  }, []);

  return {
    openEditUserInfoForm,
    ModalFormElement,
  };
}
