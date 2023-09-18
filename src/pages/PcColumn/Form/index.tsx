import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { createAsyncFormActions, registerFormField, connect, mapStyledProps } from '@formily/antd';

import { useState, useEffect } from 'react';
import { history } from 'umi';

import { message } from 'antd';

import {
  TemplateSelectTree,
  modelNamespace,
  COLUMN_IMAGE_SHOW,
  PC_SKIP_ACTION_TYPE,
} from '@/pages/PcColumn/Constant';

import { useNavigationForm } from './navigationForm';

import { useBaseForm } from './useBaseForm';
import { useProductAdvForm } from './useProductAdvForm';

import type { PcColumnColumns } from '../Api';
import { addPcColumn, getPcColumnDetail, updatePcColumn, getSelfDefinePage } from '../Api';

import { TemplateImg } from '../component/TemplateImg';
import { AddNavigation } from '../component/AddNavigation';
import { ProductTable } from '../component/ProductTable';
import { LeftImg } from '../component/LeftImg';

registerFormField(
  'templateImg',
  connect({
    getProps: mapStyledProps,
  })(TemplateImg as any),
);

registerFormField(
  'addNavigation',
  connect({
    getProps: mapStyledProps,
  })(AddNavigation as any),
);

registerFormField(
  'productTable',
  connect({
    getProps: mapStyledProps,
  })(ProductTable as any),
);

registerFormField(
  'leftImg',
  connect({
    getProps: mapStyledProps,
  })(LeftImg as any),
);

