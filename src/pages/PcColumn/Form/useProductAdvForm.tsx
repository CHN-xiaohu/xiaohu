import { TemplateSelectTree } from '@/pages/PcColumn/Constant';

type Props = {
  selfDefineLists: any[];
  categoriesTree: any[];
};

export const useProductAdvForm = ({ selfDefineLists, categoriesTree }: Props) => {
  const productAdvForm = {
    type: 'object',
    'x-component': 'card',
    display: false,
    'x-component-props': {
      title: '广告图',
      type: 'inner',
      className: 'product-category-container',
    },
    properties: {
      items1: {
        type: 'object',
        'x-component': 'grid',
        'x-component-props': {
          gutter: 24,
          cols: [8, 6, 5, 4],
        },
        properties: {
          leftImg: {
            type: 'leftImg',
          },
          picUrl: {
            title: '广告图',
            type: 'uploadFile',
            'x-props': {
              rule: {
                maxImageWidth: 227,
                maxImageHeight: 654,
              },
              placeholder: '上传图片',
            },
            'x-rules': {
              required: true,
              message: '请上传图片',
            },
          },
          actionType: {
            title: '跳转地址',
            type: 'string',
            enum: TemplateSelectTree.SKIP_TYPE.slice(0, 3),
            'x-component-props': {
              placeholder: '请选择',
            },
            'x-props': {
              labelCol: 7,
              wrapperCol: 15,
            },
            'x-rules': {
              required: true,
              message: '请选择跳转地址',
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
            ],
          },
          selfDefinePage: {
            type: 'string',
            display: false,
            'x-component-props': {
              placeholder: '请选择页面',
            },
            enum: selfDefineLists,
            'x-rules': {
              required: true,
              message: '自定义页面不能为空',
            },
          },
          categoryPathId: {
            type: 'cascader',
            display: false,
            'x-component-props': {
              placeholder: '请选择商品分类',
              options: categoriesTree,
              style: {
                marginLeft: '-610%',
                width: '450%',
              },
            },
            'x-rules': {
              required: true,
              message: '请选择商品分类',
            },
          },
        },
      },
    },
  };

  return {
    productAdvForm,
  } as any;
};
