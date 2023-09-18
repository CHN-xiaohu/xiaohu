import { useRef, useEffect } from 'react';
import * as React from 'react';
import { ButtonList } from '@/components/Library/ButtonList';
import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import styles from './index.less';

import { useFields } from '../Fields';

type Props = {
  lists: { overAmount: number }[];
  addDiscountSuccess: (values: any) => void;
};

const formActions = createAsyncFormActions();

export const Main: React.FC<Props> = ({ lists = [], addDiscountSuccess }) => {
  const listsRef = useRef<any[]>(lists);

  const fields = useFields();

  useEffect(() => {
    listsRef.current = lists;
  }, [lists]);

  const handleSubmit = React.useCallback(
    (values: any) => {
      addDiscountSuccess(values);

      return Promise.resolve();
    },
    [addDiscountSuccess],
  );

  const { ModalFormElement, openModalForm } = useModalForm({
    title: '添加优惠',
    modalProps: {
      className: styles.wrapper,
      bodyStyle: {
        maxHeight: '62vh',
        overflowY: 'auto',
      },
    },
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
    actions: formActions,
    fields,
    onSubmit: handleSubmit,
    isNativeAntdStyle: true,
    schema: {
      overAmount: {
        title: '充值储值卡',
        type: 'inputNumber',
        'x-component-props': {
          // min: 0.01,
          min: 1,
          max: 999999,
          // precision: 2,
          precision: 0,
          step: 1,
          addonBefore: '≥',
          placeholder: '请输入充值金额',
        },
        'x-rules': [
          {
            required: true,
            message: '请输入充值金额',
          },
          {
            validator: (value: number) =>
              listsRef.current.map((item) => item.overAmount).some((amount) => amount === value)
                ? '储值金额已存在，请重新输入'
                : '',
          },
        ],
      },
      discountList: {
        type: 'addDiscountList',
        'x-props': {
          itemClassName: 'full-width__form-item-control',
        },
        'x-rules': {
          required: true,
          message: '至少添加一个赠送数据',
        },
      },
    },
  });

  return (
    <>
      <ButtonList
        size="small"
        list={[
          {
            text: '添加优惠',
            type: 'primary',
            onClick: () => openModalForm(),
          },
        ]}
      />

      {ModalFormElement}
    </>
  );
};

export const AddDiscountModal = React.memo(Main);
