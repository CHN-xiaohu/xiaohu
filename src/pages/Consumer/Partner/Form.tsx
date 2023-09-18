import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { handleSubstringTextAfter, handleSubstringTextBefore } from '@/utils';

import {
  addNoMerchantPartner,
  addIsMerchantPartner,
  updatePartner,
  getPartnerDownList,
  getStoreList,
} from './Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const usePartnerForm = ({ onAddSuccess }: Props) => {
  const handleCreate = (values: any) => {
    let params = {
      ...values,
    };
    if (values.parentAccount !== '0') {
      params.parentAccount = handleSubstringTextAfter(
        handleSubstringTextBefore(values.parentAccount, '）'),
        '（',
      );
    }

    if (values.isMerchant === 0) {
      formActions.getFieldState('place', (fieldState) => {
        const [, names] = fieldState.values;

        const fields = [
          ['province', 'provinceId'],
          ['city', 'cityId'],
          ['area', 'areaId'],
        ];

        const areaInfo = (names as { name: string; adcode: string }[]).reduce(
          (previous, current, currentIndex) => ({
            ...previous,
            [fields[currentIndex][0]]: current.name,
            [fields[currentIndex][1]]: current.adcode,
          }),
          {},
        );
        params = {
          ...params,
          ...areaInfo,
        };
      });
    } else {
      params.storeId = handleSubstringTextAfter(
        handleSubstringTextBefore(values.storeId, '）'),
        '（',
      );
    }

    const addIsMerchant = values.isMerchant === 0 ? addNoMerchantPartner : addIsMerchantPartner;

    params.place = undefined;
    params.isMerchant = undefined;
    params.status = 1;

    return addIsMerchant(params).then(() => {
      onAddSuccess();
    });
  };

  const handleUpdate = (id: any, values: any) => {
    let params = {
      id: values.id,
      partnerName: values.partnerName,
      partnerPhone: values.partnerPhone,
      parentAccount: values.parentAccount,
      partnerType: values.partnerType,
      province: values?.province,
      provinceId: values?.provinceId,
      city: values?.city,
      cityId: values?.cityId,
      area: values?.area,
      areaId: values?.areaId,
    } as any;
    if (values.parentAccount !== '0' && !/^[0-9]+$/.test(values.parentAccount)) {
      params.parentAccount = handleSubstringTextAfter(
        handleSubstringTextBefore(values.parentAccount, '）'),
        '（',
      );
    }
    formActions.getFieldState('place', (fieldState) => {
      const [, names] = fieldState.values;

      const fields = [
        ['province', 'provinceId'],
        ['city', 'cityId'],
        ['area', 'areaId'],
      ];

      if (names) {
        const areaInfo = (names as { name: string; adcode: string }[]).reduce(
          (previous, current, currentIndex) => ({
            ...previous,
            [fields[currentIndex][0]]: current.name,
            [fields[currentIndex][1]]: current.adcode,
          }),
          {},
        );
        params = {
          ...params,
          ...areaInfo,
        };
      }
    });
    return updatePartner(params).then(() => {
      onAddSuccess();
    });
  };

  const handleGetPartner = (value: any, isUpdate: boolean) => {
    getPartnerDownList(value).then((res) => {
      const { data } = res;
      const partner = data.map((item: any) => ({
        value: isUpdate ? item.partnerAccount : `${item.partnerName}（${item.partnerAccount}）`,
        label: `${item.partnerName}（${item.partnerAccount}）`,
      }));
      if (partner.length > 0) {
        partner.unshift({ value: '0', label: '平台' });
        formActions.setFieldState('parentAccount', (state) => {
          state.props.enum = partner;
        });
      }
    });
  };

  const handleGetStores = (value: any) => {
    getStoreList(value).then((res) => {
      const { data } = res;
      const stores = data.map((item: any) => ({
        value: `${item.linkName}）（${item.registerPhone}（${item.id}）`,
        label: `${item.linkName}（${item.registerPhone}）`,
      }));
      if (stores.length > 0) {
        formActions.setFieldState('storeId', (state) => {
          state.props.enum = stores;
        });
      }
    });
  };

  const handleSearch = (e: any) => {
    handleGetPartner(e, false);
  };

  const handleSearchStores = (e: any) => {
    handleGetStores(e);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    actions: formActions,
    effects: ($: any, { setFieldState }) => {
      $('onFieldValueChange', 'isMerchant').subscribe((state: any) => {
        const isMerchant = !!state.value;

        setFieldState('PartnerLayout', (fieldState) => {
          fieldState.display = !isMerchant;
        });

        setFieldState('storeId', (fieldState) => {
          fieldState.visible = isMerchant;
          fieldState.required = isMerchant;
        });
      });
      $('onFieldValueChange', 'parentAccount').subscribe((state: any) => {
        console.log('parentAccount', state.value);
        if (state.value !== '0') {
          handleGetPartner(state.value, true);
        }
      });
      $('onFieldChange', 'place').subscribe((state: any) => {
        if (state.value === undefined || (state.value && state.value[0] === '')) {
          state.value = undefined;
        }
      });
    },
    isNativeAntdStyle: true,
    schema: {
      isMerchant: {
        type: 'radioGroup',
        default: 0,
        'x-component-props': {
          style: {
            marginLeft: '25%',
          },
          dataSource: [
            { value: 0, label: '未注册商家' },
            { value: 1, label: '已注册商家' },
          ],
        },
      },
      PartnerLayout: {
        type: 'object',
        'x-component': 'virtualBox',
        properties: {
          partnerName: {
            title: '真实姓名',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入合伙人姓名',
            },
            'x-rules': [
              {
                required: true,
                message: '合伙人姓名不能为空',
              },
            ],
          },
          partnerPhone: {
            title: '手机号码',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入合伙人注册手机号码',
            },
            'x-props': {
              // disabled: isUpdate,
            },
            'x-rules': [
              {
                required: true,
                message: '合伙人注册手机号码不能为空',
              },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '合伙人注册手机号码格式不正确',
              },
            ],
          },
          password: {
            title: '初始密码',
            type: 'password',
            'x-component-props': {
              placeholder: '请输入合伙人后台初始密码',
            },
            'x-rules': [
              {
                required: true,
                message: '初始密码不能为空',
              },
            ],
          },
          place: {
            title: '所在地区',
            type: 'area',
            'x-component-props': {
              showAreaLevel: 3,
              placeholder: '请选择所在地区',
              isUseCode: false,
            },
            'x-rules': [
              {
                required: true,
                message: '所在地区不能为空',
              },
            ],
          },
        },
      },
      storeId: {
        title: '选择商家',
        type: 'string',
        enum: [],
        'x-component-props': {
          showSearch: true,
          onSearch: (e: any) => handleSearchStores(e),
          placeholder: '商家姓名、注册手机号码检索',
        },
      },
      parentAccount: {
        title: '所属上级',
        type: 'string',
        default: '0',
        enum: [{ value: '0', label: '平台' }],
        'x-component-props': {
          placeholder: '请选择上级合伙人',
          showSearch: true,
          onSearch: (e: any) => handleSearch(e),
        },
        'x-rules': [
          {
            required: true,
            message: '上级合伙人不能为空',
          },
        ],
      },
      partnerType: {
        title: '选择类型',
        type: 'radio',
        default: 0,
        enum: [{ label: '业务合伙人', value: 0 }],
      },
    },
  });

  const handleOpenPartnerForm = (
    initialValues = {
      isMerchant: 0,
    } as any,
  ) => {
    formActions.setFieldState('password', (state) => {
      state.visible = !initialValues.id && !initialValues.password;
    });
    formActions.setFieldState('isMerchant', (state) => {
      state.visible = !initialValues.id;
    });

    openModalForm({
      title: `${initialValues.id ? '编辑' : '新建'}合伙人`,
      initialValues,
    });
  };
  return {
    openForm: handleOpenPartnerForm,
    ModalFormElement,
  };
};
