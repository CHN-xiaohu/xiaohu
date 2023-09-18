/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
/* eslint-disable no-useless-concat */

import { useModalForm } from '@/components/Business/Formily';

import { useRef } from 'react';

import { message } from 'antd';
import { createAsyncFormActions } from '@formily/antd';

import { handleSubstringTextAfter, handleSubstringTextBefore } from '@/utils';

import { SelectByLoadMore } from '@/components/Library/Select';

import { effects } from './effects';

import TagForm from '../components/TagForm';

import {
  addAdv,
  updateAdv,
  getProduct,
  getMiniProduct,
  getMiniSpecial,
  getGroupPurchase,
  getByBusinessCode,
} from '../Api';

const formActions = createAsyncFormActions();

type Props = {
  onAddSuccess: () => void;
  categoriesTree: any[];
};

export const useADForm = ({ onAddSuccess, categoriesTree }: Props) => {
  const initialMap = useRef({} as any);
  const isMiniProgram = useRef(false);
  const categoriesTreeRef = useRef([] as any);
  categoriesTreeRef.current = categoriesTree;

  const handleCreateAdv = (values: any) => {
    values.startTime = values.startTime || '1999-01-01 00:00:00';
    values.endTime = values.endTime || '2999-01-01 00:00:00';
    values.status = 2;
    values.flag = isMiniProgram.current ? 2 : 1;
    if (
      (values.chooseProduct && !/^[0-9]+$/.test(values.chooseProduct)) ||
      (values.chooseSpecialPage && !/^[0-9]+$/.test(values.chooseSpecialPage)) ||
      (values.groupPurchase && !/^[0-9]+$/.test(values.groupPurchase)) ||
      (values.byBusinessCode && !/^[0-9]+$/.test(values.byBusinessCode))
    ) {
      values.skipValue = handleSubstringTextAfter(
        handleSubstringTextBefore(
          values.chooseSpecialPage ||
            values.chooseProduct ||
            values.groupPurchase ||
            values.byBusinessCode,
          '）',
        ),
        '（',
      );
    }
    if (values.skipLocation === 'SCHEME_TAG_SEARCH') {
      const valueMap = values.skipValue;
      values.skipValue = valueMap?.id;
      values.skipValueName = valueMap?.name;
    }

    if (values.skipLocation === 'SPECIFY_CATEGORY') {
      values.skipValue = values.categoryPathId.map((ii: any) => ii).join(',');
      values.categoryPathId = '';
      values.skipValueName = '';
    }

    if (values.skipLocation === 'SPECIFY_LABEL' && !/^[0-9]+$/.test(values.skipValue)) {
      const labelValue = values.skipValue;
      values.skipValue = handleSubstringTextBefore(labelValue, '，');
      values.skipValueName = handleSubstringTextAfter(labelValue, '，');
    }

    return addAdv({ ...values }).then(() => {
      message.success('新增成功！');
      onAddSuccess();
    });
  };

  const handleUpdateAdv = (id: string, values: any) => {
    if (
      (values.chooseProduct && !/^[0-9]+$/.test(values.chooseProduct)) ||
      (values.chooseSpecialPage && !/^[0-9]+$/.test(values.chooseSpecialPage)) ||
      (values.groupPurchase && !/^[0-9]+$/.test(values.groupPurchase)) ||
      (values.byBusinessCode && !/^[0-9]+$/.test(values.byBusinessCode))
    ) {
      values.skipValue = handleSubstringTextAfter(
        handleSubstringTextBefore(
          values.chooseSpecialPage ||
            values.chooseProduct ||
            values.groupPurchase ||
            values.byBusinessCode,
          '）',
        ),
        '（',
      );
    }
    if (values?.skipLocation === 'DESIGN_DETAIL' && values?.skipValue === values?.skipValueName) {
      values.skipValue = initialMap.current?.skipValue;
    }
    if (values.skipLocation === 'SCHEME_TAG_SEARCH') {
      const valueMap = values.skipValue;
      values.skipValue = valueMap?.id;
      values.skipValueName = valueMap?.name;
    }
    if (values.skipLocation === 'SPECIFY_CATEGORY') {
      values.skipValue = values.categoryPathId.map((ii: any) => ii).join(',');
      values.categoryPathId = '';
      values.skipValueName = '';
    }
    if (values.skipLocation === 'SPECIFY_LABEL' && !/^[0-9]+$/.test(values.skipValue)) {
      const labelValue = values.skipValue;
      values.skipValue = handleSubstringTextBefore(labelValue, '，');
      values.skipValueName = handleSubstringTextAfter(labelValue, '，');
    }
    return updateAdv({
      ...values,
    }).then(() => {
      message.success('修改成功！');
      onAddSuccess();
    });
  };

  const handleChangeTerminal = () => {
    formActions.setFieldValue('location', undefined);
  };

  const handleProduct = (value: any, isUpdate: boolean) => {
    if (value) {
      if (/^[0-9]+$/.test(value) && value.length === 19) {
        const products = [
          {
            value: isUpdate
              ? initialMap.current.skipValue
              : `${initialMap.current.skipValueName}（${initialMap.current.skipValue}）`,
            label: initialMap.current.skipValueName,
          },
        ];
        formActions.setFieldState('chooseProduct', (state) => {
          (state as any).props.enum = products;
        });
      } else {
        const params: any = isUpdate ? { inculdeIds: value } : { name: value };
        setTimeout(() => {
          const toRequest = isMiniProgram.current ? getMiniProduct : getProduct;
          toRequest(params).then((res) => {
            const { records } = res.data;
            const products = records.map((items: any) => ({
              value: isUpdate ? items.id : `${items.name}（${items.id}）`,
              label: items.name,
            }));
            if (products.length > 0) {
              formActions.setFieldState('chooseProduct', (state) => {
                (state as any).props.enum = products;
              });
            }
          });
        }, 500);
      }
    }
  };

  const handleByBusinessCode = (value: any, isUpdate: boolean) => {
    if (value) {
      if (/^[0-9]+$/.test(value) && value.length === 19) {
        const business = [
          {
            value: isUpdate
              ? initialMap.current.skipValue
              : `${initialMap.current.skipValueName}（${initialMap.current.skipValue}）`,
            label: initialMap.current.skipValueName,
          },
        ];
        formActions.setFieldState('byBusinessCode', (state) => {
          (state as any).props.enum = business;
        });
      } else {
        const params = { searchName: value, businessCode: 'GET_CUSTOMER' };
        setTimeout(() => {
          getByBusinessCode(params).then((res) => {
            const business = res.data?.map((item: any) => ({
              value: isUpdate ? item.dataId : `${item.name}（${item.dataId}）`,
              label: item.name,
            }));
            if (business.length > 0) {
              formActions.setFieldState('byBusinessCode', (state) => {
                (state as any).props.enum = business;
              });
            }
          });
        }, 500);
      }
    }
  };

  const handleSpecialPage = (value: any, isUpdate: boolean) => {
    if (value) {
      if (/^[0-9]+$/.test(value) && value.length === 19) {
        const specials = [
          {
            value: isUpdate
              ? initialMap.current.skipValue
              : `${initialMap.current.skipValueName}（${initialMap.current.skipValue}）`,
            label: initialMap.current.skipValueName,
          },
        ];
        formActions.setFieldState('chooseSpecialPage', (state) => {
          (state as any).props.enum = specials;
        });
      } else {
        getMiniSpecial(value).then((res) => {
          const specials = res.data.map((items: any) => ({
            value: isUpdate ? items.id : `${items.name}（${items.id}）`,
            label: items.name,
          }));
          if (specials.length > 0) {
            formActions.setFieldState('chooseSpecialPage', (state) => {
              (state as any).props.enum = specials;
            });
          }
        });
      }
    }
  };

  const handleGroupPurchase = (value: any, isUpdate: boolean) => {
    if (value) {
      setTimeout(() => {
        const params = { selectField: value, status: 3 } as any;
        if (/^[0-9]+$/.test(value) && value.length === 19) {
          const groups = [
            {
              value: isUpdate
                ? initialMap.current.skipValue
                : `${initialMap.current.skipValueName}（${initialMap.current.skipValue}）`,
              label: initialMap.current.skipValueName,
            },
          ];
          formActions.setFieldState('groupPurchase', (state) => {
            (state as any).props.enum = groups;
          });
        } else {
          getGroupPurchase(params).then((res) => {
            const { records } = res.data;
            const groups = records.map((items: any) => ({
              value: isUpdate ? items.id : `${items.activityName}（${items.id}）`,
              label: items.activityName,
            }));
            if (groups.length > 0) {
              formActions.setFieldState('groupPurchase', (state) => {
                (state as any).props.enum = groups;
              });
            }
          });
        }
      }, 500);
    }
  };

  // const handleRecommendProject = () => {

  // }

  const handleSearchSpecialPage = (e: any) => {
    handleSpecialPage(e, false);
  };

  const handleSearchProduct = (e: any) => {
    handleProduct(e, false);
  };

  const handleSearchGroupPurchase = (e: any) => {
    handleGroupPurchase(e, false);
  };

  const handleSearchByBusinessCode = (e: any) => {
    handleByBusinessCode(e, false);
  };

  const handleSkipValueName = () => {
    formActions.setFieldState('skipValueName', (state) => {
      (state as any).value = '';
    });
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateAdv,
    onUpdate: handleUpdateAdv,
    actions: formActions,
    effects: effects({
      handleProduct,
      handleGroupPurchase,
      handleSpecialPage,
      handleByBusinessCode,
      projectName: initialMap?.current?.skipValueName,
      // projectName: '23232323',
    }),
    isNativeAntdStyle: true,
    modalProps: {
      style: {
        height: 'calc(100vh - 200px)',
      },
    },
    components: {
      SelectByLoadMore,
      TagForm,
    },
    schema: {
      isUsing: {
        title: '立即启用',
        type: 'boolean',
        default: true,
      },
      name: {
        title: '广告标题',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入广告标题',
        },
        'x-rules': [
          {
            // eslint-disable-next-line no-useless-escape
            required: true,
            message: '请输入广告标题',
          },
          {
            pattern: /^.{1,15}$/,
            message: '名称不能超过 15 个字',
          },
        ],
      },
      terminal: {
        title: '展示终端',
        type: 'string',
        name: 'checkbox',
        enum: [
          { value: 1, label: 'IOS' },
          { value: 2, label: 'Android' },
          { value: 3, label: 'Android/IOS' },
        ],
        'x-component-props': {
          placeholder: '请选择展示终端',
          onSelect: handleChangeTerminal,
        },
        'x-rules': {
          // eslint-disable-next-line no-useless-escape
          required: true,
          message: '请选择展示终端',
        },
      },
      location: {
        title: '广告位置',
        type: 'string',
        enum: [
          {
            value: 'APP_FIRST_SCREEN',
            label: '首页弹窗广告',
          },
          {
            value: 'APP_SPLASH_SCREEN',
            label: '闪屏广告',
          },
        ],
        'x-component-props': {
          placeholder: '请选择广告位置',
        },
        'x-rules': {
          // eslint-disable-next-line no-useless-escape
          required: true,
          message: '请选择广告位置',
        },
      },
      skipLocation: {
        title: '广告跳转',
        type: 'string',
        'x-component-props': {
          placeholder: '请选择广告跳转',
          onChange: handleSkipValueName,
        },
        enum: [
          { value: 'APP_PEAS_PAGE', label: '咋豆充值页面' },
          { value: 'APP_PRODUCT_DETAIL', label: '商品详情页' },
          { value: 'APP_EXTERNAL', label: '外部跳转' },
          { value: 'APP_STORE_VIP', label: '商家VIP页' },
          { value: 'GROUP_PURCHASE_PAGE', label: '团购详情页' },
          // { value: 'MINI_SPECIAL_PAGE', label: '专题页面' },
        ],
        'x-rules': {
          // eslint-disable-next-line no-useless-escape
          required: true,
          message: '请选择广告跳转',
        },
      },
      categoryPathId: {
        title: '商品分类',
        type: 'cascader',
        'x-component-props': {
          visible: false,
          showSearch: true,
          placeholder: '请选择商品分类',
          changeOnSelect: true,
          expandTrigger: 'hover',
          // options: categories,
        },
        'x-rules': {
          required: true,
          message: '请选择商品分类',
        },
      },
      chooseProduct: {
        title: '跳转地址',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入商品名称',
          showSearch: true,
          onSearch: (e: any) => handleSearchProduct(e),
        },
        enum: [],
      },
      chooseSpecialPage: {
        title: '跳转地址',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入专题名称',
          showSearch: true,
          onSearch: (e: any) => handleSearchSpecialPage(e),
        },
        enum: [],
      },
      groupPurchase: {
        title: '跳转地址',
        type: 'string',
        placeholder: '请输入团购名称',
        'x-component-props': {
          showSearch: true,
          onSearch: (e: any) => handleSearchGroupPurchase(e),
        },
        enum: [],
      },
      byBusinessCode: {
        title: '跳转地址',
        type: 'string',
        placeholder: '请输入活动名称',
        'x-component-props': {
          showSearch: true,
          onSearch: (e: any) => handleSearchByBusinessCode(e),
        },
        enum: [],
      },

      skipValue: {
        title: '跳转地址',
        type: 'string',
        'x-component-props': {
          placeholder: '请输跳转地址',
          visible: false,
        },
        'x-rules': {
          message: '请输入正确的格式',
          pattern:
            /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
        },
      },
      skipValueName: {
        title: ' ',
        type: 'string',
        'x-component-props': {
          visible: false,
        },
      },
      sort: {
        title: '位置排序',
        type: 'number',
        'x-component-props': {
          placeholder: '请输入数字排序（不能超过99999）',
          max: 99999,
          min: 0,
          style: {
            width: 327,
          },
        },
      },
      '[startTime,endTime]': {
        title: '生效时间',
        type: 'daterange',
        'x-component-props': {
          showTime: true,
          format: 'YYYY-MM-DD HH:mm:ss',
          style: {
            width: 327,
          },
        },
      },
      picUrl: {
        title: '图片',
        'x-component-props': {
          placeholder: '600*600',
        },
        'x-props': {
          picKey: 0,
          rule: {
            maxImageWidth: 600,
            maxImageHeight: 600,
          },
        },
        'x-rules': {
          // eslint-disable-next-line no-useless-escape
          required: true,
          message: '请上传图片',
        },
        'x-component': 'uploadFile',
      },
    },
  });

  const handleOpenAdvForm = (initialValues: any = {}) => {
    initialMap.current = initialValues;
    isMiniProgram.current = window.location.pathname.split('/')[2] === 'miniAdv';

    setTimeout(() => {
      formActions.setFieldState('categoryPathId', (fieldState) => {
        (fieldState.props as any)['x-component-props'].options = [...categoriesTreeRef.current];
      });
    });

    openModalForm({
      title: `${initialValues.id ? '编辑' : '新建'}广告`,
      initialValues,
    }).then(() => {
      formActions.setFieldValue('[startTime,endTime]', [
        initialValues.startTime,
        initialValues.endTime,
      ]);

      formActions.setFieldState('terminal', (state) => {
        state.visible = !isMiniProgram.current;
      });

      formActions.setFieldState('skipLocation', (state) => {
        (state.props as any).enum = isMiniProgram.current
          ? [
              { value: 'MINI_PRODUCT_DETAIL', label: '商品详情页' },
              { value: 'MINI_SPECIAL_PAGE', label: '专题页面' },
              { value: 'DESIGN_LIST', label: '3D设计方案列表' },
              { value: 'BROADCAST_LIST', label: '直播间列表' },
              { value: 'BROADCAST_DETAIL', label: '直播间详情页' },
              { value: 'ACTION_FORM_PAGE', label: '活动页表单' },
              { value: 'SCHEME_TAG_SEARCH', label: '方案标签搜索' },
              { value: 'SPECIFY_CATEGORY', label: '指定分类' },
              { value: 'SPECIFY_LABEL', label: '指定标签' },
            ]
          : [
              { value: 'APP_PEAS_PAGE', label: '咋豆充值页面' },
              { value: 'APP_PRODUCT_DETAIL', label: '商品详情页' },
              { value: 'APP_EXTERNAL', label: '外部跳转' },
              { value: 'APP_STORE_VIP', label: '商家VIP页' },
              { value: 'GROUP_PURCHASE_PAGE', label: '团购详情页' },
              { value: 'COUPON_PAGE', label: '领券中心' },
              { value: 'DESIGN_LIST', label: '3D方案列表' },
              { value: 'DESIGN_DETAIL', label: '方案详情页' },
              { value: 'SCHEME_TAG_SEARCH', label: '方案标签搜索' },
            ];
      });
      formActions.setFieldState('location', (state) => {
        (state.props as any).enum = isMiniProgram.current
          ? [
              { value: 'MINI_FIRST_BANNER', label: '首页Banner' },
              { value: 'MINI_FIRST_RECOMMEND', label: '首页推荐专区' },
            ]
          : [
              {
                value: 'APP_FIRST_SCREEN',
                label: '首页弹窗广告',
              },
              {
                value: 'APP_SPLASH_SCREEN',
                label: '闪屏广告',
              },
            ];
      });
    });
  };
  return {
    openForm: handleOpenAdvForm,
    ModalFormElement,
  };
};
