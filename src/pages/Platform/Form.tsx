import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createElement, useState, useRef } from 'react';
import { useMount } from 'ahooks';
import { createAsyncFormActions } from '@formily/antd';

import { UserInfoCache } from '@/services/User';

import { getPlatform, addPlatform } from './Api';

const formActions = createAsyncFormActions();

export default function PlatformForm() {
  const { userId } = UserInfoCache.get({});
  const [datas, setData] = useState({} as any);
  const platformId = useRef([] as any);
  const messageInit = useRef([] as any);

  useMount(() => {
    getPlatform(userId).then((res) => {
      const { data } = res;
      data.place = [data.provinceName, data.cityName, data.areaName];
      messageInit.current = data;
      setData(data);
      platformId.current = data.id;
    });
  });

  const handleUpdate = (values: any) => {
    let params = {
      id: platformId.current,
      tenantName: values.tenantName,
      contactNumber: values.contactNumber,
      tenantLogo: values.tenantLogo,
      detailedAddress: values.detailedAddress,
      companyName: values.companyName,
      belongChannel: values.belongChannel,
      versionType: values.versionType,
      mainCategorys: values.mainCategorys,
    } as any;

    formActions.getFieldState('place', (fieldState) => {
      const [, names] = fieldState.values;

      const fields = [
        ['provinceName', 'provinceCode'],
        ['cityName', 'cityCode'],
        ['areaName', 'areaCode'],
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
    params.address = `${params.provinceName}${params.cityName}${params.areaName}`;
    // params.provinceName = undefined;
    // params.cityName = undefined;
    // params.areaName = undefined;
    params.place = undefined;

    return addPlatform(params).then(() => {
      window.location.reload();
    });
  };

  const createRichTextUtils = () => ({
    red(text: any) {
      return createElement('span', { style: { color: 'red', margin: '0 3px' } }, text);
    },
  });

  const props: NormalFormProps = {
    actions: formActions,
    onSubmit: handleUpdate,
    initialValues: datas || messageInit.current,
    labelCol: 4,
    wrapperCol: 10,
    expressionScope: createRichTextUtils(),
    effects: ($) => {
      $('onFormReset').subscribe(() => {
        formActions.setFieldValue('createTime', messageInit.current.createTime);
        formActions.setFieldValue('contractEndDate', messageInit.current.contractEndDate);
        formActions.setFieldValue('goldMerchantNumber', messageInit.current.goldMerchantNumber);
      });
    },
    schema: {
      platformLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '平台信息',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          tenantName: {
            title: '品牌商名称',
            type: 'string',
            'x-rules': [
              {
                range: [0, 20],
                message: '品牌商名称不能超过20个字符',
              },
              {
                notEmpty: true,
                message: '品牌商名称不能为空字符',
              },
              {
                required: true,
                message: '请输入品牌商名称',
              },
            ],
          },
          contactNumber: {
            title: '联系人手机号',
            type: 'string',
            'x-rules': [
              {
                required: true,
                message: '请输入联系人手机',
              },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '联系人手机号不能为空',
              },
            ],
          },
          tenantLogo: {
            title: 'logo',
            'x-component': 'uploadFile',
            'x-rules': {
              required: true,
              message: '请上传企业Logo',
            },
            'x-component-props': {
              placeholder: '100*100',
            },
            'x-props': {
              rule: {
                maxImageWidth: 100,
                maxImageHeight: 100,
              },
            },
          },
          companyName: {
            title: '公司名称',
            type: 'string',
            'x-rules': [
              {
                required: true,
                message: '请输入公司名称',
              },
              {
                range: [2, 20],
                message: '请输入2-20个字',
              },
            ],
          },
          place: {
            title: '联系地址',
            type: 'area',
            'x-component-props': {
              showAreaLevel: 3,
              placeholder: '请选择所在',
              isUseCode: false,
            },
            'x-rules': [
              {
                required: true,
                message: '所在地区不能为空',
              },
            ],
          },
          detailedAddress: {
            title: '        ',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入详细地址',
              className: 'not-antd-form-item__colon',
            },
          },
          goldMerchantNumber: {
            title: '金牌商家个数',
            type: 'string',
            editable: false,
            'x-props': {
              addonAfter: `{{ red('（${
                datas.goldMerchantSurplus || messageInit.current.goldMerchantSurplus
              }）')}}`,
            },
          },
          createTime: {
            title: '创建时间',
            type: 'string',
            editable: false,
          },
          contractEndDate: {
            title: '到期时间',
            type: 'string',
            editable: false,
          },
        },
      },
      formButtonList: {
        type: 'object',
        'x-component': 'formButtonGroup',
        properties: {
          buttonGroup: {
            type: 'submitButton',
            'x-component-props': {
              children: '保存',
            },
          },
          cancelButton: {
            type: 'cancelButton',
            'x-component-props': {
              style: {
                marginTop: '4px',
              },
            },
            'x-component-props': {
              children: '重置',
            },
          },
        },
      },
    },
  };

  return (
    <>
      <SchemaForm {...props} />
    </>
  );
}
