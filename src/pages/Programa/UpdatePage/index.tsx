import type { SchemaFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';
import type { ActionType } from '@/pages/Programa/Constant';
import {
  COLUMN_TYPE,
  TemplateSelectTree,
  ADV_TEMPLATE_SIZE,
  TemplateWithArray,
} from '@/pages/Programa/Constant';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import * as api from '@/pages/Programa/Api';
import { generateCategoriesParentTree } from '@/pages/Programa/Utils';

import type {
  ISchemaFormActions,
  ISchemaFormAsyncActions,
  IFormExtendsEffectSelector,
} from '@formily/antd';
import { createAsyncFormActions, registerFormField, connect, mapStyledProps } from '@formily/antd';
import { history, useDispatch } from 'umi';
import { Card, Button, message, Spin } from 'antd';
import { useEffect, useState, useRef } from 'react';

import { handleSubstringTextAfter, handleSubstringTextBefore } from '@/utils';

import { cloneDeep } from 'lodash';

import { advSchema } from './components/Form/schema/advSchema';

import PreviewLayout from './components/Layout';
import NavigatorForm, { action as navAction } from './components/Form/NavigatorForm';
import AdvForm, { action as advAction } from './components/Form/AdvForm';
import ArrayForm, { action as arrayAction } from './components/Form/ArrayForm';
import ProductForm, { action as prodAction } from './components/Form/ProductForm/form';
import ProductAddForm from './components/Form/ProductForm';
import ProductTable from './components/Form/ProductForm/ProductTable';
import CategoriesTable from './components/Form/CategoryForm/CategoriesTable';
import CategoriesAddForm from './components/Form/CategoryForm/CategoriesForm';

import styles from './style.less';
import TreeWithString from './components/TreeWithString';

import { hasRepeat } from '../Utils';

registerFormField(
  'treeWithString',
  connect({
    getProps: mapStyledProps,
  })(TreeWithString as any),
);

const dic = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const TypeWithoutDetail = [
  'PRODUCT_TEMPLATE_ONE',
  'CATEGORY_TEMPLATE_ONE',
  'CATEGORY_TEMPLATE_ONE',
];

export const formAction = createAsyncFormActions();

export const resetForm = (option: any = {}) => {
  const options = {
    validate: false,
    ...option,
  };
  formAction.reset(options);
  navAction.reset(options);
  arrayAction.reset(options);
  advAction.reset(options);
};

// 由于商品详情页select的 ID 和 name 得分开2个字段传，所以前后处理下格式，手动合并成对象
const transformValue = (list: any[]) =>
  list.map((item) => {
    if ((item.actionType as ActionType) === 'PRODUCT_DETAIL_PAGE') {
      return {
        ...item,
        actionValue: {
          name: item.productName,
          id: item.actionValue,
        },
      };
    }
    if ((item.actionType as ActionType) === 'GROUP_PURCHASE_PAGE') {
      return {
        ...item,
        actionValue: {
          name: handleSubstringTextAfter(item.actionValue, ','),
          id: handleSubstringTextBefore(item.actionValue, ','),
        },
      };
    }
    if ((item.actionType as ActionType) === 'DESIGN_DETAIL') {
      return {
        ...item,
        actionValue: {
          name: handleSubstringTextAfter(item.actionValue, ','),
          id: handleSubstringTextBefore(item.actionValue, ','),
        },
      };
    }
    if ((item.actionType as ActionType) === 'ACTION_PAGE') {
      return {
        ...item,
        actionValue: {
          name: handleSubstringTextAfter(item.actionValue, ','),
          id: handleSubstringTextBefore(item.actionValue, ','),
        },
      };
    }
    if ((item.actionType as ActionType) === 'PRODUCT_GROUP') {
      return {
        ...item,
        actionValue: {
          name: handleSubstringTextAfter(item.actionValue, ','),
          id: handleSubstringTextBefore(item.actionValue, ','),
        },
      };
    }
    if ((item.actionType as ActionType) === 'SCHEME_TAG_SEARCH') {
      return {
        ...item,
        actionValue: {
          name: item.productName,
          id: item.actionValue,
        },
      };
    }
    return item;
  });

// 同上，把{name: string, id: string} 拆成
// actionValue: id, productName: name 的形式
const transformValueToBE = (list: any[]) =>
  list.map((item) => {
    if ((item.actionType as ActionType) === 'PRODUCT_DETAIL_PAGE') {
      return {
        ...item,
        actionValue: item.actionValue.id,
        productName: item.actionValue.name,
      };
    }
    if ((item.actionType as ActionType) === 'GROUP_PURCHASE_PAGE') {
      return {
        ...item,
        actionValue: `${item.actionValue.id},${item.actionValue.name}`,
        productName: item.actionValue.name,
      };
    }
    if ((item.actionType as ActionType) === 'DESIGN_DETAIL') {
      return {
        ...item,
        actionValue: `${item.actionValue.id},${item.actionValue.name}`,
        productName: item.actionValue.name,
      };
    }
    if ((item.actionType as ActionType) === 'ACTION_PAGE') {
      return {
        ...item,
        actionValue: `${item.actionValue.id},${item.actionValue.name}`,
        productName: item.actionValue.name,
      };
    }
    if ((item.actionType as ActionType) === 'PRODUCT_GROUP') {
      return {
        ...item,
        actionValue: `${item.actionValue.id},${item.actionValue.name}`,
        productName: item.actionValue.name,
      };
    }
    if ((item.actionType as ActionType) === 'SCHEME_TAG_SEARCH') {
      return {
        ...item,
        actionValue: item.actionValue.id,
        productName: item.actionValue.name,
      };
    }
    return item;
  });

type Actions = ISchemaFormActions | ISchemaFormAsyncActions;

const ProgramaUpdatePage = ({
  match: {
    params: { id },
  },
}: any) => {
  const dispatch = useDispatch();
  const {
    type,
    templateCode,
    previewList,
    selectRowCategories,
    selectRowProducts,
    picUrl,
    originCategoryList,
    selectedCategoryRowKeys,
    selectedProductRowKeys,
  } = useStoreState('programa');
  const isDetail = !!id;

  const updateState = (payload: any) => {
    dispatch({
      type: 'programa/updateState',
      payload,
    });
  };

  const [showLoading, setLoading] = useState(false);
  const isNav = (subType: string) => subType && subType.includes('NAV');
  const isAdv = (subType: string) => subType && subType.includes('ADV');
  const isProduct = (subType: string) => subType && subType.includes('PRODUCT');
  const isCategory = (subType: string) => subType && subType.includes('CATEGORY');
  const isTemplateType = (subType: string, targetString: string) =>
    subType && subType.includes(targetString);

  const initRequest = () => {
    setLoading(true);
    api.getColumnDetail(id).then((res) => {
      const { data } = res;
      const { column, acvertInfos, categoryInfos, advertInfos, navigationInfos, productInfos } =
        data;
      const { templateCode: _templateCode, type: _type } = column;
      // if (_templateCode === 'ADVERT_TEMPLATE_FIVE') {
      //   const setFiveCache = {
      //     templateCode: _templateCode,
      //     previewList: advertInfos,
      //   } as any;
      //   localStorage.setItem('fiveCache', JSON.stringify(setFiveCache));
      // }
      const categoryFilter = advertInfos.length > 0 ? advertInfos : navigationInfos;
      categoryFilter?.forEach((items: any) => {
        if (items.actionType === 'CATEGORY_PAGE') {
          const filterResult = generateCategoriesParentTree(originCategoryList, items.actionValue);
          if (filterResult === undefined || filterResult === '') {
            items.actionValue = '';
          }
        }
      });

      dispatch({
        type: 'programa/updateState',
        payload: {
          templateCode: _templateCode,
          type: _type,
          previewList: categoryFilter,
          column,
          acvertInfos,
          selectRowProducts: productInfos,
          selectedProductRowKeys: productInfos.map((e: any) => e.productInfoId),
          selectedCategoryRowKeys: categoryInfos.map((e: any) => e.thirdCategoryId),
          selectRowCategories: categoryInfos,
          temp: categoryInfos,
          tempRowProducts: productInfos,
          tempSelectedRowCategories: categoryInfos,
        },
      });

      formAction.setFormState((state) => {
        state.values = column;
      });

      formAction.setFieldValue('templateCode', _templateCode);

      // 根据栏目类型设置表单
      setTimeout(() => {
        if (isAdv(_templateCode)) {
          const newList = transformValue(categoryFilter);
          if (TemplateWithArray.includes(_templateCode)) {
            arrayAction.setFieldValue('lists', cloneDeep(newList));
          } else {
            // advAction.setFieldValue('lists', cloneDeep(newList));
            advAction.setFieldValue('lists', cloneDeep(newList));
          }
        }

        if (isNav(_templateCode)) {
          const newList = transformValue(categoryFilter);
          navAction.setFieldValue('lists', cloneDeep(newList));
        }

        if (productInfos.length) {
          prodAction.setFieldValue('picUrl', column.picUrl);
        }

        setLoading(false);
      }, 0);
    });
  };

  useEffect(() => {
    if (id) {
      initRequest();
    }
  }, [id]);

  const prevSelectedProductRowKeys = useRef([]);
  const prevSelectedCategoriesRowKeys = useRef([]);

  useEffect(() => {
    prevSelectedCategoriesRowKeys.current = selectedCategoryRowKeys;
    prevSelectedProductRowKeys.current = selectedProductRowKeys;
  }, [selectedProductRowKeys, selectedCategoryRowKeys]);

  const TitleComponent = (
    <>
      <span>{COLUMN_TYPE[type]}</span>
      {isProduct(type) && (
        <Button
          type="primary"
          size="small"
          className={styles['programa-title-btn']}
          onClick={() => {
            updateState({
              showProduction: true,
              prevSelectedProductRowKeys: prevSelectedProductRowKeys.current,
            });
          }}
        >
          添加商品
        </Button>
      )}
      {isCategory(type) && (
        <Button
          size="small"
          type="primary"
          className={styles['programa-title-btn']}
          onClick={() =>
            updateState({
              showCategory: true,
              prevSelectedCategoriesRowKeys: prevSelectedCategoriesRowKeys.current,
            })
          }
        >
          添加分类
        </Button>
      )}
    </>
  );

  const schema: SchemaFormProps['schema'] = {
    block: {
      'x-component': 'card',
      'x-component-props': {
        title: '添加/修改栏目',
        bordered: false,
      },
      properties: {
        TOP_BLOCK: {
          'x-component': 'block',
          'x-component-props': {
            title: '栏目信息',
            inline: 'true',
          },
          properties: {
            grid: {
              'x-component': 'grid',
              'x-component-props': {
                cols: [8, 8, 8],
              },
              properties: {
                name: {
                  type: 'string',
                  title: '栏目标题',
                  'x-component-props': {
                    placeholder: '请输入栏目标题',
                  },
                  'x-rules': {
                    required: true,
                    validator: (value) => {
                      if (!value) {
                        return '标题不能为空';
                      }
                      if (value.length > 10) {
                        return '标题最多不能超过10个字';
                      }
                      return null;
                    },
                  },
                },
                type: {
                  type: 'string',
                  title: '栏目类型',
                  'x-component-props': {
                    placeholder: '清选择栏目类型',
                  },
                  enum: TemplateSelectTree.COLUMN_TYPE,
                  default: 'ADVERT_TEMPLATE',
                  'x-rules': {
                    required: true,
                  },
                },
                sort: {
                  type: 'number',
                  title: '位置排序',
                  placeholder: '请输入数字',
                  'x-rules': {
                    validator: (value) => {
                      if (
                        typeof Number(value) === 'number' &&
                        Number.isNaN(Number(value)) &&
                        value
                      ) {
                        return '只能输入数字';
                      }
                      if (Number(value) > 99999 || value < 0) {
                        return '只能输入0~99999范围的数字';
                      }
                      return null;
                    },
                  },
                  'x-component-props': {
                    width: '100%',
                    style: {
                      width: '100%',
                    },
                  },
                },
              },
            },
          },
        },
        MIDDLE_BLOCK: {
          'x-component': 'block',
          'x-component-props': {
            inline: 'true',
            title: TitleComponent,
          } as any,
          properties: {
            grid: {
              'x-component': 'grid',
              'x-component-props': {
                cols: [8, 8, 8],
              },
              properties: {
                templateCode: {
                  type: 'string',
                  title: '栏目模板',
                  default: 'ADVERT_TEMPLATE_ONE',
                  'x-component-props': {
                    placeholder: '栏目模板',
                  },
                  enum: TemplateSelectTree[type],
                  required: true,
                },
                EXAMPLE_FIELD: {
                  type: 'object',
                  title: (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://shimo.im/docs/YJkVP6k3h3KVrD3d/read"
                    >
                      查看示例
                    </a>
                  ),
                },
                picUrl: {
                  type: 'uploadFile',
                  title: '栏目图片',
                },
              },
            },
          },
        },
      },
    },
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    const validate = await formAction.validate();
    if (validate.errors.length) {
      return message.error('请输入必填项');
    }
    if (isProduct(templateCode)) {
      if (!selectRowProducts.length) {
        return message.error('请添加商品');
      }

      if (hasRepeat(selectRowProducts, 'actionSort', 'isFirst')) {
        return message.error('商品排序不能重复');
      }
    }

    if (isCategory(templateCode)) {
      if (!selectRowCategories.length) {
        return message.error('请添加分类');
      }

      if (hasRepeat(selectRowCategories, 'actionSort')) {
        return message.error('类目排序不能重复');
      }
    }

    let list = previewList;
    // === 图片上传模块的手动校验 ===
    if (
      isTemplateType(templateCode, 'PRODUCT_TEMPLATE_THREE') ||
      isTemplateType(templateCode, 'PRODUCT_TEMPLATE_TWO')
    ) {
      const { errors } = await prodAction.validate();
      if (errors.length) {
        return null;
      }
    }

    if (isAdv(templateCode)) {
      let validates;
      if (TemplateWithArray.includes(templateCode)) {
        validates = await arrayAction.validate();
        const state = await arrayAction.getFormState();
        list = transformValueToBE(state.values.lists);
      } else {
        validates = await advAction.validate();
        const state = await advAction.getFormState();
        list = transformValueToBE(state.values.lists);
      }
      const { errors } = validates;

      if (errors.length) {
        return null;
      }
    }

    if (isNav(templateCode)) {
      const { errors } = await navAction.validate();
      if (errors.length) {
        return null;
      }
      const state = await navAction.getFormState();
      list = transformValueToBE(state.values.lists);
    }

    // === 手动校验结束 ===

    // 判断 lists 参数用图片列表还是商品/分类/促销列表
    if (isProduct(templateCode)) {
      if (selectRowProducts.find((e: any) => e.isFirst && !e.actionSort)) {
        return message.error('请输入商品展示排序');
      }
      list = selectRowProducts.map((e: any) => ({
        ...e,
        actionSort: e.actionSort ? Number(e.actionSort) : null,
        isFirst: Number(!!e.isFirst),
      }));
    }

    if (isCategory(templateCode)) {
      list = selectRowCategories;
    }

    formAction.getFormState((state) => {
      const realPicUrl = isAdv(templateCode) ? (state.values as any)?.picUrl : picUrl;
      const item = {
        id,
        ...state.values,
        sort: (state.values as any).sort || 99999,
        picUrl: realPicUrl,
        lists: list,
        flag: 1,
      };

      if (isDetail) {
        return api.updateColumn(item).then(() => {
          message.success('修改成功');
          localStorage.removeItem('fiveCache');
          localStorage.removeItem('templateCodeRef');
          setTimeout(() => {
            history.push('/app/programa/list');
          }, 1000);
        });
      }
      return api.createColumn(item).then(() => {
        message.success('创建成功');
        localStorage.removeItem('templateCodeRef');
        setTimeout(() => {
          history.push('/app/programa/list');
        }, 1000);
      });
    });
  };

  const handleFormEffect = (
    $: IFormExtendsEffectSelector<any, Actions>,
    { setFieldState }: Actions,
  ) => {
    const hide = (name: string) => {
      setFieldState(name, (state) => {
        state.visible = false;
      });
    };
    const show = (name: string) => {
      setFieldState(name, (state) => {
        state.visible = true;
      });
    };
    const setEnum = (name: string, value: any) => {
      setFieldState(name, (state) => {
        state.props.enum = value;
      });
    };
    const setValue = (name: string, value: any) => {
      setFieldState(name, (state) => {
        state.value = value;
      });
    };

    $('onFieldValueChange', 'type').subscribe((state) => {
      updateState({
        type: state.value,
        templateCode: TemplateSelectTree[state.value] && TemplateSelectTree[state.value][0].value,
      });

      setEnum('templateCode', TemplateSelectTree[state.value]);
    });
    $('onFieldInputChange', 'type').subscribe((state) => {
      // 改变栏目模板列表内容，默认选中第一个
      setValue(
        'templateCode',
        TemplateSelectTree[state.value] && TemplateSelectTree[state.value][0].value,
      );
    });

    // 根据选择的栏目模板，渲染图片列表
    $('onFieldValueChange', 'templateCode').subscribe((state) => {
      updateState({
        previewList: [{}],
      });

      // 只有这3个需要栏目图片字段
      const showPicType = ['ADVERT_TEMPLATE_ONE', 'ADVERT_TEMPLATE_TWO', 'ADVERT_TEMPLATE_THREE'];
      if (showPicType.includes(state.value)) {
        setFieldState('picUrl', (subState) => {
          subState.props['x-props'] = {
            rule: {
              maxImageWidth: 750,
              maxImageHeight: 84,
            },
            placeholder: '750 * 84',
          };
          subState.props['x-component-props'] = {
            placeholder: '750 * 84',
          };
        });
        show('picUrl');
      } else {
        hide('picUrl');
      }

      if (isAdv(state.value) && !TemplateWithArray.includes(state.value)) {
        // 广告默认填充空对象
        Promise.resolve().then(() => {
          advAction.setFieldState('lists', (subState) => {
            subState.value = Array(ADV_TEMPLATE_SIZE[state.value].default).fill({});
            // subState.values = Array(ADV_TEMPLATE_SIZE[state.value].default).fill({});
          });
          // 遍历设置校验规则、标题和占位符
          Array(ADV_TEMPLATE_SIZE[state.value].default)
            .fill('')
            .forEach((e, i) => {
              advAction.setFieldState(`lists.${i}.*.picUrl`, (subState) => {
                const rule = ADV_TEMPLATE_SIZE[state.value].rule[i];
                const { maxImageWidth, maxImageHeight } = rule;
                subState.props.title = `图片(位置${dic[i]})`;
                const placeholder = `${maxImageWidth} x ${maxImageHeight}`;
                subState.props['x-component-props'] = {
                  ...(subState.props['x-component-props'] || {}),
                  placeholder,
                  rule,
                };
              });
            });
        });
      }

      if (TemplateWithArray.includes(state.value)) {
        localStorage.setItem('templateCodeRef', state.value);
      } else {
        localStorage.removeItem('templateCodeRef');
      }

      // AD2 和 AD8 是数组 需要 添加/删除 按钮
      if (TemplateWithArray.includes(state.value)) {
        arrayAction.setFieldState('lists', (subState) => {
          subState.value = Array(ADV_TEMPLATE_SIZE[state.value].default).fill({
            picUrl: undefined,
          });
        });
      }

      if (isNav(state.value)) {
        Promise.resolve().then(() => {
          navAction.setFieldState('lists', (subState) => {
            subState.value = Array(5).fill({
              picUrl: undefined,
            });
          });
        });
      }

      dispatch({
        type: 'programa/updateState',
        payload: {
          templateCode: state.value,
        },
      });
    });
  };
  const handleAdvChange = (value: any) => {
    setTimeout(() => {
      dispatch({
        type: 'programa/updateState',
        payload: {
          previewList: value,
        },
      });
    });
  };

  const handleNavChange = (value: any) => {
    dispatch({
      type: 'programa/updateState',
      payload: {
        previewList: value,
      },
    });
  };

  const handleProductChange = (value: any) => {
    dispatch({
      type: 'programa/updateState',
      payload: {
        previewList: [{ picUrl: value }],
        picUrl: value,
      },
    });
  };

  return (
    <Card>
      <Spin spinning={showLoading}>
        <div style={{ border: '1px solid #eee', marginBottom: '20px' }}>
          <SchemaForm
            actions={formAction}
            effects={handleFormEffect}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
            schema={schema}
            onSubmit={handleSubmit}
          />
          <div
            className={
              TypeWithoutDetail.includes(templateCode)
                ? styles['programa-detail__hide']
                : styles['programa-detail']
            }
          >
            <div className={styles['programa-detail__preview']}>
              <PreviewLayout />
            </div>
            <div className={styles['programa-detail__form']}>
              {isNav(templateCode) && <NavigatorForm onChange={handleNavChange} />}
              {isAdv(templateCode) && !TemplateWithArray.includes(templateCode) && (
                <AdvForm defaultLength={3} onChange={handleAdvChange} />
              )}

              {TemplateWithArray.includes(templateCode) && (
                <ArrayForm
                  templateCode={templateCode}
                  schema={advSchema}
                  onChange={handleAdvChange}
                />
              )}
              {isProduct(templateCode) && !isTemplateType(templateCode, 'ONE') && (
                <ProductForm onChange={handleProductChange} />
              )}
            </div>
          </div>
        </div>
        {(isProduct(type) || isCategory(type)) && (
          <div className={styles['programa-detail-table']}>
            <ProductAddForm />
            <ProductTable />
            <CategoriesAddForm />
            <CategoriesTable />
          </div>
        )}
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" className={styles['programa-detail-btn']} onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </Spin>
    </Card>
  );
};

export default ProgramaUpdatePage;
