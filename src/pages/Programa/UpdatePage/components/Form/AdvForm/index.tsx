import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useEffect, useMemo } from 'react';
import type {
  IFormExtendsEffectSelector,
  ISchemaFormAsyncActions,
  ISchemaFormActions,
  ISchemaFieldComponentProps,
} from '@formily/antd';
import SchemaForm, { createAsyncFormActions, SchemaField, FormPath } from '@formily/antd';

import { toArr } from '@formily/antd/esm/shared';
import { cloneDeepByJSON } from '@/utils';

import { advSchema } from '../schema/advSchema';

type Props = {
  defaultLength?: number;
  onChange: (value: any) => any;
};

export const action = createAsyncFormActions();

type Actions = ISchemaFormActions | ISchemaFormAsyncActions;

const ArrayField = ({ value, path }: ISchemaFieldComponentProps) => (
  <>
    {toArr(value).map((_: any, index: number) => {
      return (
        <div style={{ display: 'flex' }} key={FormPath.parse(path).concat(index).toString()}>
          <SchemaField path={FormPath.parse(path).concat(index)} />
        </div>
      );
    })}
  </>
);

const AdvForm = ({ onChange, defaultLength }: Props) => {
  const { categoriesTree } = useStoreState('programa');

  useEffect(() => {
    action.setFieldState('lists.*.*.actionValue', (state) => {
      state.props['x-props'] = {
        ...state.props['x-props'],
        treeData: categoriesTree,
      };
    });
  }, [categoriesTree]);

  const arrayFormEffect = (
    $: IFormExtendsEffectSelector<any, Actions>,
    { setFieldState, getFormState }: Actions,
  ) => {
    const show = (name: string) => {
      setFieldState(name, (state) => {
        state.editable = true;
      });
    };
    const hide = (name: string) => {
      setFieldState(name, (state) => {
        state.editable = false;
      });
    };
    const setProps = (name: string, props: any) => {
      // const fiveCaches = JSON.parse(localStorage.getItem('fiveCache') || '{}');
      // let isClear = false;
      // if (fiveCaches) {
      //   console.log('actionType0', props.actionType);
      //   const { previewList } = JSON.parse(localStorage.getItem('fiveCache') || '{}');
      //   isClear = previewList && previewList[0].actionType !== props.actionType;
      // }

      show(name);
      setFieldState(name, (state) => {
        state.props['x-props'] = {
          ...state.props['x-props'],
          ...props,
        };
        state.props['x-rules'] = props['x-rules'];
      });
      // isClear
      //   ? setFieldState(name, (state) => {
      //       state.props['x-props'] = {
      //         ...state.props['x-props'],
      //         ...props,
      //       };
      //       state.props['x-rules'] = props['x-rules'];
      //       state.value = null;
      //     })
      //   : setFieldState(name, (state) => {
      //       state.props['x-props'] = {
      //         ...state.props['x-props'],
      //         ...props,
      //       };
      //       state.props['x-rules'] = props['x-rules'];
      //     });
    };

    $('onFieldValueChange', 'lists.*.*').subscribe(() => {
      getFormState((formState) => {
        onChange((formState.values as { lists: any[] }).lists);
      });
    });

    const setTypeString = (name: string, actionType: string) => {
      action.clearErrors(name);
      setProps(name, {
        type: 'string',
        placeholder: '请输入',
        actionType,
        value: '',
      });
    };

    const setExternalSkipPage = (name: string, actionType: string) => {
      action.clearErrors(name);
      setProps(name, {
        type: 'string',
        placeholder: '请输入',
        actionType,
        value: '',
        'x-rules': {
          message: '请输入正确的格式',
          // eslint-disable-next-line max-len
          pattern:
            /(((^https?:(?:\/\/)?)(?:[-;:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\\+\\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\\+~%\\/.\w-_]*)?\??(?:[-\\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
        },
      });
    };

    const setValue = (name: string, values: any) => {
      setFieldState(name, (state) => {
        state.value = values;
      });
    };

    // const setActivitySkipPage = (name: string, actionType: string) => {
    //   show(name);
    //   setFieldState(name, (state) => {
    //     state.props['x-props'] = {
    //       ...state.props['x-props'],
    //       type: 'select',
    //       placeholder: '请选择',
    //       actionType,
    //     };
    //     // state.value = '';
    //   });
    //   setTimeout(() => {
    //     action.clearErrors(name);
    //   });
    // };

    $('onFieldInputChange', 'lists.*.actionType').subscribe((fieldState) => {
      const actionValue = FormPath.transform(
        fieldState.name,
        /\d+/,
        (i) => `lists.${i}.actionValue`,
      );
      setValue(actionValue, '');
    });

    $('onFieldValueChange', 'lists.*.actionType').subscribe((fieldState) => {
      const actionType = fieldState.value;
      const actionValue = FormPath.transform(
        fieldState.name,
        /\d+/,
        (i) => `lists.${i}.actionValue`,
      );
      switch (actionType) {
        case 'EXTERNAL_SKIP_PAGE':
          // setTypeString(actionValue, actionType);
          setExternalSkipPage(actionValue, actionType);
          break;
        // case 'SPECIAL_TOPIC_PAGE':
        //   setProps(actionValue, {
        //     type: 'string',
        //     placeholder: '请输入',
        //   })
        //   break
        case 'CATEGORY_PAGE':
          setProps(actionValue, {
            type: 'tree',
            placeholder: '请选择',
            actionType,
          });
          break;
        // case 'PRODUCT_GROUP':
        // case 'ACTION_PAGE':
        //   setActivitySkipPage(actionValue, actionType);
        //   break;
        case 'PRODUCT_DETAIL_PAGE':
        case 'GROUP_PURCHASE_PAGE':
        case 'DESIGN_DETAIL':
        case 'ACTION_PAGE':
        case 'PRODUCT_GROUP':
          setProps(actionValue, {
            type: 'select',
            placeholder: '请选择',
            actionType,
          });
          break;
        case 'SCHEME_TAG_SEARCH':
          setProps(actionValue, {
            type: 'modal',
            placeholder: '请选择',
            actionType,
          });
          break;
        default:
          setValue(actionValue, '');
          setTypeString(actionValue, actionType);
          setTimeout(() => {
            hide(actionValue);
          });
      }
    });
  };

  return (
    <div>
      <SchemaForm
        fields={
          useMemo(
            () => ({
              array: ArrayField,
            }),
            [],
          ) as any
        }
        actions={action}
        effects={arrayFormEffect}
        schema={{
          type: 'object',
          properties: {
            lists: {
              type: 'array',
              items: {
                type: 'object',
                properties: advSchema,
                'x-props': {},
              },
              default: cloneDeepByJSON(Array(defaultLength).fill({})),
            },
          },
        }}
      />
    </div>
  );
};

export default AdvForm;
