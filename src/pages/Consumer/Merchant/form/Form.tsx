import { createAsyncFormActions } from '@formily/antd';
import { connect } from '@formily/antd';

import { useModalForm } from '@/components/Business/Formily';
import { isStr } from '@/utils';

import { updateMerchant } from '../Api';

import { auditStatus } from '../Constants';

import type { AdministrativeAddressChangeValue } from '@/components/Library/MapAddress';
import { MapAddress } from '@/components/Library/MapAddress';
import { insertOrUpdateStoreInfo } from '../../StoreInfo/Api';

type Props = {
  onAddSuccess: () => void;
  downPartners: any[];
  categories: any[];
};

const formActions = createAsyncFormActions();

const fields = [
  ['provinceName', 'provinceId'],
  ['cityName', 'cityId'],
  ['areaName', 'areaId'],
];

export const useMerchantForm = ({ onAddSuccess, downPartners, categories }: Props) => {
  const handleUpdate = (values: any) => {
    const params = {
      id: values.id,
      account: values.account,
      salesmanId: values.invitationSalesmanId,
      storeName: values.storeName,
      linkName: values.linkName,
      linkPhone: values.linkPhone,
      place: values.place,
      auditStatus: values.auditStatus,
      auditLog: values.auditLog || undefined,
      categoryIds: values.categoryIds,
      lng: values.fullAddress.lng,
      lat: values.fullAddress.lat,
      detailedAddress: values.fullAddress.address,
      ...(values.fullAddress.administrativeAddress as AdministrativeAddressChangeValue)?.reduce(
        (previous, current, currentIndex) => ({
          ...previous,
          [fields[currentIndex][0]]: current.name,
          [fields[currentIndex][1]]: current.adcode,
        }),
        {},
      ),
    };

    if (values.id) {
      params.id = values.id;
    }

    const method = values.id ? updateMerchant : insertOrUpdateStoreInfo;

    return method(params).then(onAddSuccess);
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onSubmit: handleUpdate,
    actions: formActions,
    fields: {
      MapAddress: connect()(MapAddress),
    },
    schema: {
      account: {
        title: '注册手机',
        type: 'string',
        'x-props': {
          editable: false,
        },
        'x-component-props': {
          placeholder: '请输入注册手机号码',
        },
        'x-rules': [
          {
            required: true,
            message: '请输入注册手机号码',
          },
          {
            phone: true,
            message: '手机号码格式不正确',
          },
          {
            validator: (value) => {
              formActions.setFieldState('linkPhone', (fState) => {
                if (!fState.value) {
                  fState.value = value;
                }
              });

              return '';
            },
          },
        ],
      },
      invitationSalesmanId: {
        title: '绑定业务员',
        type: 'string',
        enum: [],
        'x-component-props': {
          placeholder: '请输入业务员姓名/注册手机',
          showSearch: true,
          filterOption: (input: any, option: any) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
        default: '-1',
        'x-rules': [
          {
            required: true,
            message: '绑定业务员不能为空',
          },
        ],
      },
      storeName: {
        title: '店铺名称',
        type: 'string',
        'x-component': 'input',
        'x-component-props': {
          placeholder: '请输入店铺名称',
          showLengthCount: true,
          maxLength: 20,
        },
        'x-rules': [
          {
            required: true,
            message: '店铺名称不能为空',
          },
        ],
      },
      linkName: {
        title: '商家姓名',
        type: 'string',
        'x-component': 'input',
        'x-component-props': {
          placeholder: '请输入商家姓名',
          showLengthCount: true,
          maxLength: 20,
        },
      },
      linkPhone: {
        title: '联系手机',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入联系手机',
        },
        'x-rules': [
          {
            phone: true,
            message: '联系人手机号格式不正确',
          },
        ],
      },
      fullAddress: {
        title: '店铺地址',
        type: 'string',
        'x-component': 'MapAddress',
        'x-component-props': {
          showAreaLevel: 3,
          placeholder: '请选择所在城市',
          isUseCode: false,
        },
        'x-rules': [
          {
            required: true,
            message: '所在地区不能为空',
          },
          {
            validator: (value) => {
              if (!value?.address) {
                return '请输入详细地址';
              }

              if (!value?.administrativeAddress?.length) {
                return '请选择地址信息';
              }

              return '';
            },
          },
        ],
      },
      categoryIds: {
        title: '选择类目',
        type: 'string',
        enum: [],
        'x-component-props': {
          placeholder: '请选择主营类目',
          mode: 'multiple',
          showSearch: true,
          filterOption: (input: any, option: any) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
      },
      auditStatus: {
        title: '审核状态',
        type: 'string',
        enum: auditStatus?.map((value, index) => ({ value: index, label: value })),
        'x-component-props': {
          placeholder: '请选择审核状态',
        },
        'x-rules': { required: true, message: '请选择审核状态' },
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === 2 }}',
            target: 'auditLog',
          },
        ],
      },
      auditLog: {
        title: '拒绝原因',
        type: 'string',
        display: false,
        'x-component-props': {
          placeholder: '审核不通过原因',
        },
        'x-rules': {
          required: true,
          range: [1, 20],
          message: '请输入拒绝原因, 上限 20 个字符',
        },
      },
    },
  });

  const handleOpenForm = (initialValues: any = {}) => {
    initialValues.categoryIds = !initialValues?.categoryId
      ? []
      : isStr(initialValues.categoryId)
      ? initialValues.categoryId.split(',')
      : initialValues.categoryId;

    openModalForm({
      initialValues: { ...initialValues },
      title: `${initialValues.id ? '修改' : '新增'}商家信息`,
    }).then(() => {
      formActions.setFieldState('invitationSalesmanId', (state) => {
        state.props.enum = [{ value: '-1', label: '不绑定业务员' }, ...downPartners];
      });

      formActions.setFieldState('categoryIds', (state) => {
        state.props.enum = categories;
      });

      formActions.setFieldState('account', (state) => {
        state.props.editable = !initialValues.id;
      });

      formActions.setFieldState('fullAddress', (state) => {
        Object.assign(state.props['x-component-props'], {
          administrativeAddress: initialValues.place,
          lng: initialValues.lng || undefined,
          lat: initialValues.lat || undefined,
          address: initialValues.detailedAddress,
        });
      });
    });
  };
  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
