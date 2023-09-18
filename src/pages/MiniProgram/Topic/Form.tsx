import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { registerFormField, connect, mapStyledProps, createFormActions } from '@formily/antd';

import { useState } from 'react';
import { Card, Switch, Modal, Popover, message } from 'antd';
import { history } from 'umi';
import { useDispatch } from 'dva';
import { cloneDeep } from 'lodash';
import { QuestionCircleOutlined } from '@ant-design/icons';

import ProductTable from './component/productTable';
import ProductModal from './component/productModal';

import { addTopic, updateTopic } from './Api';

import oneImg from '../images/templateOne.jpg';
import twoImg from '../images/templateTwo.jpg';
import threeImg from '../images/templateThree.jpg';

import styles from '../index.less';

registerFormField(
  'productLists',
  connect({
    getProps: mapStyledProps,
  })(ProductTable as any),
);

export default function MiniProgramTopicForm({
  match: {
    params: { id },
  },
}: any) {
  const formActions = createFormActions();
  const dispatch = useDispatch();
  const {
    tempRowProducts,
    selectedProductRowKeys,
    selectRowProducts,
    topicDetail,
  }: any = useStoreState('topic');
  const [isGoChoost, setGoChoose] = useState(false);
  const [productId, setProductId] = useState('');
  const [isGoDel, setGoDel] = useState(false);
  const [firstPage, setIsFirst] = useState(topicDetail.firstPage || true);
  const [templateImg, setTemplateImg] = useState(1);

  const productTable = {
    tempRowProducts,
    selectedProductRowKeys,
    selectRowProducts,
    isGoDel,
    handleGoChoose() {
      setGoChoose(true);
    },

    onOpenProductModal() {
      let selectKey;
      if (selectRowProducts) {
        selectKey = selectRowProducts.map((i: { id: any }) => i?.id);
      }
      dispatch({
        type: 'topic/updateState',
        payload: {
          selectedProductRowKeys: selectKey,
        },
      });
    },

    handleToggleIsFirst(prodId: any) {
      const newList = cloneDeep(selectRowProducts);
      newList.forEach((items: any) => {
        if (items.id === prodId) {
          items.firstPage = !items.firstPage;
          items.sort = 0;
        }
      });
      if (newList.filter((item: { firstPage: boolean }) => item.firstPage === true).length < 10) {
        dispatch({
          type: 'topic/updateState',
          payload: {
            selectRowProducts: newList,
          },
        });
      } else {
        message.warning('首页最多可以展示9个商品');
      }
      // dispatch({
      //   type: 'topic/updateState',
      //   payload: {
      //     selectRowProducts: newList,
      //   },
      // })
    },
    handleGoRemove(prodId: any) {
      setProductId(prodId);
      setGoDel(true);
    },

    handleSortChange(value: any, prodId: any) {
      const newList = cloneDeep(selectRowProducts);
      newList.forEach((items: any) => {
        if (items.id === prodId) {
          items.sort = value;
        }
      });
      dispatch({
        type: 'topic/updateState',
        payload: {
          selectRowProducts: newList,
        },
      });
    },
  };

  const productOpt = {
    title: '选择商品',
    visible: isGoChoost,
    width: 1000,
    onCancel() {
      setGoChoose(false);
    },
    onOk() {
      const productsKey = tempRowProducts.map((i: { id: any }) => i?.id);
      dispatch({
        type: 'topic/updateState',
        payload: {
          selectRowProducts: tempRowProducts,
          selectedProductRowKeys: productsKey,
        },
      });
      setGoChoose(false);
    },
  };

  const delProduct = {
    title: '提示',
    width: 250,
    visible: isGoDel,
    onCancel() {
      setGoDel(false);
    },
    onOk() {
      setGoDel(false);
      const newList = cloneDeep(selectRowProducts);
      const newKeyList = cloneDeep(selectedProductRowKeys);
      newList.splice(
        newList.findIndex((item: any) => item.id === productId),
        1,
      );
      newKeyList.splice(
        newKeyList.findIndex((item: string) => item === productId),
        1,
      );
      dispatch({
        type: 'topic/updateState',
        payload: {
          selectRowProducts: newList,
          tempRowProducts: newList,
          selectedProductRowKeys: newKeyList,
        },
      });
    },
  };

  const handleGoSubmit = (values: any) => {
    const lists = selectRowProducts.map((items: any) => ({
      sort: items.sort || 0,
      firstPage: items.firstPage || false,
      productInfoId: items.id,
    }));
    const params = {
      ...values,
      firstPage,
    };
    params.lists = lists;
    params.productNum = lists.length;

    if (id) {
      params.id = id;
      updateTopic(params).then(() => {
        history.push('/miniProgram/topic');
      });
    } else {
      addTopic(params).then(() => {
        history.push('/miniProgram/topic');
      });
    }
  };

  const handleChangeShow = (value: any) => {
    setIsFirst(value);
  };

  const props: NormalFormProps = {
    actions: formActions,
    onSubmit: handleGoSubmit,
    initialValues: topicDetail,
    effects: ($, { setFieldState }) => {
      $('onFieldValueChange', 'template').subscribe((state) => {
        setTemplateImg(state.value);
        setFieldState('topicIcon', (fieldState) => {
          fieldState.visible = state.value !== 'TEMPLATE_ONE';
        });
      });
    },
    schema: {
      formLayout: {
        type: 'object',
        'x-component': 'block',
        'x-component-props': {
          size: 'default',
        },
        properties: {
          topicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '专题信息',
              type: 'inner',
              className: 'product-category-container',
            },
            properties: {
              item1: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8, 8],
                },
                properties: {
                  name: {
                    title: '专题名称',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '请输入专题名称',
                      style: {
                        width: '80%',
                      },
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: '专题名称不能为空',
                      },
                      {
                        pattern: /^[^\s]{1,15}$/,
                        message: '专题名称为必填（1,15个字）',
                      },
                    ],
                  },
                  template: {
                    title: '专题模板',
                    type: 'string',
                    // default: 'TEMPLATE_ONE',
                    'x-component-props': {
                      placeholder: '请选择专题模板',
                      style: {
                        width: '80%',
                      },
                    },
                    'x-rules': {
                      required: true,
                      message: '专题模板不能为空',
                    },
                    enum: [
                      {
                        label: '模板一',
                        value: 'TEMPLATE_ONE',
                      },
                      {
                        label: '模板二',
                        value: 'TEMPLATE_TWO',
                      },
                      {
                        label: '模板三',
                        value: 'TEMPLATE_THREE',
                      },
                    ],
                  },
                  sort: {
                    title: '专题排序',
                    type: 'number',
                    'x-component-props': {
                      placeholder: '请输入专题排序（0-99999）',
                      max: 99999,
                      min: 0,
                      precision: 0,
                      style: {
                        width: '80%',
                      },
                    },
                  },
                },
              },
              item2: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8, 8],
                },
                properties: {
                  firstPic: {
                    title: '专题首页图',
                    type: 'uploadFile',
                    'x-component-props': {
                      placeholder: '702*300',
                    },
                    'x-props': {
                      // labelCol: 5,
                      // wrapperCol: 18,
                      rule: {
                        maxImageWidth: 702,
                        maxImageHeight: 300,
                      },
                    },
                    'x-rules': {
                      required: true,
                      message: '请上传专题首页图',
                    },
                  },
                  topicIcon: {
                    title: '专题图标',
                    type: 'uploadFile',
                    'x-component-props': {
                      placeholder: '40*40',
                    },
                    'x-props': {
                      // labelCol: 4,
                      // wrapperCol: 17,
                      rule: {
                        maxImageWidth: 40,
                        maxImageHeight: 40,
                      },
                    },
                  },
                },
              },
              description: {
                title: '专题描述',
                type: 'textarea',
                'x-component-props': {
                  placeholder: '请输入专题描述',
                  rows: 4,
                },
                'x-props': {
                  labelCol: 1.8,
                  wrapperCol: 12,
                },
              },
            },
          },
          productLayout: {
            type: 'object',
            'x-component': 'grid',
            properties: {
              productList: {
                type: 'productLists',
                'x-component-props': {
                  ...productTable,
                },
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
                  children: '提交数据',
                },
              },
            },
          },
        },
      },
    },
  };

  const handleChangeImg = (type: any) => {
    const types = {
      TEMPLATE_ONE: oneImg,
      TEMPLATE_TWO: twoImg,
      TEMPLATE_THREE: threeImg,
    }[type];
    return types;
  };

  const images = <img src={handleChangeImg(templateImg)} alt="" />;

  return (
    <Card>
      <Popover content={images} trigger="hover">
        <QuestionCircleOutlined className={styles.icon} />
      </Popover>
      <Modal {...delProduct}>确认删除此专题商品？</Modal>
      首页展示：
      <Switch
        checkedChildren="是"
        unCheckedChildren="否"
        onChange={handleChangeShow}
        checked={firstPage}
      />
      <SchemaForm {...props} />
      <ProductModal {...productOpt} />
    </Card>
  );
}
