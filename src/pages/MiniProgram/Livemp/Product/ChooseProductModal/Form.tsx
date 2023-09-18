/* eslint-disable prettier/prettier */
import { createLinkageUtils, useModalForm } from '@/components/Business/Formily';
import { createAsyncFormActions } from '@formily/antd';
import { useCallback } from 'react';

import { InputNumberRange } from '@/components/Library/InputNumber/Range';

import { addLiveProduct, updateLiveProduct } from '../../api';

import type { AddLiveProductParams, LiveProductColumns } from '../../api';
import {
  priceTypeInvertMap,
  priceTypeSelectOptions,
  productAuditStatusInvertMap,
} from '../../constants';

const formActions = createAsyncFormActions();

const labelCol = 5;

const description = (
  <span>
    <p>建议尺寸：300像素 * 300像素，图片大小不得超过 1M</p>
  </span>
);

export const inputNumberProps = () => ({
  addonAfter: '元',
  min: 0,
  precision: 2,
  step: 0.01,
  placeholder: '请输入价格',
  style: {
    width: 100,
  },
});

export function useLiveGoodModalForm(onSuccess: VoidFunction) {
  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    isNativeAntdStyle: true,
    onSubmit: (value: any) => {
      console.log(JSON.parse(JSON.stringify(value)), 'value');
      if (value.priceRange?.length === 2 && value.priceType === priceTypeInvertMap.价格区间) {
        [value.price, value.price2] = value.priceRange;
      }

      delete value.priceRange;

      const method = value?.productInfoId ? addLiveProduct : updateLiveProduct;

      return method(value as any).then(onSuccess);
    },
    effects: ($) => {
      const linkage = createLinkageUtils();

      $('onFieldValueChange', 'priceType').subscribe((state) => {
        let priceTitle = '价格';
        let priceVisible = true;

        let price2Title = '';
        let price2Visible = true;

        let priceRangeVisible = false;

        if (state.value === priceTypeInvertMap.一口价) {
          price2Visible = false;
        }

        if (state.value === priceTypeInvertMap.价格区间) {
          priceRangeVisible = true;
          priceVisible = false;
          price2Visible = false;
        }

        if (state.value === priceTypeInvertMap.显示折扣价) {
          price2Title = '现价';
          priceTitle = '市场价';
        }

        linkage.visible('priceRange', priceRangeVisible);

        linkage.prop('price', 'title', priceTitle);
        linkage.visible('price', priceVisible);
        linkage.errors('price', '');

        linkage.visible('price2', price2Visible);
        linkage.prop('price2', 'title', price2Title);
        linkage.errors('price2', '');
      });

      $('onFieldValueChange', '*(price,price2)').subscribe(async () => {
        const priceType = await linkage.getFieldValue('priceType');
        if (priceType !== priceTypeInvertMap.显示折扣价) {
          return;
        }

        const price = await linkage.getFieldValue('price');
        const price2 = await linkage.getFieldValue('price2');

        let errorMessage = '';
        // 当前选择了 [显示折扣价]，那么需要 price2 < price
        if (price2 > price) {
          errorMessage = '现价不能高于市场价';
        }

        linkage.errors('price', errorMessage);
        linkage.errors('price2', errorMessage);
      });
    },
    labelCol,
    components: {
      InputNumberRange,
    },
    schema: {
      name: {
        title: '商品名称',
        type: 'string',
        'x-component': 'input',
        'x-component-props': {
          showLengthCount: true,
          maxLength: 14,
        },
        'x-rules': [
          {
            required: true,
            message: '请输入商品名称',
          },
        ],
      },
      coverImgUrl: {
        type: 'uploadFile',
        title: '商品封面图',
        'x-rules': {
          required: true,
          message: description,
        },
        description,
        'x-component-props': {
          maxSize: 1,
          rule: {
            maxImageWidth: 300,
            maxImageHeight: 300,
          },
        },
      },
      priceType: {
        type: 'radio',
        title: '价格形式',
        enum: priceTypeSelectOptions,
      },
      priceRange: {
        type: 'number',
        'x-component': 'InputNumberRange',
        title: '价格区间',
        visible: false,
        'x-component-props': inputNumberProps(),
        'x-rules': {
          required: true,
          message: '请输入价格区间',
        },
      },
      price: {
        type: 'inputNumber',
        title: '价格',
        'x-component-props': inputNumberProps(),
        'x-rules': {
          required: true,
          message: '请输入价格',
        },
      },
      price2: {
        type: 'inputNumber',
        title: '市场价',
        visible: false,
        'x-component-props': inputNumberProps(),
        'x-rules': {
          required: true,
          message: '请输入价格',
        },
      },
      url: {
        type: 'string',
        editable: false,
        title: '商品路径',
      },
    },
  });

  const openLiveProductForm = useCallback(
    (values: Partial<AddLiveProductParams & LiveProductColumns & { priceRange: number[] }>) => {
      const title = !values?.auditStatus
        ? '创建直播商品'
        : values.auditStatus === productAuditStatusInvertMap.审核通过
        ? '修改价格'
        : '编辑商品';

      openModalForm({
        title,
        initialValues: {
          ...values,
        },
      }).then(() => {
        if (title === '修改价格') {
          ['name', 'coverImgUrl', 'url'].forEach((path) => {
            formActions.setFieldState(path, (fieldState) => {
              fieldState.visible = false;
            });
          });
        }
      });
    },
    [openModalForm],
  );

  return {
    openLiveProductForm,
    ModalFormElement,
  };
}
