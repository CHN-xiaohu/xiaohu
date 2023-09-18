import { useModalForm } from '@/components/Business/Formily';
import { useRef } from 'react';
import { createAsyncFormActions, registerFormField, connect, mapStyledProps } from '@formily/antd';

import { message } from 'antd';

import { TemplateSelectTree, modelNamespace } from '../Constant';

import SelectProducts from '../component/selectProducts';
import ImgSizeTips from '../component/ImgSizeTips';

import { getSelfDefinePage } from '../Api';

registerFormField(
  'selectProducts',
  connect({
    getProps: mapStyledProps,
  })(SelectProducts as any),
);

registerFormField(
  'imgSizeTips',
  connect({
    getProps: mapStyledProps,
  })(ImgSizeTips as any),
);

const formActions = createAsyncFormActions();

type Props = {
  categories: any[];
  navigationList: any[];
  perNavigation: any;
  columnType: string;
  productAdvImgType: string;
};

export const useNavigationForm = ({
  categories,
  columnType,
  perNavigation,
  navigationList,
  productAdvImgType,
}: Props) => {
  const reNavigation = useRef({} as any);
  reNavigation.current = perNavigation;

  const reProductAdvImgType = useRef({});
  reProductAdvImgType.current = productAdvImgType;

  const navigationLists = useRef([] as any);
  navigationLists.current = navigationList;

  const initialMap = useRef({} as any);

  const promise = new Promise<void | void>((resolve) => {
    resolve();
  });

  const handleSubmit = (values: any) => {
    return promise.then(() => {
      if (!values.id) {
        if (navigationLists.current.length > 7) {
          return message.warning('最多添加八个！');
        }
        values.id = new Date().getTime().toString();
        navigationLists.current = navigationLists.current.concat([values]);
      } else {
        navigationLists.current = navigationLists.current.map((items: any) => {
          if (items.id === values.id) {
            return { ...values };
          }
          return { ...items };
        });
      }

      return window.$fastDispatch((model) => model[modelNamespace].updateState, {
        navigationList: navigationLists.current,
      });
    });
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onCreate: handleSubmit,
    actions: formActions,
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
    isNativeAntdStyle: true,
    effects: ($, { setFieldState }) => {
      $('onFieldValueChange', 'actionType').subscribe((state: any) => {
        if (state.value === 'PC_SELF_DEFINE_PAGE') {
          getSelfDefinePage().then((res) => {
            const { data } = res;
            const selfDefineList = data.map((items: any) => ({
              value: items.id,
              label: items.pageName,
            }));
            if (selfDefineList.length > 0) {
              setFieldState('selfDefinePage', (fState) => {
                fState.props.enum = selfDefineList;
              });
            }
          });
        }
      });
      $('onFieldValueChange', 'categoryPathId').subscribe((state: any) => {
        const { values } = state;
        if (values.length > 1) {
          setFieldState('treeNamePath', (filedsValue: any) => {
            (filedsValue as any).value = values[1][values[1]?.length - 1]?.treeNamePath;
          });
        }
      });
      $('onFieldValueChange', 'selfDefinePage').subscribe((state: any) => {
        const { values } = state;
        setFieldState('selfDefineName', (filedsValue: any) => {
          (filedsValue as any).value = values[1]?.title;
        });
      });
      $('onFieldValueChange', 'productInfoId').subscribe((state: any) => {
        const { values } = state;
        setFieldState('productName', (filedsValue: any) => {
          (filedsValue as any).value = values[1]?.label;
        });
      });
    },
    schema: {
      id: {
        type: 'string',
        display: false,
      },
      picUrl: {
        title: '广告图片',
        type: 'uploadFile',
        description: '尺寸：1200x430',
        display: false,
        'x-rules': {
          required: true,
          message: '请上传图片',
        },
        'x-component-props': {
          placeholder: '1200x430',
          rule: {
            maxImageWidth: 1200,
            maxImageHeight: 430,
          },
        },
      },
      picUrl2: {
        title: '广告图片',
        type: 'uploadFile',
        description: '建议尺寸：1920*930',
        display: false,
        'x-rules': {
          required: true,
          message: '请上传图片',
        },
        'x-component-props': {
          placeholder: '1920x930',
          rule: {
            maxImageWidth: 1920,
            maxImageHeight: 930,
          },
        },
      },
      title: {
        title: '导航名称',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入指定导航名称',
        },
        'x-rules': {
          required: true,
          range: [1, 6],
        },
      },
      actionType: {
        title: '跳转类型',
        type: 'string',
        'x-component-props': {
          placeholder: '请选择跳转类型',
        },
        enum: TemplateSelectTree.SKIP_TYPE,
        'x-rules': {
          required: true,
          message: '请选择跳转类型',
        },
        'x-linkages': [
          {
            type: 'value:display',
            condition: '{{ $self.value === "PC_SPECIAL_CATEGORY" }}',
            target: 'categoryPathId',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === "PC_SELF_DEFINE_PAGE" }}',
            target: 'selfDefinePage',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === "PC_PRODUCT_DETAIL" }}',
            target: 'productInfoId',
          },
          {
            type: 'value:display',
            condition: '{{ $self.value === "EXTERNAL_SKIP_PAGE" }}',
            target: 'actionValue',
          },
        ],
      },
      actionValue: {
        title: '链接',
        type: 'string',
        'x-component-props': {
          placeholder: '请输入链接',
        },
        'x-rules': [
          {
            format: 'url',
            message: '域名格式不合法',
          },
          {
            required: true,
            message: '链接不能为空',
          },
          {
            message: '链接名称为必填（1-100个字符）',
            pattern: /^[^\s]{1,100}$/,
          },
        ],
      },
      categoryPathId: {
        title: '商品分类',
        type: 'cascader',
        display: false,
        'x-component-props': {
          showSearch: true,
          placeholder: '请选择商品分类',
          changeOnSelect: true,
          expandTrigger: 'hover',
          // options: categories,
        },
        'x-rules': {
          required: true,
          message: '请选择商品分类',
        },
      },
      selfDefinePage: {
        title: '自定义页面',
        type: 'string',
        display: false,
        'x-component-props': {
          placeholder: '请选择页面',
        },
        'x-rules': {
          required: true,
          message: '自定义页面不能为空',
        },
      },
      productInfoId: {
        title: '商品详情页',
        type: 'selectProducts',
        display: false,
        enum: [],
        'x-rules': {
          required: true,
          message: '请选择商品详情页',
        },
      },
      actionSort: {
        title: '排序',
        type: 'number',
        'x-component-props': {
          placeholder: '请输入页面排序',
          min: 0,
          max: 999999,
          step: 1,
        },
        default: 999999,
        'x-props': {
          style: {
            width: '100%',
          },
        },
      },
      treeNamePath: {
        type: 'string',
        display: false,
      },
      selfDefineName: {
        type: 'string',
        display: false,
      },
      productName: {
        type: 'string',
        display: false,
      },
      advTips: {
        type: 'imgSizeTips',
        display: false,
      },
    },
  });

  const handleOpenForm = (initialValues: any = {}) => {
    initialMap.current = initialValues;

    setTimeout(() => {
      formActions.setFieldState('picUrl', (fieldState) => {
        fieldState.display = reProductAdvImgType.current === 'PC_ADVERT_TEMPLATE_ONE';
      });

      formActions.setFieldState('picUrl2', (fieldState) => {
        fieldState.value =
          reProductAdvImgType.current === 'PC_ADVERT_TEMPLATE_TWO' ? initialValues.picUrl : '';
        fieldState.display = reProductAdvImgType.current === 'PC_ADVERT_TEMPLATE_TWO';
      });

      formActions.setFieldState('title', (fieldState) => {
        fieldState.display = columnType === 'NAVIGATION_TEMPLATE';
      });

      formActions.setFieldState('advTips', (fieldState) => {
        fieldState.display = columnType === 'ADVERT_TEMPLATE';
      });
      // formActions.setFieldState('categoryPathId', )

      formActions.setFieldState('categoryPathId', (fieldState) => {
        (fieldState.props as any)['x-component-props'].options = [...categories];
      });
    });

    openModalForm({
      title: columnType === 'ADVERT_TEMPLATE' ? '新增广告' : '新增导航',
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenForm,
    ModalFormElement,
  };
};
