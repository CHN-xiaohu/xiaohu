/* eslint-disable no-useless-concat */

import { useModalForm } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';
import { TreeSelect } from 'antd';
import { useEffect, useMemo } from 'react';

import { addBrandOwner } from './Api';

type Props = {
  onAddSuccess: () => void;
  channelsSelectOptions: any[];
  versionTypeSelect: any[];
  categories: any[];
};

const domain = '.zazfix.com';

export const useBrandOwnerForm = ({
  channelsSelectOptions = [],
  versionTypeSelect = [],
  categories = [],
  onAddSuccess,
}: Props) => {
  const formActions = useMemo(() => createAsyncFormActions(), []);

  const handleEditBrandOwner = (values: any) => {
    values.domain = new RegExp(`${domain}$`).test(values.domain)
      ? values.domain
      : `${values.domain}${domain}`;
    return addBrandOwner(values).then(onAddSuccess);
  };

  const setBelongChannelDataSource = (selectOptions: typeof channelsSelectOptions) => {
    formActions.setFieldState('belongChannel', (state) => {
      state.props.enum = selectOptions;
    });
  };

  const setFromDisabled = (name: any, disabled: any) => {
    formActions.setFieldState(name, (state: any) => {
      state.props['x-component-props'].disabled = disabled;
    });
  };

  useEffect(() => {
    setBelongChannelDataSource(channelsSelectOptions);
  }, [channelsSelectOptions]);

  useEffect(() => {
    setTimeout(() =>
      formActions.setFieldState('versionType', (state) => {
        state.props.enum = versionTypeSelect;
      }),
    );
  }, [versionTypeSelect]);

  useEffect(() => {
    setTimeout(() =>
      formActions.setFieldState('mainCategory', (state) => {
        (state.props as any)['x-component-props'].treeData = categories;
      }),
    );
  }, [categories]);

  const { openModalForm, ModalFormElement } = useModalForm({
    onSubmit: handleEditBrandOwner,
    isNativeAntdStyle: true,
    actions: formActions,
    labelCol: 6,
    wrapperCol: 18,
    effects: ($, { setFieldState }) => {
      $('onFieldValueChange', 'belongChannel').subscribe(async () => {
        const { values } = await formActions.getFormState();
        const belongChannel = values?.belongChannel;
        const versionType = values?.versionType;
        const isAssociated = values?.isAssociatedBrandsStore;
        setFromDisabled('versionType', belongChannel !== '0');
        if (belongChannel !== '0') {
          setFieldState('versionType', (fieldState: any) => {
            fieldState.value = 1;
          });
        }
        if (versionType === 2 && isAssociated) {
          setFromDisabled('versionType', true);
          setFromDisabled('belongChannel', true);
        } else {
          setFromDisabled('belongChannel', false);
        }
      });
    },
    schema: {
      tenantName: {
        title: '品牌商名称',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入品牌商名称',
        },
        'x-rules': [
          {
            required: true,
            message: '品牌商名称不能为空',
          },
          {
            message: '品牌商不能为空，且小于或等于20个字段',
            pattern: /^[^\s]{1,20}$/,
          },
        ],
      },
      linkman: {
        title: '联系人',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入联系人',
        },
        'x-rules': [
          {
            required: true,
            message: '联系人为必填',
          },
          {
            pattern: /^[^\s]*$/,
            message: '不能输入空格',
          },
        ],
      },
      contactNumber: {
        title: '联系人手机',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入联系人手机',
        },
        'x-rules': [
          {
            required: true,
            message: '联系人手机号为必填',
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号码格式',
          },
        ],
      },
      belongChannel: {
        title: '所属渠道',
        type: 'string',
        enum: [],
        'x-component-props': {
          placeholder: '请选择所属渠道',
          showSearch: true,
          filterOption: (input: any, option: any) => {
            return option.children.indexOf(input) > -1 || option.contactnumber.indexOf(input) > -1;
          },
        },
        'x-rules': {
          required: true,
          message: '请选择所属渠道',
        },
      },
      versionType: {
        title: '版本类型',
        type: 'string',
        default: 0,
        enum: [],
        'x-component-props': {
          placeholder: '请选择版本类型',
        },
        'x-rules': {
          required: true,
          message: '请选择版本类型',
        },
      },
      mainCategory: {
        title: '主营类目',
        type: 'treeSelect',
        'x-component-props': {
          treeCheckable: true,
          placeholder: '请选择主营类目',
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          treeData: [],
          showSearch: true,
          filterOption: (input: any, option: any) => {
            return option.name.indexOf(input) > -1;
          },
        },
        'x-rules': {
          required: true,
          message: '请选择主营类目',
        },
      },
      tenantAccount: {
        title: '品牌商账号',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入品牌商账号',
          visible: true,
        },
        'x-rules': [
          {
            required: true,
            message: '品牌商账号为必填',
          },
          {
            pattern: /^[^\s][0-9A-Za-z]{2,15}$/,
            message: '请输入2-15位字母或数字密码',
          },
        ],
      },
      password: {
        title: '初始密码',
        type: 'string',
        'x-component-props': {
          placeholder: '初始密码为必填',
        },
        'x-rules': [
          {
            required: true,
            message: '请输入品牌商后台初始密码',
          },
          {
            pattern: /^[^\s][0-9A-Za-z]{5,15}$/,
            message: '请输入6-16位字母或数字密码',
          },
        ],
      },
      domain: {
        title: '域名',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入子域名',
        },
        'x-rules': [
          {
            required: true,
            message: '子域名不能为空',
          },
          {
            pattern: /^[^\s][a-zA-Z0-9-]{0,29}$/,
            message: '只能输入30字以内的数字或英文',
          },
        ],
      },
      goldMerchantNumber: {
        title: '金牌商家数',
        type: 'inputNumber',
        'x-component-props': {
          placeholder: '请输入金牌商家个数',
          defaultValue: 500,
          min: 0,
          max: 999999,
          precision: 0,
          step: 1,
          addonAfter: '个',
          className: 'product-price__input-number--wrapper',
        },
        'x-rules': [
          {
            required: true,
            message: '金牌商家个数为必填',
          },
        ],
      },
      smsNumber: {
        title: '短信条数',
        type: 'inputNumber',
        'x-component-props': {
          placeholder: '请输入短信条数',
          defaultValue: 500,
          min: 0,
          max: 999999,
          step: 1,
          precision: 0,
          addonAfter: '条',
          className: 'product-price__input-number--wrapper',
        },
        'x-rules': [
          {
            required: true,
            message: '短信条数为必填',
          },
        ],
      },
      tenantLogo: {
        title: '企业Logo',
        'x-component': 'uploadFile',
      },
    },
  });

  const handleOpenBDForm = (
    initialValues = {
      belongChannel: '0',
      smsNumber: 500,
      goldMerchantNumber: 500,
    } as any,
  ) => {
    const { id, belongChannel, belongChannelInfo } = initialValues;

    formActions.setFieldState('tenantAccount', (state) => {
      state.visible = !id;
    });

    formActions.setFieldState('domain', (state) => {
      (state.props['x-component-props'] as any).addonAfter = !id ? '.zazfix.com' : '';
    });

    formActions.setFieldState('password', (state) => {
      state.visible = !id;
      state.value = undefined;
    });

    formActions.setFieldState('domain', (state) => {
      state.editable = !id;
    });

    formActions.setFieldState('belongChannel', (state) => {
      const belongChannelDataSource = state.props.enum;
      if (!belongChannelDataSource?.length) {
        return;
      }

      if (
        belongChannel !== '0' &&
        !belongChannelDataSource.some((item) => item.value === belongChannel)
      ) {
        belongChannelDataSource.push({
          label: belongChannelInfo.applyTenantName,
          value: belongChannel,
          contactnumber: belongChannelInfo.applyPhone,
          isTemp: true,
        });
      } else {
        const tempIndex = belongChannelDataSource.findIndex((item) => !!item.isTemp);
        if (tempIndex !== -1) {
          belongChannelDataSource.splice(tempIndex, 1);
        }
      }

      belongChannelDataSource.forEach((item) => {
        item.disabled = item.value === initialValues.id;
      });
    });

    openModalForm({
      title: `${id ? '编辑' : '新建'}品牌商`,
      initialValues: { ...initialValues },
    });
  };
  return {
    openForm: handleOpenBDForm,
    ModalFormElement,
    setBelongChannelDataSource,
  };
};
