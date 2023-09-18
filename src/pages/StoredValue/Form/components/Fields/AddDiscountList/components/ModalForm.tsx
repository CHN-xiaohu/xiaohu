import type { TSchemas } from '@/components/Business/Formily';
import { useModalForm } from '@/components/Business/Formily';

import { ButtonList } from '@/components/Library/ButtonList';

import type { CouponColumns } from '@/pages/Coupon/Api';
import { getCouponValidList } from '@/pages/Coupon/Api';

import { useState, useCallback, useMemo } from 'react';
import { createAsyncFormActions } from '@formily/antd';

import { useMount } from 'ahooks';

import { CouponList } from './CouponList';

import styles from '../index.less';

const formActions = createAsyncFormActions();

const fields = {
  couponList: CouponList,
};

const getSelectdCouponList = (couponList: { id: string; num: number }[]) =>
  couponList.reduce((previous, current) => {
    // 同一个优惠券，选了多次，自动叠加数量, 送的储值卡金额也一样
    const [couponName, couponId] = current.id.split('_');

    if (previous[couponId]) {
      previous[couponId].num += current.num;
    } else {
      previous[couponId] = { couponId, couponName, num: current.num };
    }

    return previous;
  }, {} as Record<string, { couponId: string; num: number; couponName: string }>);

export const ModalForm = ({ addSuccess }: { addSuccess: (values: any) => void }) => {
  const [couponListDataSource, setCouponListDataSource] = useState<CouponColumns[]>([]);

  useMount(() => {
    getCouponValidList({ size: 500, publishType: 1 }).then((res) => {
      setCouponListDataSource(res.data.records);
    });
  });

  const handleSubmit = useCallback(
    (values: any) => {
      const { type } = values;

      const emitData = {
        type,
      } as { [k in string]: any };

      // eslint-disable-next-line default-case
      switch (type) {
        case 'money':
          emitData.amount = values.amount;
          break;
        case 'coupon':
          // eslint-disable-next-line no-case-declarations
          const selectdCouponList = getSelectdCouponList(values.couponList);
          emitData.couponLists = Object.keys(getSelectdCouponList(values.couponList)).map(
            (k) => selectdCouponList[k],
          );
          break;
      }

      addSuccess(emitData);

      return Promise.resolve();
    },
    [addSuccess],
  );

  const { openModalForm, ModalFormElement } = useModalForm({
    title: '添加赠送',
    modalProps: {
      className: styles.modalFormWrapper,
    },
    isNativeAntdStyle: true,
    actions: formActions,
    fields,
    onSubmit: handleSubmit,
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  });

  const schema = useMemo(
    () =>
      ({
        type: {
          title: '优惠类型',
          type: 'string',
          default: 'money',
          enum: [
            { label: '送储值卡金额', value: 'money' },
            { label: '送优惠券', value: 'coupon' },
          ],
          required: true,
          'x-component-props': {
            className: styles.modalFormType,
          },
          'x-linkages': [
            {
              type: 'value:display',
              condition: '{{ $self.value !== "coupon" }}',
              target: 'amount',
            },
            {
              type: 'value:display',
              condition: '{{ $self.value === "coupon" }}',
              target: 'couponList',
            },
          ],
        },
        amount: {
          title: '赠送金额',
          type: 'number',
          'x-rules': {
            required: true,
            message: '请输入赠送金额',
          },
          'x-component-props': {
            placeholder: '请输入赠送金额',
            min: 1,
            max: 999999,
            precision: 0,
            step: 1,
            style: { width: '38%' },
          },
        },
        couponList: {
          type: 'couponList' as any,
          display: false,
          default: [{ id: undefined, num: undefined }],
          'x-props': {
            itemClassName: 'full-width__form-item-control coupon-list-field__form-item-control',
          },
          items: {
            type: 'object',
            properties: {
              id: {
                title: '优惠券ID',
                type: 'string',
                enum: couponListDataSource.map((item) => ({
                  label: item.name,
                  value: `${item.name}_${item.id}`,
                })),
                'x-rules': { required: true, message: '请选择优惠券' },
                'x-component-props': {
                  placeholder: '请选择优惠券',
                },
              },
              num: {
                title: '赠送数量',
                type: 'number',
                'x-rules': { required: true, message: '请输入赠送数量' },
                'x-component-props': {
                  placeholder: '请输入赠送数量',
                  min: 1,
                  max: 999999,
                  precision: 0,
                  style: { width: '100%' },
                },
              },
            },
          },
        },
      } as TSchemas),
    [couponListDataSource],
  );

  const handleClick = useCallback(() => {
    openModalForm({ schema });
  }, [openModalForm, schema]);

  return (
    <>
      <ButtonList
        list={[{ text: '添加赠送', type: 'primary', size: 'small', onClick: handleClick }]}
      />

      {ModalFormElement}
    </>
  );
};
