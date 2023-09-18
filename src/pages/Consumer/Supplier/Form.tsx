import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { addSupplierNoMerchant, addSupplierIsMerchant, updateSupplier } from './Api';

const formActions = createAsyncFormActions();

type Props = {
  onAddSuccess: () => void;
  storeList: any[];
};

export const useSupplierForm = ({ onAddSuccess, storeList }: Props) => {
  const handleCreateSubmit = (values: any) => {
    let params = {
      ...values,
    };

    if (values.isMerchant === 0) {
      formActions.getFieldState('area', (fieldState) => {
        const [, names] = fieldState.values;

        const fields = [
          ['provinceName', 'provinceId'],
          ['cityName', 'cityId'],
          ['areaName', 'areaId'],
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
      params.id = params.storeId;
      params.storeId = undefined;
    }

    const addIsMerchant = values.isMerchant === 0 ? addSupplierNoMerchant : addSupplierIsMerchant;

    params.area = undefined;
    params.isMerchant = undefined;
    return addIsMerchant(params).then(() => {
      onAddSuccess();
    });
  };

  const handleUpdateSubmit = (id: any, values: any) => {
    let params: any = {
      id: values.storeId,
    };

    if (values.isMerchant !== 1) {
      params = {
        ...values,
      };
      formActions.getFieldState('area', (fieldState) => {
        const [, names] = fieldState.values;

        const fields = [
          ['provinceName', 'provinceId'],
          ['cityName', 'cityId'],
          ['areaName', 'areaId'],
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
    }
    params.area = undefined;
    params.isMerchant = undefined;

    return updateSupplier(params).then(() => {
      onAddSuccess();
    });
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateSubmit,
    onUpdate: handleUpdateSubmit,
    actions: formActions,
    effects: ($, { setFieldState }) => {
      $('onFieldValueChange', 'isMerchant').subscribe((state: any) => {
        const isMerchant = !!state.value;

        setFieldState('MerchantLayout', (fieldState) => {
          fieldState.display = !isMerchant;
        });

        setFieldState('storeId', (fieldState) => {
          fieldState.visible = isMerchant;
          fieldState.required = isMerchant;
        });
      });
      $('onFieldInputChange', 'password').subscribe((state: any) => {
        if (state.value === undefined || state.value === '') {
          state.props.type = 'string';
        } else {
          state.props.type = 'password';
        }
      });
    },
    isNativeAntdStyle: true,
    schema: {
      isMerchant: {
        type: 'radioGroup',
        'x-component-props': {
          style: {
            marginLeft: '25%',
          },
          dataSource: [
            { value: 0, label: '未注册商家' },
            { value: 1, label: '已注册商家' },
          ],
          itemClassName: 'not__form-item-colon',
        },
      },
      MerchantLayout: {
        type: 'object',
        'x-component': 'virtualBox',
        properties: {
          supplierName: {
            title: '名称',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入供应商名称',
            },
            'x-rules': [
              {
                required: true,
                message: '供应商名称为必填',
              },
              {
                message: '供应商名称为必填（4-20个字）',
                pattern: /^[^\s]{4,20}$/,
              },
            ],
          },
          linkName: {
            title: '联系人',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入联系人姓名',
            },
            'x-rules': [
              {
                required: true,
                message: '联系人为必填',
              },
              {
                pattern: /^[^\s]{1,15}$/,
                message: '联系人为必填（1-15个字）',
              },
            ],
          },
          linkPhone: {
            title: '手机号码',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入供应商注册手机号码',
            },
            'x-rules': [
              {
                required: true,
                message: '注册手机号码为必填',
              },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '请输入正确的手机格式',
              },
            ],
          },
          password: {
            title: '初始密码',
            type: 'password',
            'x-component-props': {
              placeholder: '请输入供应商后台初始密码',
              autoFocus: true,
            },
            'x-rules': [
              {
                validator: (value?: string) =>
                  value && !/^[0-9A-Za-z]{6,16}$/.test(value) ? '请输入6-16位字母或数字密码' : '',
              },
            ],
          },
          area: {
            title: '所在地区',
            type: 'area',
            'x-component-props': {
              showAreaLevel: 3,
              isUseCode: false,
              placeholder: '请选择所在地区',
            },
            'x-rules': {
              required: true,
              message: '所在地区不能为空',
            },
          },
        },
      },
      storeId: {
        title: '选择商家',
        type: 'string',
        'x-component-props': {
          placeholder: '商家姓名、注册手机号码检索',
          showSearch: true,
          filterOption: (input: any, option: any) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
      },
    },
  });

  const handleOpenSupplierForm = (initialValues = {} as any) => {
    setTimeout(() => {
      formActions.setFieldState('password', (state) => {
        state.title = initialValues.id ? '密码' : '初始密码';
        state.required = initialValues.id === undefined;
      });
      formActions.setFieldState('isMerchant', (state) => {
        state.visible = initialValues.id === undefined;
      });
      formActions.setFieldState('linkPhone', (state) => {
        (state as any).props['x-component-props'].disabled = !!initialValues.id;
      });
      formActions.setFieldState('storeId', (state) => {
        (state as any).props.enum = storeList;
      });
    });

    openModalForm({
      title: `${initialValues.id ? '编辑' : '新建'}供应商`,
      initialValues: {
        isMerchant: 0,
        ...initialValues,
        password: undefined,
      },
    });
  };
  return {
    openForm: handleOpenSupplierForm,
    ModalFormElement,
  };
};
