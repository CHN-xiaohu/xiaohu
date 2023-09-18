/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/ban-types */
import type { SchemaFormProps, IFieldState } from '@/components/Business/Formily';
import { createLinkageUtils } from '@/components/Business/Formily';
import { FormEffectHooks } from '@formily/antd';
import { isArr } from '@spark-build/web-utils';

import { labelLinkage } from './labelLinkage';

import { liveLinkageEffects } from './liveLinkage';
import { projectLinkage } from './projectLinkage';
import { tagsLinkage } from './tagsLinkage';

const { onFormInit$ } = FormEffectHooks;

const getImgSize = (type: string) =>
  ({
    APP_FIRST_SCREEN: { height: '600', width: '600', placeholder: '600*600' },
    APP_SPLASH_SCREEN: { height: '1334', width: '750', placeholder: '750*1334' },
    MINI_FIRST_BANNER: { height: '329', width: '660', placeholder: '660*329' },
    MINI_FIRST_RECOMMEND: { height: '170', width: '342', placeholder: '342*170' },
  }[type || 'APP_FIRST_SCREEN']);

const isId = (v: any) => /^[0-9]+$/.test(v);

type Effects = (p: {
  handleProduct: Function;
  handleGroupPurchase: Function;
  handleSpecialPage: Function;
  handleByBusinessCode: Function;
  projectName: String;
}) => SchemaFormProps['effects'];

