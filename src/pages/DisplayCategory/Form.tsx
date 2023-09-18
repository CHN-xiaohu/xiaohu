import { useModalForm, createLinkageUtils } from '@/components/Business/Formily';

import { createAsyncFormActions } from '@formily/antd';

import { useRef } from 'react';

import type { displayCategoryColumn } from './Api';
import { addOrUpdateDisplayCategory, addMiniCategory, editSupplyCategory } from './Api';

const formActions = createAsyncFormActions();

type Props = {
  productCategories: any[];
  displayCategories: any[];
  parentCategories: any[];
  groupsList: any[];
  onAddSuccess: () => void;
};

export const useDisplayCategoryForm = ({
  productCategories = [],
  parentCategories = [],
  groupsList = [],
  onAddSuccess,
}: Props) => {
  const isMiniProgram = useRef(1);

  const handleCreateSubmit = (data: any) => {
    if (isMiniProgram.current === 2) {
      return addMiniCategory({ ...data }).then(onAddSuccess);
    }
    if (isMiniProgram.current === 1) {
      return addOrUpdateDisplayCategory({ ...data }).then(onAddSuccess);
    }

    data.categoryType = 0;
    return editSupplyCategory({ ...data }).then(onAddSuccess);
  };

  const handleUpdateSubmit = (id: string, params: any) => {
    if (isMiniProgram.current === 2) {
      return addMiniCategory({ ...params }).then(onAddSuccess);
    }
    if (isMiniProgram.current === 1) {
      return addOrUpdateDisplayCategory({ ...params }).then(onAddSuccess);
    }
    return editSupplyCategory({ ...params }).then(onAddSuccess);
  };

  const handleGetName = (value: any, record: any) => {
    formActions.setFieldValue('name', record?.name || record?.title);
  };

  const handleGetParentId = (value: any, record: any) => {
    formActions.setFieldValue('parentId', record.value);
    formActions.setFieldValue('icon', '');
  };

  const handleChangeCategoryType = () => {
    formActions.setFieldValue('groupId', undefined);
    formActions.setFieldValue('categoryId', undefined);
    formActions.setFieldValue('name', undefined);
  };

  const reName =
    window.location.pathname.split('/')[2] === 'miniCatetory' ||
    window.location.pathname.split('/')[2] === 'supplyCategory'
      ? {
          title: '分类别名',
          type: 'string',
          'x-component-props': {
            placeholder: '请输入分类名称',
          },
          'x-rules': [
            {
              pattern: /^.{1,10}$/,
              message: '名称不能超过 10 个字',
            },
            {
              required: true,
              message: '请输入分类名称',
            },
          ],
        }
      : {
          title: '分类别名',
          type: 'string',
          'x-component-props': {
            placeholder: '请输入分类名称',
          },
          'x-rules': [
            {
              pattern: /^.{1,20}$/,
              message: '名称不能超过 20 个字',
            },
            {
              required: true,
              message: '请输入分类名称',
            },
          ],
        };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateSubmit,
    onUpdate: handleUpdateSubmit,
    actions: formActions,
    isNativeAntdStyle: true,
    effects: ($, { setFieldState }) => {
      const linkage = createLinkageUtils();
      $('onFieldValueChange', 'categoryType').subscribe((state) => {
        setFieldState('serial', (fieldState) => {
          fieldState.title = state.value !== 1 ? '分类排序' : '分组排序';
        });
        setFieldState('name', (fieldState) => {
          fieldState.title = state.value !== 1 ? '分类别名' : '分组别名';
          (fieldState.props as any)['x-component-props'].placeholder =
            state.value !== 1 ? '请输入分类名称' : '请输入分组名称';
        });
        setFieldState('icon', (fieldState) => {
          fieldState.title = state.value !== 1 ? '分类图片' : '分组图片';
        });
      });
      $('onFieldValueChange', 'parentId').subscribe((state) => {
        const isParent = state?.value === '0';
        linkage.xComponentProp('icon', 'picKey', state?.value);
        linkage.xComponentProp('icon', 'placeholder', isParent ? '520*200' : '120*120');
        linkage.xComponentProp('icon', 'rule.maxImageWidth', isParent ? '520' : '120');
        linkage.xComponentProp('icon', 'rule.maxImageHeight', isParent ? '200' : '120');
      });
    },
    schema: {
      parentId: {
        title: '所属上级',
        type: 'treeSelect',
        'x-component-props': {
          placeholder: '请选择所属上级',
          treeData: [{ value: '0', title: '顶级分类', key: '0' }, ...parentCategories],
          treeDefaultExpandAll: true,
          showSearch: true,
          treeNodeFilterProp: 'title',
          onSelect: handleGetParentId,
        },
        'x-rules': {
          required: true,
          message: '请选择所属上级',
        },
      },
      categoryType: {
        title: '类型',
        type: 'radio',
        default: 0,
        'x-component-props': {
          onChange: handleChangeCategoryType,
          disabled: window.location.pathname.split('/')[2] === 'supplyCategory',
        },
        enum: [
          {
            label: '商品分类',
            value: 0,
          },
          {
            label: '商品分组',
            value: 1,
          },
        ],
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === 0 }}',
            target: 'categoryId',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === 1 }}',
            target: 'groupId',
          },
        ],
      },
      groupId: {
        title: '关联分组',
        type: 'string',
        enum: groupsList,
        'x-component-props': {
          placeholder: '请选择关联分组',
          onSelect: handleGetName,
        },
        'x-rules': {
          required: true,
          message: '请选择关联分组',
        },
      },
      categoryId: {
        title: '关联分类',
        type: 'treeSelect',
        'x-component-props': {
          placeholder: '请选择关联分类',
          treeData: [...productCategories],
          showSearch: true,
          treeNodeFilterProp: 'title',
          onSelect: handleGetName,
        },
        'x-rules': {
          required: true,
          message: '请选择关联分类',
        },
      },
      name: reName,
      serial: {
        title: '分类排序',
        type: 'number',
        'x-component-props': {
          placeholder: '请输入数字排序',
          max: 99999,
          min: 0,
          style: {
            width: 327,
          },
        },
        'x-rules': {
          required: true,
          message: '请输入数字排序',
          validator: (value: any) =>
            !/^(\d)+$/g.test(value) || Number(value) > 99999 || Number(value) < 0
              ? '请输入0~99999的数字'
              : null,
        },
      },
      icon: {
        title: '分类图片',
        type: 'uploadFile',
      },
    },
  });

  const handleOpenDrawerForm = (initialValues = {} as Partial<displayCategoryColumn>) => {
    // 1 运营类目管理 2 小程序运营类目管理 3 集采中心运营类目管理

    if (window.location.pathname.split('/')[2] === 'miniCatetory') {
      isMiniProgram.current = 2;
    } else if (window.location.pathname.split('/')[2] === 'supplyCategory') {
      isMiniProgram.current = 3;
    } else {
      isMiniProgram.current = 1;
    }

    setTimeout(() => {
      formActions.setFieldState('parentId', (state) => {
        (state.props as any)['x-component-props'].disabled = Number(initialValues.parentId) === 0;
        (state.props as any)['x-component-props'].treeData = [
          { value: '0', title: '顶级分类', key: '0' },
          ...parentCategories,
        ];
      });
      formActions.setFieldState('categoryId', (state) => {
        (state.props as any)['x-component-props'].treeData = [...productCategories];
      });
      formActions.setFieldState('groupId', (state) => {
        (state.props as any).enum = groupsList;
      });
    });

    openModalForm({
      title: `${initialValues.id ? '编辑' : '新建'}展示类目`,
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenDrawerForm,
    ModalFormElement,
  };
};
