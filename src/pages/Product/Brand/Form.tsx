import { useModalForm } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useEffect } from 'react';

import { TreeSelect } from 'antd';
import { createAsyncFormActions } from '@formily/antd';

import { editBrand } from '../Api';

const { SHOW_PARENT } = TreeSelect;

type Props = {
  onSubmitSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const useBrandForm = ({ onSubmitSuccess }: Props) => {
  const { categories } = useStoreState('productCategory');

  const handleEditBrand = (values: any) =>
    editBrand({ status: 1, ...values }).then(onSubmitSuccess);

  useEffect(() => {
    setTimeout(() => {
      formActions.setFieldState('categoryIds', (state) => {
        (state as any).props['x-component-props'].treeData = categories;
      });
    });
  }, [categories]);

  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    onSubmit: handleEditBrand,
    schema: {
      cnName: {
        title: '品牌名称',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入品牌中文名称',
        },
        'x-rules': [
          {
            required: true,
            message: '品牌名称不能为空',
          },
          {
            message: '品牌名称为8个中文，英文或数字',
            pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){0,8}$$/,
          },
        ],
      },
      enName: {
        title: '英文名称',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入品牌英文名称',
        },
        'x-rules': [
          {
            message: '品牌名称为20个英文',
            pattern: /^[^\s][a-zA-Z]{0,20}$/,
          },
        ],
      },
      categoryIds: {
        title: '关联类目',
        type: 'treeSelect',
        description: '选错类目，会造成数据搜索错误哦',
        'x-component-props': {
          placeholder: '请选择关联类目',
          treeData: categories,
          treeCheckable: true,
          showCheckedStrategy: SHOW_PARENT,
          showSearch: true,
          treeNodeFilterProp: 'title',
          multiple: true,
          className: 'ant-form-explain__font-size',
        },
        'x-rules': [
          {
            required: true,
            message: '请选择关联类目',
          },
        ],
      },
      serial: {
        title: '品牌排序',
        type: 'inputNumber',
        description: '由小到大排列显示，越小越靠前',
        'x-component-props': {
          placeholder: '请输入排序（0-99999）',
          min: 0,
          max: 99999,
          step: 1,
          precision: 0,
          className: 'ant-form-explain__font-size',
          style: {
            width: '350px',
          },
        },
        'x-rules': [
          {
            required: true,
            message: '请输入品牌排序',
          },
        ],
      },
      image: {
        title: '品牌图标',
        type: 'uploadFile',
        'x-component-props': {
          placeholder: '600*600',
          picKey: 0,
          rule: {
            maxImageWidth: 600,
            maxImageHeight: 600,
          },
        },
        'x-rules': {
          required: true,
          message: '请上传图片',
        },
      },
    },
  });

  const handleOpenBrandForm = (initialValues: any = {}) => {
    openModalForm({
      title: `${initialValues.id ? '编辑' : '新建'}品牌`,
      initialValues,
    });
  };

  return {
    openForm: handleOpenBrandForm,
    ModalFormElement,
  };
};