// 从旧处理中抽出来
export const effects: Effects =
  ({
    handleProduct,
    handleGroupPurchase,
    handleSpecialPage,
    handleByBusinessCode,
    // projectName,
  }) =>
  ($, { setFieldState, getFieldValue }) => {
    const linkage = createLinkageUtils();

    const wrapperHandleProduct = async () => {
      const chooseProductValue = await getFieldValue('chooseProduct');

      handleProduct(chooseProductValue, isId(chooseProductValue));
    };

    const wrapperHandleGroupPurchase = async () => {
      const chooseProductValue = await getFieldValue('chooseProduct');

      handleGroupPurchase(chooseProductValue, isId(chooseProductValue));
    };

    const wrapperHandleSpecialPage = async () => {
      const chooseSpecialPageValue = await getFieldValue('chooseSpecialPage');

      handleSpecialPage(chooseSpecialPageValue, isId(chooseSpecialPageValue));
    };

    const wrapperHandleByBusinessCode = async () => {
      const byBusinessCodeValue = await getFieldValue('byBusinessCode');

      handleByBusinessCode(byBusinessCodeValue, isId(byBusinessCodeValue));
    };

    $('onFieldValueChange', 'location').subscribe((state) => {
      const result = getImgSize(state.value);

      linkage.xComponentProp('picUrl', 'placeholder', result.placeholder);
      linkage.xComponentProp('picUrl', 'rule.maxImageHeight', result.height);
      linkage.xComponentProp('picUrl', 'rule.maxImageWidth', result.width);
      linkage.xComponentProp('picUrl', 'rule.maxImageWidth', result.width);
      linkage.xComponentProp('picUrl', 'picKey', result.width);
    });

    /** ---------- skipLocation 联动处理  ------* */
    // todo: 待完善 skipLocation 的值类型
    const hitTheSkipLocationValue = async (value: string | string[]) => {
      const v = isArr(value) ? value : [value];

      return v.includes(await getFieldValue('skipLocation'));
    };

    // 因为 skipValue field 会被频繁修改，所以在每一次对 skipValue field 进行操作之前，都将它重置到在 schema 中的初始状态
    const resetSkipValueFieldState = (cb?: (f: IFieldState) => void) => {
      setFieldState('skipValue', (fieldState) => {
        fieldState.visible = true;
        fieldState.type = 'string';
        fieldState.value = undefined;
        fieldState.title = '跳转地址';
        fieldState.props['x-component'] = undefined;
        fieldState.props['x-component-props'] = {
          placeholder: '请输跳转地址',
          visible: false,
        };
        fieldState.props['x-rules'] = [
          {
            message: '请输入正确的格式',
            // eslint-disable-next-line max-len
            pattern:
              /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
          },
        ];

        // 清除可能存在的异常
        fieldState.errors = undefined as unknown as string[];

        cb?.(fieldState);
      });
    };

    const skipLocationDefaultSetting = () => {
      setFieldState('chooseSpecialPage', (fieldState: any) => {
        fieldState.visible = false;
        fieldState.value = '';
        fieldState.props.enum = [];
      });
      setFieldState('chooseProduct', (fieldState: any) => {
        fieldState.visible = false;
        fieldState.value = '';
        fieldState.props.enum = [];
      });
      setFieldState('groupPurchase', (fieldState: any) => {
        fieldState.props.required = false;
        fieldState.visible = false;
        fieldState.value = undefined;
        fieldState.props.enum = [];
      });
      setFieldState('byBusinessCode', (fieldState: any) => {
        fieldState.props.required = false;
        fieldState.visible = false;
        fieldState.value = undefined;
        fieldState.props.enum = [];
      });
      setFieldState('categoryPathId', (fieldState: any) => {
        fieldState.props.required = false;
        fieldState.visible = false;
        fieldState.value = undefined;
        fieldState.props.enum = [];
      });
    };

    // 直播间联动处理
    $('onFieldValueChange', 'skipLocation').subscribe(async (state: any) => {
      if (await hitTheSkipLocationValue(['BROADCAST_LIST', 'BROADCAST_DETAIL'])) {
        liveLinkageEffects(resetSkipValueFieldState, state.value);
        skipLocationDefaultSetting();
        return;
      }
      if (await hitTheSkipLocationValue(['DESIGN_DETAIL'])) {
        const chooseProductValue = await getFieldValue('skipValueName');
        projectLinkage(resetSkipValueFieldState, state.value, chooseProductValue);
        skipLocationDefaultSetting();
        return;
      }
      if (await hitTheSkipLocationValue(['SCHEME_TAG_SEARCH'])) {
        const chooseProductValue = await getFieldValue('skipValueName');
        const chooseProductId = await getFieldValue('skipValue');
        tagsLinkage(resetSkipValueFieldState, state.value, chooseProductValue, chooseProductId);
        skipLocationDefaultSetting();
        return;
      }
      if (await hitTheSkipLocationValue(['SPECIFY_LABEL'])) {
        const chooseProductValue = await getFieldValue('skipValueName');
        labelLinkage(resetSkipValueFieldState, state.value, chooseProductValue);
        skipLocationDefaultSetting();
        return;
      }

      if (await hitTheSkipLocationValue(['ACTION_FORM_PAGE'])) {
        resetSkipValueFieldState((fieldState) => {
          fieldState.visible = false;
        });
        setFieldState('chooseProduct', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('chooseSpecialPage', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('groupPurchase', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('byBusinessCode', (fieldState: any) => {
          fieldState.props.required = true;
          fieldState.visible = true;
        });
        setFieldState('categoryPathId', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
      } else if (await hitTheSkipLocationValue(['APP_PRODUCT_DETAIL', 'MINI_PRODUCT_DETAIL'])) {
        resetSkipValueFieldState((fieldState) => {
          fieldState.visible = false;
        });

        setFieldState('chooseProduct', (fieldState: any) => {
          fieldState.props.required = true;
          fieldState.visible = true;
        });
        setFieldState('chooseSpecialPage', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('groupPurchase', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('byBusinessCode', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('categoryPathId', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        wrapperHandleProduct();
      } else if (await hitTheSkipLocationValue('MINI_SPECIAL_PAGE')) {
        setFieldState('chooseProduct', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });

        resetSkipValueFieldState((fieldState) => {
          fieldState.visible = false;
        });

        setFieldState('chooseSpecialPage', (fieldState: any) => {
          fieldState.props.required = true;
          fieldState.visible = true;
        });

        wrapperHandleSpecialPage();

        setFieldState('groupPurchase', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('byBusinessCode', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('categoryPathId', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
      } else if (await hitTheSkipLocationValue('GROUP_PURCHASE_PAGE')) {
        setFieldState('chooseProduct', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });

        resetSkipValueFieldState((fieldState) => {
          fieldState.visible = false;
        });

        setFieldState('chooseSpecialPage', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });

        setFieldState('groupPurchase', (fieldState: any) => {
          fieldState.props.required = true;
          fieldState.visible = true;
        });

        setFieldState('byBusinessCode', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('categoryPathId', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });

        wrapperHandleGroupPurchase();
      } else if (await hitTheSkipLocationValue('APP_EXTERNAL')) {
        setFieldState('chooseSpecialPage', (fieldState: any) => {
          fieldState.visible = false;
          fieldState.value = '';
          fieldState.props.enum = [];
        });
        setFieldState('chooseProduct', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });

        resetSkipValueFieldState((fieldState) => {
          fieldState.props.required = true;
        });

        setFieldState('groupPurchase', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('byBusinessCode', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('categoryPathId', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
      } else if (await hitTheSkipLocationValue('SPECIFY_CATEGORY')) {
        setFieldState('chooseSpecialPage', (fieldState: any) => {
          fieldState.visible = false;
          fieldState.value = '';
          fieldState.props.enum = [];
        });
        setFieldState('chooseProduct', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });

        resetSkipValueFieldState((fieldState) => {
          fieldState.visible = false;
        });

        setFieldState('groupPurchase', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('byBusinessCode', (fieldState: any) => {
          fieldState.props.required = false;
          fieldState.visible = false;
          fieldState.value = undefined;
          fieldState.props.enum = [];
        });
        setFieldState('categoryPathId', (fieldState: any) => {
          fieldState.props.required = true;
          fieldState.visible = true;
        });
      } else {
        resetSkipValueFieldState((fieldState) => {
          fieldState.visible = false;
        });

        skipLocationDefaultSetting();
      }
    });
    /** ---------- skipLocation 联动处理 end  ------* */

    $('onFieldValueChange', 'chooseProduct').subscribe(async () => {
      if (await hitTheSkipLocationValue(['APP_PRODUCT_DETAIL', 'MINI_PRODUCT_DETAIL'])) {
        wrapperHandleProduct();
      }
    });

    $('onFieldValueChange', 'chooseSpecialPage').subscribe(async () => {
      if (await hitTheSkipLocationValue('MINI_SPECIAL_PAGE')) {
        wrapperHandleSpecialPage();
      }
    });

    $('onFieldValueChange', 'groupPurchase').subscribe(async () => {
      if (await hitTheSkipLocationValue('GROUP_PURCHASE_PAGE')) {
        wrapperHandleGroupPurchase();
      }
    });

    $('onFieldValueChange', 'byBusinessCode').subscribe(async () => {
      if (await hitTheSkipLocationValue('ACTION_FORM_PAGE')) {
        wrapperHandleByBusinessCode();
      }
    });

    onFormInit$().subscribe(() => {
      linkage.visible('chooseSpecialPage', false);
      linkage.visible('groupPurchase', false);
    });
  };
