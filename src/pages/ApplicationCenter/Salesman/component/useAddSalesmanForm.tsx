import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { AreaTreeSelect } from '@/components/Library/Area/TreeSelect';

import { unRegisterSalesman, registerSalesman, editSalesman } from '../Api';

type Props = {
  onAddSuccess: () => void;
  stores: any[];
  salesmanNotPage: any[];
};

const formActions = createAsyncFormActions();

export const stringFilterOption = (input: string, option: { props: { children: string } }) =>
  option.props.children.indexOf(input) > -1;

export const useAddSalesmanForm = ({ onAddSuccess, stores, salesmanNotPage }: Props) => {
  const handleSubmit = (values: any) => {
    let params = {
      ...values,
    };
    formActions.getFieldState('place', (fieldState) => {
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
    params.place = undefined;
    const requestUrl = params.isMerchant === 0 ? unRegisterSalesman : registerSalesman;
    params.isMerchant = undefined;
    return requestUrl(params).then(onAddSuccess);
  };

  const handleUpdate = (values: any, records: any) => {
    let params = { ...records };
    const addressList = [] as any;
    formActions.getFieldState('place', (fieldState) => {
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
    formActions.getFieldState('sysSalesmanRegionalAgentInfos', (fieldState) => {
      const fields = [
        ['provinceName', 'provinceId'],
        ['cityName', 'cityId'],
        ['areaName', 'areaId'],
      ];

      fieldState.values[0].forEach((items: any) => {
        if (items) {
          const areaInfo = (items as { name: string; adcode: string }[]).reduce(
            (previous, current, currentIndex) => ({
              ...previous,
              [fields[currentIndex][0]]: current.name,
              [fields[currentIndex][1]]: current.adcode,
            }),
            {},
          );
          addressList.push(areaInfo);
        }
      });
    });
    params.place = undefined;
    params.isMerchant = undefined;
    params.sysSalesmanRegionalAgentInfos = addressList;
    return editSalesman(params).then(onAddSuccess);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmit,
    onUpdate: handleUpdate,
    actions: formActions,
    components: {
      AreaTreeSelect,
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
        },
        'x-props': {
          dataSource: [
            { value: 0, label: '未注册商家' },
            { value: 1, label: '已注册商家' },
          ],
        },
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === 0 || $self.value === 2 }}',
            target: 'salesmanName',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === 0 || $self.value === 2 }}',
            target: 'registerPhone',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === 0 }}',
            target: 'password',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === 0 || $self.value === 2 }}',
            target: 'place',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === 0 || $self.value === 1 }}',
            target: 'auditStatus',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === 1 }}',
            target: 'storeId',
          },
          // {
          //   type: 'value:display',
          //   condition: '{{ $self.value === 2 }}',
          //   target: 'sysSalesmanRegionalAgentInfos',
          // },
        ],
      },
      storeId: {
        title: '选择商家',
        type: 'string',
        enum: [],
        'x-component-props': {
          showSearch: true,
          filterOption: stringFilterOption,
          placeholder: '请选择商家',
        },
      },
      salesmanName: {
        title: '名称',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入业务员名称',
        },
        'x-rules': {
          required: true,
        },
      },
      registerPhone: {
        title: '手机号码',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入业务员注册手机号码',
        },
        'x-rules': [
          {
            required: true,
          },
          {
            phone: true,
            message: '联系人手机号格式不正确',
          },
        ],
      },
      password: {
        title: '初始密码',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入业务员后台初始密码',
        },
        'x-rules': {
          required: true,
        },
      },
      place: {
        title: '所在地区',
        type: 'area',
        'x-component-props': {
          showAreaLevel: 3,
          isUseCode: false,
          placeholder: '请选择所在城市',
        },
        'x-rules': {
          required: true,
        },
      },
      invitationSalesmanId: {
        title: '邀请者',
        type: 'string',
        default: '-1',
        enum: [],
        'x-component-props': {
          placeholder: '请选择上级业务员',
          showSearch: true,
          filterOption: stringFilterOption,
        },
        'x-rules': {
          required: true,
        },
      },
      auditStatus: {
        title: '审核状态',
        type: 'string',
        'x-component-props': {
          placeholder: '请选择审核状态',
        },
        default: 1,
        enum: [
          {
            value: 1,
            label: '审核通过',
          },
          {
            value: 0,
            label: '待审核',
          },
          {
            value: 2,
            label: '审核不通过',
          },
        ],
      },
      sysSalesmanRegionalAgentInfos: {
        type: 'array',
        title: '服务区域',
        // 'x-rules': {
        //   required: true,
        // },
        'x-component': 'AreaTreeSelect',
        'x-component-props': {
          placeholder: '请选择服务区域',
          labelInValue: true,
        },
      },
    },
  });

  const handleOpenForm = (initialValues: any = {}) => {
    openModalForm({
      title: `${initialValues?.id ? '编辑业务员' : '新增业务员'}`,
      initialValues,
    });

    setTimeout(() => {
      formActions.setFieldState('storeId', (state) => {
        state.props.enum = stores;
      });
      formActions.setFieldState('invitationSalesmanId', (state) => {
        state.props.enum = [{ value: '-1', label: '平台' }, ...salesmanNotPage];
      });
      formActions.setFieldState('isMerchant', (fieldState) => {
        fieldState.value = initialValues.id ? 2 : 0;
        fieldState.display = !initialValues.id;
      });

      formActions.setFieldState('registerPhone', (fieldState) => {
        fieldState.title = !initialValues.id ? '手机号码' : '注册手机号';
        fieldState.props['x-component-props']!.disabled = initialValues.id;
      });

      formActions.setFieldState('sysSalesmanRegionalAgentInfos', (fieldState) => {
        fieldState.display = Number(initialValues?.businessType) === 1;
        fieldState.props!['x-component-props']!.defaultValue =
          initialValues?.sysSalesmanRegionalAgentInfos || [];

        fieldState.props!['x-component-props']!.disabledKeys = initialValues.id
          ? initialValues?.alreadyAddressList
          : [];
      });
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
