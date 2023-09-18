import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { setVipPay } from '../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const useGoldMerchantForm = ({ onAddSuccess }: Props) => {
  const handleCreateGoldMerchant = (values: any) => {
    values.storePay = values.storePay ? 'YES' : 'NO';
    return setVipPay({
      ...values,
    }).then(() => {
      onAddSuccess();
    });
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateGoldMerchant,
    actions: formActions,
    isNativeAntdStyle: true,
    schema: {
      vipName: {
        title: '付费名称',
        type: 'string',
        'x-component-props': {
          placeholder: '金牌会员充值',
        },
        'x-rules': [
          {
            required: true,
            message: '名称不能为空',
          },
        ],
      },
      storePay: {
        title: '付费商家',
        type: 'boolean',
        default: true,
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      currentPrice: {
        type: 'inputNumber',
        title: '价格',
        'x-component-props': {
          placeholder: '请输入价格',
          min: 0.01,
          max: 999999,
          precision: 2,
          step: 1,
          className: 'product-price__input-number--wrapper',
          addonAfter: '元',
        },
        'x-rules': [
          {
            required: true,
            message: '价格不能为空',
          },
        ],
      },
      originalPrice: {
        type: 'inputNumber',
        title: '原价',
        'x-component-props': {
          placeholder: '请输入原价',
          min: 0.01,
          max: 999999,
          precision: 2,
          step: 1,
          className: 'product-price__input-number--wrapper',
          addonAfter: '元',
        },
        'x-rules': [
          {
            required: true,
            message: '原价不能为空',
          },
        ],
      },
    },
  });

  const handleGoldMerchant = (initialValues: any = {}) => {
    setTimeout(() => {
      formActions.setFieldValue('vipName', initialValues.vipName || '金牌会员充值');
      formActions.setFieldValue('storePay', initialValues.storePay === 'YES');
      formActions.setFieldValue('currentPrice', initialValues.currentPrice || 1868);
      formActions.setFieldValue('originalPrice', initialValues.originalPrice || 8680);
    });

    // if (vipDetail && vipDetail.storePay === 'YES') {
    //   vipDetail.storePay = true;
    // }
    // if (vipDetail && vipDetail.storePay === 'NO') {
    //   vipDetail.storePay = false;
    // }

    openModalForm({
      initialValues,
      title: '金牌商家付费设置',
    });
  };

  return {
    openForm: handleGoldMerchant,
    ModalFormElement,
  };
};
