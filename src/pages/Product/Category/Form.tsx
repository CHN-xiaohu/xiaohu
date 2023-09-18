import { useModalForm } from '@/components/Business/Formily';

import { isStr } from '@/utils';

import { createAsyncFormActions } from '@formily/antd';

import type { CategoryColumns } from '../Api';
import { addOrUpdateCategory } from '../Api';
import type { CategoryTree } from '../models/Category';
import { loopFilterSpecifyLevelTreeNode } from '../Utils';

type Props = {
  categories: CategoryTree[];
  onSubmitSuccess: () => void;
};

const maxChildrenLevel = 2;

const handleFormatTreeData = (
  initialValues = {} as Partial<CategoryColumns>,
  categories: any[],
) => {
  let maxChildrenLevelCondition = maxChildrenLevel;
  let mySelfId = '';

  if (
    initialValues &&
    initialValues?.totalChildrenLevel !== maxChildrenLevel &&
    initialValues.parentId &&
    initialValues.id
  ) {
    const { currentLevel = 0, totalChildrenLevel = 0 } = initialValues;

    mySelfId = initialValues.id;

    maxChildrenLevelCondition =
      currentLevel - 1 === maxChildrenLevel
        ? maxChildrenLevel
        : maxChildrenLevel - totalChildrenLevel;
  }

  return loopFilterSpecifyLevelTreeNode(categories, mySelfId, maxChildrenLevelCondition);
};

const formActions = createAsyncFormActions();

export const useCategoryFrom = ({ categories = [], onSubmitSuccess }: Props) => {
  const handleCreateSubmit = (data: any) => addOrUpdateCategory({ ...data }).then(onSubmitSuccess);

  const handleUpdateSubmit = (values: any, data: any) => {
    data.numbering = data.numbering === null ? '' : data.numbering;
    return addOrUpdateCategory(isStr(values) ? { id: values, ...data } : values).then(
      onSubmitSuccess,
    );
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleCreateSubmit,
    onUpdate: handleUpdateSubmit,
    actions: formActions,
    schema: {
      parentId: {
        title: '上级类目',
        type: 'treeSelect',
        default: '0',
        'x-component-props': {
          treeData: [{ value: '0', title: '顶级分类', key: '0' }],
          // treeDefaultExpandAll: true,
          showSearch: true,
          treeNodeFilterProp: 'title',
        },
        'x-rules': {
          required: true,
          message: '请输入分类名称',
        },
      },

      name: {
        title: '类目名称',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入分类名称',
        },
        'x-rules': [
          {
            required: true,
            message: '请输入分类名称',
          },
          {
            pattern: /^.{1,20}$/,
            message: '名称不能超过 20 个字符',
          },
        ],
      },

      serial: {
        title: '类目排序',
        type: 'number',
        default: 0,
        'x-component-props': {
          max: 99999,
          min: 0,
          precision: 0,
          style: {
            width: 120,
          },
        },
        'x-rules': {
          required: true,
          message: '请输入排序',
        },
      },

      numbering: {
        title: '类目编码',
        type: 'number',
        'x-component-props': {
          placeholder: '请输入编号',
          max: 99999,
          min: 0,
          precision: 0,
          style: {
            width: 120,
          },
        },
      },

      icon: {
        title: '图片',
        type: 'uploadFile',
      },
    },
  });

  const handleOpenModelForm = (initialValues = {} as Partial<CategoryColumns>) => {
    const treeData: any[] = handleFormatTreeData(initialValues, categories);

    setTimeout(() => {
      formActions.setFieldState('parentId', (fieldState) => {
        fieldState.editable = !(
          initialValues?.totalChildrenLevel === maxChildrenLevel + 1 || !!initialValues.id
        );

        (fieldState.props as any)['x-component-props'].treeData = [
          { value: '0', title: '顶级分类', key: '0' },
          ...treeData,
        ];
      });
    });

    openModalForm({
      initialValues: { ...initialValues },
      title: `${initialValues.id ? '编辑' : '新建'}类目`,
    });
  };

  return {
    openForm: handleOpenModelForm,
    ModalFormElement,
  };
};
