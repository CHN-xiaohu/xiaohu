import { useModalForm } from '@/components/Business/Formily';

import { useRef } from 'react';

import { ChargeVipRecord } from '../Api';

type Props = {
  handleCreateAdSuccess: () => void;
  vipExpireTime: string;
  isVip: boolean;
  storeId: string;
};

export const useCreateMemberForm = ({
  handleCreateAdSuccess,
  vipExpireTime,
  isVip,
  storeId,
}: Props) => {
  const storeIdRef = useRef(storeId);
  const vipTimeRef = useRef(vipExpireTime);
  const yearChoose = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((item: any) => ({
    value: item,
    label: item,
  }));

  storeIdRef.current = storeId;
  const handleUpdate = (values: any) => {
    values.endTime = undefined;
    return ChargeVipRecord({ chargeWay: '1', storeId: storeIdRef.current, ...values }).then(
      (res) => {
        const { data } = res;
        vipTimeRef.current = data.vipExpireTime;
        handleCreateAdSuccess();
      },
    );
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleUpdate,
    effects: ($, { setFieldState }) => {
      $('onFieldChange', 'vipRenewYears').subscribe((state) => {
        setFieldState('endTime', (filedState) => {
          const addValue = state.value ? state.value : 0;
          const now = new Date();
          const times = vipTimeRef.current;
          const dates = times.split('-');
          const isYear =
            times !== '' && times[0] !== ''
              ? `${Number(dates[0]) + Number(addValue)}-${dates[1]}-${dates[2]}`
              : `${now.getFullYear() + Number(addValue)}-${now.getMonth() + 1}-${now.getDate()}`;
          filedState.value = isYear;
        });
      });
    },
    schema: {
      vipRenewYears: {
        title: '开通年限',
        type: 'string',
        'x-component-props': {
          placeholder: '请选择开通年限',
        },
        enum: yearChoose,
        'x-rules': {
          required: true,
          message: '开通年限不能为空',
        },
      },
      endTime: {
        title: '到期时间',
        type: 'string',
        'x-component-props': {
          disabled: true,
        },
      },
      remark: {
        title: '备注',
        type: 'textarea',
        'x-component-props': {
          placeholder: '请输入备注, 上限30个字',
        },
        'x-rules': [
          {
            required: true,
            message: '请输入备注, 上限30个字',
          },
          {
            range: [1, 30],
            message: '请输入备注, 上限30个字',
          },
        ],
      },
    },
  });

  const handleOpenForm = () => {
    openModalForm({
      title: isVip ? '创建会员' : '延期会员',
    });
  };
  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