export const formAction = createAsyncFormActions();
export default function PcColumnForm({
  match: {
    params: { id },
  },
}: any) {
  const {
    navigationList,
    categoriesTree,
    perNavigation,
    columnType,
    selectRowProducts,
    productAdvImgType,
  } = useStoreState(modelNamespace as 'pcColumn');

  const [pcColumnDetail, setPcColumnDetail] = useState({} as PcColumnColumns);
  const [selfDefineLists, setSelfDefineList] = useState({} as any);

  useEffect(() => {
    if (id) {
      getPcColumnDetail(id).then((res) => {
        const { data } = res;
        const { lists, type, actionType, actionValue } = data;
        if (actionType === 'PC_SPECIAL_CATEGORY') {
          data.categoryPathId = actionValue;
        }
        if (actionType === 'PC_SELF_DEFINE_PAGE') {
          data.selfDefinePage = actionValue;
        }
        if (type === 'PRODUCT_TEMPLATE') {
          lists.forEach((item: PcColumnColumns) => {
            item.minPrice = item.minPurchasePrice;
            item.maxPrice = item.maxVipPurchasePrice;
          });
        }
        if (type === 'NAVIGATION_TEMPLATE' || type === 'ADVERT_TEMPLATE') {
          lists.forEach((items: any) => {
            if (items.actionType === 'PC_SPECIAL_CATEGORY') {
              items.categoryPathId = items.categoryPathId?.split(',');
            }
          });
        } else if (data.actionType === 'PC_SPECIAL_CATEGORY') {
          data.categoryPathId = data.categoryPathId?.split(',');
        }
        if (type === 'ADVERT_TEMPLATE') {
          console.log('ADVERT_TEMPLATE', lists);
          lists.forEach((items: any) => {
            items.picUrl2 = items.picUrl;
          });
        }
        setPcColumnDetail(data);
        window.$fastDispatch((model) => model[modelNamespace].updateState, {
          navigationList: lists,
          tempRowProducts: lists,
          selectRowProducts: lists,
        });
      });
    }
  }, [id]);

  const { openForm, ModalFormElement } = useNavigationForm({
    categories: categoriesTree,
    navigationList,
    perNavigation,
    columnType,
    productAdvImgType,
  });

  const handleChangeColumn = (type: any) => {
    const reTemplateCode =
      type === 'ADVERT_TEMPLATE'
        ? 'PC_ADVERT_TEMPLATE_ONE'
        : type === 'PRODUCT_TEMPLATE'
        ? 'PC_PRODUCT_TEMPLATE_ONE'
        : 'PC_NAVIGATION_TEMPLATE_ONE';

    formAction.setFieldValue('templateCode', reTemplateCode);

    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      navigationList: [],
      tempRowProducts: [],
      selectRowProducts: [],
    });
  };

  const handleChangeTemplateCode = () => {
    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      navigationList: [],
      tempRowProducts: [],
      selectRowProducts: [],
    });
  };

  const { baseForm } = useBaseForm({
    handleChangeColumn,
    handleChangeTemplateCode,
  });

  const { productAdvForm } = useProductAdvForm({
    categoriesTree,
    selfDefineLists,
  });

  const handleAddPcColumn = (values: any) => {
    let newItem = {} as any;
    if (values.type === 'NAVIGATION_TEMPLATE' || values.type === 'ADVERT_TEMPLATE') {
      values.lists = navigationList.map((items: any) => {
        newItem = { ...items, id: undefined, picUrl: items.picUrl || items.picUrl2 };

        if (items.actionType === 'PC_SPECIAL_CATEGORY') {
          newItem.categoryPathId = items?.categoryPathId?.join(',');
        } else {
          newItem.categoryPathId = '';
        }
        if (items.actionType === 'PC_PRODUCT_DETAIL') {
          newItem.productInfoId = items?.productInfoId;
        } else {
          newItem.productInfoId = '';
        }
        if (items.actionType === 'PC_SELF_DEFINE_PAGE') {
          newItem.selfDefinePage = items?.selfDefinePage;
        } else {
          newItem.selfDefinePage = '';
        }

        return newItem;
      });
    } else if (values.type === 'PRODUCT_TEMPLATE') {
      if (values.actionType === 'PC_SPECIAL_CATEGORY') {
        values.categoryPathId = values?.categoryPathId?.join(',');
      } else {
        newItem.categoryPathId = '';
      }
      values.actionValue = values[PC_SKIP_ACTION_TYPE[values?.actionType]];

      const reSelectRowProducts = selectRowProducts.map((items: any) => ({
        ...items,
        isFirst: items?.isFirst ? 1 : '0' || '0',
        id: undefined,
        actionSort: items?.actionSort || '0',
      }));
      values.lists = reSelectRowProducts;
    }

    values.templateImg = undefined;
    values.flag = 2;
    values.id = id;

    if (values?.lists.length < 1) {
      const tips =
        values.type === 'NAVIGATION_TEMPLATE'
          ? '导航'
          : values.type === 'ADVERT_TEMPLATE'
          ? '广告'
          : '商品';
      return message.warning(`${tips}不能为空`);
    }

    const requestUrl = id ? updatePcColumn : addPcColumn;
    return requestUrl({ ...values }).then(() => {
      history.push('/pc/column');
    });
  };

  const props: NormalFormProps = {
    labelCol: 5,
    wrapperCol: 16,
    actions: formAction,
    initialValues: pcColumnDetail,
    onSubmit: handleAddPcColumn,
    effects: ($, { setFieldState }) => {
      $('onFieldValueChange', 'type').subscribe((state) => {
        window.$fastDispatch((model) => model[modelNamespace].updateState, {
          columnType: state.value,
        });
        if (state.value === 'ADVERT_TEMPLATE') {
          setFieldState('templateCode', (fieldState) => {
            fieldState.props.enum = TemplateSelectTree.COLUMN_ADV;
            fieldState.value = fieldState.value || 'PC_ADVERT_TEMPLATE_ONE';
          });
        } else if (state.value === 'PRODUCT_TEMPLATE') {
          setFieldState('templateCode', (fieldState) => {
            fieldState.props.enum = TemplateSelectTree.COLUMN_PRODUCT_TYPE;
            fieldState.value = fieldState.value || 'PC_PRODUCT_TEMPLATE_ONE';
          });
        } else if (state.value === 'NAVIGATION_TEMPLATE') {
          setFieldState('templateCode', (fieldState) => {
            fieldState.props.enum = TemplateSelectTree.COLUMN_NAVIGATION;
            fieldState.value = fieldState.value || 'PC_NAVIGATION_TEMPLATE_ONE';
          });
        }
      });

      $('onFieldValueChange', 'picUrl').subscribe((state) => {
        setFieldState('leftImg', (fieldState) => {
          fieldState.value = state.value;
        });
      });

      $('onFieldValueChange', 'templateCode').subscribe((state) => {
        window.$fastDispatch((model) => model[modelNamespace].updateState, {
          productAdvImgType: state.value,
        });
        setFieldState('templateImg', (fieldState) => {
          fieldState.value = COLUMN_IMAGE_SHOW[state.value];
        });
        setFieldState('actionValue', (fieldState) => {
          fieldState.value = undefined;
        });
        if (state.value === 'PC_PRODUCT_TEMPLATE_TWO') {
          setFieldState('picUrl', (fieldState: any) => {
            fieldState.props['x-props'].rule.maxImageHeight = 654;
            fieldState.props['x-props'].rule.maxImageWidth = 227;
            fieldState.props['x-props'].picKey = Math.random();
          });
        }
        if (state.value === 'PC_PRODUCT_TEMPLATE_FOUR') {
          setFieldState('picUrl', (fieldState: any) => {
            fieldState.props['x-props'].rule.maxImageHeight = 700;
            fieldState.props['x-props'].rule.maxImageWidth = 480;
            fieldState.props['x-props'].picKey = Math.random();
          });
        }
      });

      $('onFieldValueChange', 'actionType').subscribe((state) => {
        if (state.value === 'PC_SELF_DEFINE_PAGE') {
          getSelfDefinePage().then((res) => {
            const { data } = res;
            const selfDefineList = data?.map((items: any) => ({
              value: items.id,
              label: items.pageName,
            }));
            if (selfDefineList.length > 0) {
              setSelfDefineList(selfDefineList);
            }
          });
        }
      });
    },
    schema: {
      formLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          size: 'default',
          bordered: false,
          title: '添加/修改栏目',
        },
        properties: {
          informationLayout: baseForm,
          productAdvLayout: productAdvForm,

          navigationLayout: {
            type: 'object',
            'x-component': 'grid',
            properties: {
              addNavigationss: {
                type: 'addNavigation',
                display: false,
                'x-component-props': {
                  navigationList,
                  openForm: (e: any) => openForm({ ...e }),
                },
              },
            },
          },

          advLayout: {
            type: 'object',
            'x-component': 'grid',
            properties: {
              addAdv: {
                type: 'addNavigation',
                display: false,
                'x-component-props': {
                  navigationList,
                  openForm: (e: any) => openForm({ ...e }),
                },
              },
            },
          },

          addProductLayout: {
            type: 'object',
            'x-component': 'grid',
            properties: {
              productTable: {
                type: 'productTable',
                display: false,
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
            },
          },
        },
      },
    },
  };

  return (
    <>
      {ModalFormElement}

      <SchemaForm {...props} />
    </>
  );
}
