import { generateCategoriesParentTree } from '@/pages/Programa/Utils';

import type { SchemaFormProps } from '@/components/Business/Formily';
import { SchemaForm, createLinkageUtils } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { connect as UFormConnect, createAsyncFormActions } from '@formily/antd';

import { useState, useEffect, useRef } from 'react';
import { Card, Button, message, Spin } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDispatch } from 'dva';
import dayjs from 'dayjs';

import { history } from 'umi';

import { MoneyOff } from './component/MoneyOff';
import { CouponTime } from './component/CouponTime';
import ProductModal from './component/productModal';
import ProductTable from './component/productTable';
import type { DetailColumns } from './Api';
import { editCoupon, couponDetail, saveMiniCoupon } from './Api';
import {
  getDiscountText,
  getCouponvalidType,
  getUsed,
  stringFilterOption,
  handleIsMiniCoupon,
} from './Util';
import { useStoresToSelectOptions } from './useStoresToSelectOptions';

import Styles from './style.less';

const formActions = createAsyncFormActions();

const useFields = {
  minusMoney: UFormConnect()(MoneyOff),
  getCouponTime: UFormConnect()(CouponTime),
};

const CouponEditPage = ({
  match: {
    params: { id },
  },
}: any) => {
  const dispatch = useDispatch();

  const [openProductModal, setOpenProductModal] = useState(false);
  const [showLoading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [detail, setDetail] = useState({} as DetailColumns);
  const minusType = useRef([] as any);
  const setCouponTime = useRef([] as any);
  const startTime = useRef([] as any);
  const { storeSelectOptions } = useStoresToSelectOptions();

  const {
    tempRowProducts,
    selectedProductRowKeys,
    couponUsed,
    detailTotal,
    detailCurrent,
    categoryName,
    productOneCategories,
    selectRowProducts,
    originCategoryList,
    storeId,
  } = useStoreState('coupon');

  const initRequest = () => {
    setLoading(true);
    couponDetail(id).then((res) => {
      const { data } = res;
      if (data.used === 30 && !!data.categoryId) {
        const filterResult = generateCategoriesParentTree(originCategoryList, data.categoryId);
        if (filterResult === '' || filterResult === undefined) {
          data.categoryId = '';
        }
      } else {
        data.categoryId = undefined;
      }
      setDetail(data);
      formActions.setFormState((state: any) => {
        state.values = data;
      });
      dispatch({
        type: 'coupon/updateState',
        payload: {
          storeId: data?.storeId,
          couponId: id,
          selectedProductRowKeys: data?.productInfoIds,
        },
      });
      if (data.used === 20) {
        dispatch({
          type: 'coupon/getCouponProducts',
          payload: {
            size: 100,
            current: 1,
            couponId: id,
            storeId: data?.storeId,
          },
        });
      }
      setTimeout(() => {
        setLoading(false);
      }, 0);
    });
  };

  useEffect(() => {
    if (id) {
      initRequest();
    }
  }, [id]);

  if (id) {
    formActions.setFieldValue('dataTime', [detail.takeStartTime, detail.takeEndTime]);
    const minus: any = { withAmount: detail.withAmount };
    if (detail.type === 1) {
      minus.usedAmount = detail.usedAmount;
    } else if (detail.type === 2) {
      minus.usedDiscount = detail.usedDiscount * 10;
    }
    formActions.setFieldValue('minus', minus);

    if (detail.validType === 1) {
      formActions.setFieldValue('times.validStartTime', detail.validStartTime);
      formActions.setFieldValue('times.validEndTime', detail.validEndTime);
      // formActions.setFieldValue('times.validStartTime', {
      //   validStartTime: detail.validStartTime,
      //   validEndTime: detail.validEndTime,
      // });
    } else {
      formActions.setFieldValue('validDays', detail.validDays);
    }
  } else {
    formActions.setFieldValue('used', couponUsed);
  }

  const handleGetCategoryName = (cateId: any) => {
    dispatch({
      type: 'coupon/getPerCategoryName',
      payload: {
        id: cateId,
      },
    });
  };

  const disabledDates = (current: any) =>
    current < dayjs(dayjs(new Date(setCouponTime.current[0]).getTime()).format('YYYY/MM/DD'));

  const endDisabledDates = (current: any) => {
    const endTime =
      startTime.current > setCouponTime.current[1] ? startTime.current : setCouponTime.current[1];
    return current < dayjs(dayjs(new Date(endTime).getTime()).format('YYYY/MM/DD'));
  };

  const range = (start: any, end: any) => {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  };

  // eslint-disable-next-line consistent-return
  const disabledDateTime = () => {
    if (setCouponTime && setCouponTime.current && setCouponTime.current[0]) {
      const timearr =
        setCouponTime &&
        setCouponTime.current &&
        setCouponTime.current[0].replace(' ', ':').replace(/:/g, '-').split('-');
      const timeHour = handleIsMiniCoupon() ? '00' : timearr[3];
      const timedMinutes = handleIsMiniCoupon() ? '00' : timearr[4];
      const timeSeconds = handleIsMiniCoupon() ? '00' : timearr[5];
      return {
        disabledHours: () => range(0, 24).splice(0, timeHour),
        disabledMinutes: () => range(0, timedMinutes),
        disabledSeconds: () => range(0, timeSeconds),
      };
    }
  };

  // eslint-disable-next-line consistent-return
  const endDisabledDateTime = () => {
    if (setCouponTime && setCouponTime.current && setCouponTime.current[1]) {
      const timearr =
        setCouponTime &&
        setCouponTime.current &&
        setCouponTime.current[1].replace(' ', ':').replace(/:/g, '-').split('-');
      const timeHour = handleIsMiniCoupon() ? '23' : timearr[3];
      const timedMinutes = handleIsMiniCoupon() ? '59' : timearr[4];
      const timeSeconds = handleIsMiniCoupon() ? '59' : timearr[5];
      return {
        disabledHours: () => range(0, 24).splice(0, timeHour),
        disabledMinutes: () => range(0, timedMinutes),
        disabledSeconds: () => range(0, timeSeconds),
      };
    }
  };

  const handleIsMiniProgram = () => {
    return window.location.pathname.split('/').includes('miniProgram');
  };

  const handleGetProductId = (storeIdValue: string) => {
    dispatch({
      type: 'coupon/updateState',
      payload: {
        storeId: storeIdValue,
        // selectedProductRowKeys: [],
      },
    });
  };

  const schema: SchemaFormProps['schema'] = {
    name: {
      type: 'string',
      title: '优惠券名称',
      required: true,
      'x-component-props': {
        placeholder: '请输入优惠券名称',
        style: {
          width: 350,
        },
      },
      'x-rules': [
        {
          required: true,
          message: '优惠券名称不能为空',
        },
        {
          pattern: /^[^\s]{1,30}$/,
          message: '优惠券名称不能为空字符且不能超过30个字',
        },
      ],
    },
    type: {
      type: 'radio',
      title: '优惠类型',
      default: 1,
      enum: [
        { label: '满减券', value: 1 },
        { label: '折扣券', value: 2 },
      ],
      'x-rules': [
        {
          required: true,
          message: '优惠类型不能为空',
        },
      ],
      'x-props': {
        className: 'ant-form-item__margin-bottom',
        disabled: detail.showStatus === 1,
      },
    },
    twoGrid: {
      'x-component': 'grid',
      'x-component-props': {
        style: {
          position: 'relative',
          left: '14.4%',
        },
      },
      properties: {
        minus: {
          type: 'object',
          'x-component': 'minusMoney',
          'x-component-props': {
            path: 'twoGrid.minus',
          },
          properties: {
            withAmount: {
              type: 'inputNumber',
              title: '',
              description: '订单满0元，即为无门槛',
              'x-component-props': {
                addonBefore: '订单满',
                addonAfter: '元',
                disabled: detail.showStatus === 1,
                min: 0,
                max: handleIsMiniProgram() ? 99999 : 999999,
                step: 1,
                precision: 1,
                className: 'ant-form-explain__font-size',
              },
              'x-rules': [
                {
                  required: true,
                  message: '请输入订单金额',
                },
              ],
            },
            usedAmount: {
              type: 'inputNumber',
              title: '',
              'x-component-props': {
                addonBefore: '减',
                addonAfter: '元',
                disabled: detail.showStatus === 1,
                min: 0,
                max: handleIsMiniProgram() ? 9999 : 999999,
                step: 1,
                precision: 2,
              },
              'x-rules': [
                {
                  required: true,
                  message: '请输入满减金额',
                },
              ],
            },
            usedDiscount: {
              type: 'inputNumber',
              title: '',
              'x-component-props': {
                addonBefore: '打',
                addonAfter: '折',
                disabled: detail.showStatus === 1,
                min: 0.1,
                max: 9.9,
                step: 0.1,
                precision: 1,
              },
            },
          },
        },
      },
    },

    quota: {
      type: 'inputNumber',
      title: '发放总数',
      description: '修改优惠券总量时只能增加，不能减少，请谨慎设置',
      'x-component-props': {
        addonAfter: '张',
        placeholder: '请输入发放优惠券张数',
        min: detail.quota ? detail.quota : 1,
        max: handleIsMiniProgram() ? 99999 : 999999,
        step: 1,
        className: 'product-price__input-number--wrapper',
        style: {
          width: 250,
        },
      },
      'x-props': {
        itemStyle: {
          marginBottom: '10px',
        },
      },
      'x-rules': [
        {
          required: true,
          message: '优惠券发放张数不能为空！',
        },
      ],
    },
    takeLimit: {
      type: 'inputNumber',
      title: '每人限领次数',
      description: handleIsMiniProgram()
        ? '手动发券，限领次数，用户主动领取时生效'
        : '手动发券，限领次数失效',
      required: true,
      default: 1,
      'x-props': {
        itemStyle: {
          marginBottom: '10px',
        },
      },
      'x-component-props': {
        placeholder: '请输入发放限领次数',
        min: 1,
        max: 100,
        step: 1,
        className: 'product-price__input-number--wrapper',
        addonAfter: '次',
        style: {
          width: 250,
        },
      },
      'x-rules': [
        {
          required: true,
          message: '限领次数不能为空！',
        },
      ],
    },
    dataTime: {
      type: 'daterange',
      title: '领券时间',
      description: <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>活动预热，可提前发券</span>,
      'x-props': {
        format: handleIsMiniProgram() ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
        showTime: !handleIsMiniProgram(),
        itemStyle: {
          marginBottom: '10px',
        },
      },
      'x-component-props': {
        placeholder: '请选择领券时间',
        disabled: detail.showStatus === 1,
        style: {
          width: 350,
        },
        className: 'ant-form-explain__font-size',
      },
      'x-rules': [
        {
          required: true,
          message: '领券时间不能为空',
        },
      ],
    },
    validType: {
      type: 'radio',
      title: '用券时间',
      default: 1,
      visible: !handleIsMiniProgram(),
      enum: [
        { value: 1, label: '时间范围' },
        { value: 2, label: '有效天数' },
      ],
      'x-rules': [
        {
          required: true,
          message: '请选择用券时间',
        },
      ],
      'x-component-props': {
        className: 'ant-form-item__margin-bottom',
        disabled: detail.showStatus === 1,
      },
    },
    validDays: {
      type: 'inputNumber',
      title: '  ',
      'x-props': {
        itemClassName: 'not__form-item-colon',
      },
      'x-component-props': {
        min: 0,
        max: 999999,
        step: 1,
        addonBefore: '领券当日起',
        addonAfter: '天内可以用',
        className: 'not-antd-form-item__colon',
        disabled: detail.showStatus === 1,
      },
    },
    timeGrid: {
      'x-component': 'grid',
      properties: {
        times: {
          type: 'object',
          'x-component': 'getCouponTime',
          'x-component-props': {
            path: 'timeGrid.times',
          },
          properties: {
            validStartTime: {
              type: 'date',
              title: handleIsMiniProgram() ? '用券时间' : '',
              'x-props': {
                labelCol: handleIsMiniProgram() && 9,
                wrapperCol: handleIsMiniProgram() && 16,
                placeholder: '开始时间',
                disabledDate: disabledDates,
                disabledTime: disabledDateTime,
                showTime: !handleIsMiniProgram(),
                format: handleIsMiniProgram() ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
                disabled: detail.showStatus === 1,
              },
              'x-rules': {
                required: true,
                message: '开始时间不能为空',
              },
            },
            validEndTime: {
              type: 'date',
              title: '',
              'x-props': {
                placeholder: '结束时间',
                disabledDate: endDisabledDates,
                disabledTime: endDisabledDateTime,
                showTime: !handleIsMiniProgram(),
                format: handleIsMiniProgram() ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss',
                disabled: detail.showStatus === 1,
              },
            },
          },
        },
      },
    },
    publishType: {
      type: 'radio',
      title: '推广方式',
      cols: 2,
      default: 2,
      enum: handleIsMiniProgram()
        ? [
            {
              label:
                '{{ text("用户领取",help("用户主动领取。小程序领取入口：商品详情页、领券中心、购物车等")) }}',
              value: 2,
            },
            {
              label: '{{ text("平台发放",help("平台人工发券给指定用户，针对性定向营销")) }}',
              value: 3,
            },
            {
              label:
                '{{ text("新用户注册自动发放",help("新注册用户，自动发放未过期且有库存的优惠券，建议发放总数、领券/用券时间设置长点")) }}',
              value: 0,
            },
          ]
        : [
            { label: '用户领取', value: 2 },
            { label: '平台发放', value: 3 },
            { label: '新用户注册自动发放', value: 0 },
            { label: '储值活动', value: 1 },
          ],
      'x-rules': [
        {
          required: true,
          message: '请选择适用商品',
        },
      ],
    },
    storeId: {
      title: '所属商家',
      type: 'string',
      enum: storeSelectOptions,
      visible: handleIsMiniProgram(),
      'x-rules': [
        {
          required: true,
          message: '请选择所属商家',
        },
      ],
      'x-props': {
        addonAfter: "{{ help('优惠券只能在所属商家店铺内使用，商家需承担优惠券的营销费用',20) }}",
      },
      'x-component-props': {
        disabled: detail.showStatus === 1,
        onSelect: handleGetProductId,
        showSearch: true,
        filterOption: stringFilterOption,
        placeholder: '请选择商家',
      },
    },
    used: {
      type: 'radio',
      title: '适用商品',
      cols: 2,
      default: handleIsMiniProgram() ? 40 : 20,
      enum: [
        { label: '全部商品可用', value: handleIsMiniProgram() ? 40 : 10 },
        { label: '部分商品可用', value: 20 },
        { label: '限类目可用', value: 30 },
      ],
      'x-rules': [
        {
          required: true,
          message: '请选择适用商品',
        },
      ],
    },
    categoryId: {
      title: '关联分类',
      type: 'treeSelect',
      'x-component-props': {
        placeholder: '请选择关联分类',
        treeData: productOneCategories,
        showSearch: true,
        treeDefaultExpandAll: true,
        treeNodeFilterProp: 'title',
        width: 327,
        onSelect: handleGetCategoryName,
      },
      'x-rules': {
        required: true,
        message: '请选择关联分类',
      },
    },
  };

  const handleFormEffects = ($: any, { setFieldState }: any) => {
    const linkage = createLinkageUtils();

    const visibleAndClean = (fieldPath: string, visible = true) => {
      setFieldState(fieldPath, (fieldState) => {
        fieldState.value = '';
        fieldState.visible = visible;
      });
    };

    $('onFieldValueChange', 'used').subscribe((fieldState: any) => {
      linkage.visible('categoryId', Number(fieldState.value) === 30);

      dispatch({
        type: 'coupon/updateState',
        payload: {
          couponUsed: fieldState.value,
          tempRowProducts: [],
          selectRowProducts: [],
        },
      });
    });

    $('onFieldValueChange', 'dataTime').subscribe((fieldState: any) => {
      setCouponTime.current = fieldState.value;

      linkage.value('times.validStartTime', '');
      linkage.value('times.validEndTime', '');
    });

    $('onFieldValueChange', 'times.validStartTime').subscribe((fieldState: any) => {
      if (
        fieldState.value &&
        setCouponTime &&
        setCouponTime.current &&
        setCouponTime.current[0] > fieldState.value
      ) {
        message.warning('开始时间不得早于领券开始时间');
        setFieldState('times.validStartTime', (state: any) => {
          state.value = '';
        });
      }
      startTime.current = fieldState.value;
    });
    $('onFieldValueChange', 'times.validEndTime').subscribe((fieldState: any) => {
      const endTime =
        startTime.current > setCouponTime.current && setCouponTime.current[1]
          ? startTime.current
          : setCouponTime.current && setCouponTime.current[1];
      if (fieldState.value && setCouponTime && endTime > fieldState.value) {
        message.warning('结束时间不得早于领券结束时间');
        setFieldState('times.validEndTime', (state: any) => {
          state.value = '';
        });
      }
    });
    $('onFieldValueChange', 'validType').subscribe((state: any) => {
      if (handleIsMiniProgram()) {
        state.value = 1;
      }
      const val = {
        visible: state.value === 1,
        style:
          state.value === 1
            ? {
                display: 'block',
                position: 'relative',
                left: handleIsMiniProgram() ? '5.4%' : '14.4%',
              }
            : { display: 'none' },
      };
      visibleAndClean('validDays', !val.visible);
      visibleAndClean('times.validStartTime', val.visible);
      visibleAndClean('times.validEndTime', val.visible);
      linkage.xComponentProp('timeGrid', 'style', val.style);
    });
    $('onFieldValueChange', 'type').subscribe((state: any) => {
      minusType.current = state.value;
      if (state.value === 1) {
        setFieldState('minus.usedDiscount', (fieldState: any) => {
          fieldState.value = '';
          fieldState.visible = false;
        });
        setFieldState('minus.usedAmount', (fieldState: any) => {
          fieldState.value = '';
          fieldState.visible = true;
          fieldState.required = true;
        });
      } else {
        setFieldState('minus.usedAmount', (fieldState: any) => {
          fieldState.value = '';
          fieldState.visible = false;
        });
        setFieldState('minus.usedDiscount', (fieldState: any) => {
          fieldState.value = '';
          fieldState.visible = true;
          fieldState.required = true;
        });
      }
    });
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    const validates = await formActions.validate();
    let ruleRemarks = '';
    let timeRemarks = '';
    let usedRemarks = '';
    if (validates.errors.length) {
      return message.error('请输入必填项');
    }
    const validate = await formActions.getFormState();
    const { values }: any = validate;
    if (handleIsMiniProgram()) {
      values.validType = 1;
    }

    if (values.validType === 1) {
      if (values.times.validStartTime === '') {
        return message.error('请选择用券开始时间');
      }
      if (values.times.validEndTime === '') {
        return message.error('请选择用券结束时间');
      }
    } else if (!values.validDays) {
      return message.error('请输入有效天数');
    }
    formActions.getFormState((state: any) => {
      const params: any = {
        id,
        takeStartTime: handleIsMiniProgram()
          ? `${(state.values as any).dataTime[0]} 00:00:00`
          : (state.values as any).dataTime[0],
        takeEndTime: handleIsMiniProgram()
          ? `${(state.values as any).dataTime[1]} 23:59:59`
          : (state.values as any).dataTime[1],
        withAmount: (state.values as any).minus.withAmount,
        quota: (state.values as any).quota,
        name: (state.values as any).name,
        validType: (state.values as any).validType,
        type: (state.values as any).type,
        storeId: (state.values as any).storeId,
        used:
          window.location.pathname.split('/').includes('miniProgram') &&
          (state.values as any).used === 10
            ? 40
            : (state.values as any).used,
        takeLimit: (state.values as any).takeLimit,
        publishType: (state.values as any).publishType,
      };

      usedRemarks = getUsed(values.used);
      if (Number(state.values.type) === 1) {
        params.usedAmount = (state.values as any).minus.usedAmount;
        ruleRemarks = getDiscountText(params.withAmount, params.type, params.usedAmount, '');
      } else {
        params.usedDiscount = (state.values as any).minus.usedDiscount / 10;
        ruleRemarks = getDiscountText(params.withAmount, params.type, '', params.usedDiscount);
      }
      if (Number(state.values.validType) === 1) {
        params.validStartTime = (state.values as any).times.validStartTime;
        params.validEndTime = (state.values as any).times.validEndTime;
        timeRemarks = getCouponvalidType(
          state.values.validType,
          params.validStartTime,
          params.validEndTime,
          '',
        );
        if (handleIsMiniProgram()) {
          params.validStartTime = `${params.validStartTime} 00:00:00`;
          params.validEndTime = `${params.validEndTime} 23:59:59`;
        }
      } else {
        params.validDays = (state.values as any).validDays;
        timeRemarks = getCouponvalidType(state.values.validTyp, '', '', params.validDays);
      }
      if (Number(state.values.used) === 20) {
        if (selectedProductRowKeys.length < 1) {
          return message.warning('请选择商品！');
        }
        params.productInfoIds = selectedProductRowKeys;
      } else if (Number(state.values.used) === 30) {
        params.categoryId = (state.values as any).categoryId;
        usedRemarks = getUsed(values.used, categoryName);
      }

      const fetchLimit = `每人限领${state.values?.takeLimit}张`;

      params.remark = `${timeRemarks}\n${usedRemarks}${ruleRemarks}，${fetchLimit}`;

      const requestUrl = handleIsMiniProgram() ? saveMiniCoupon : editCoupon;
      setButtonLoading(true);
      return requestUrl(params).then(() => {
        setTimeout(() => {
          dispatch({
            type: 'coupon/updateState',
            payload: {
              selectRowProducts: [],
              selectedProductRowKeys: [],
              tempRowProducts: [],
              categoryName: '',
            },
          });
          if (handleIsMiniProgram()) {
            history.push('/miniProgram/coupon');
          } else {
            history.push('/app/coupon/list');
          }
        }, 1000);
      });
    });
  };

  const productOpt = {
    title: '选择商品',
    width: 1000,
    visible: openProductModal,
    onCancel() {
      setOpenProductModal(false);
    },
    onOk() {
      const productsKey = tempRowProducts.map((i) => i?.id);
      dispatch({
        type: 'coupon/updateState',
        payload: {
          selectRowProducts: tempRowProducts,
          selectedProductRowKeys: productsKey,
        },
      });
      setOpenProductModal(false);
    },
  };

  const productTableOpt = {
    tempRowProducts,
    selectedProductRowKeys,
    selectRowProducts,
    detailTotal,
    detailCurrent,
    onOpenProductModal() {
      if (handleIsMiniProgram() && storeId === '') {
        message.warning('请选择所属商家');
      } else {
        setOpenProductModal(true);
      }
      let selectKey;
      if (selectRowProducts) {
        selectKey = selectRowProducts.map((i) => i?.id);
      }
      dispatch({
        type: 'coupon/updateState',
        payload: {
          selectedProductRowKeys: selectKey || detail.productInfoIds,
        },
      });
    },
    pageChange(page: any) {
      dispatch({
        type: 'coupon/getCouponProducts',
        payload: {
          current: page.current,
          size: page.pageSize,
          couponId: id,
        },
      });
    },
  };

  return (
    <Card>
      <Spin spinning={showLoading}>
        {openProductModal && <ProductModal {...productOpt} />}
        添加/修改优惠券
        <div className={Styles.addCoupon}>
          <SchemaForm
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            schema={schema}
            actions={formActions}
            effects={handleFormEffects}
            fields={useFields as any}
            onSubmit={handleSubmit}
          />
          {couponUsed === 20 && <ProductTable {...productTableOpt} />}
        </div>
        <div style={{ textAlign: 'right', width: 1000, marginTop: '20px' }}>
          <Button loading={buttonLoading} type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </Spin>
    </Card>
  );
};

export default CouponEditPage;
