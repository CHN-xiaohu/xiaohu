/* eslint-disable max-len */
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import type { TemplateCodeType } from '@/pages/Programa/Constant';
import { Icons } from '@/components/Library/Icon';

import type {
  IMarkupSchemaFieldProps,
  IFormExtendsEffectSelector,
  ISchemaFormAsyncActions,
  ISchemaFormActions,
} from '@formily/antd';
import SchemaForm, {
  SchemaMarkupField,
  createAsyncFormActions,
  SchemaField,
  FormPath,
} from '@formily/antd';
import { useEffect, useMemo, useRef } from 'react';

import styles from './style.less';

type Props = {
  schema: Record<string, IMarkupSchemaFieldProps>;
  templateCode: string;
  onChange: (value: any) => any;
};

const dic = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const action = createAsyncFormActions();

type Actions = ISchemaFormActions | ISchemaFormAsyncActions;
const ArrayField = ({ value, path, mutators }: any) => {
  const renderRemove = (index: number) => (
    <Icons
      type="DeleteOutlined"
      onClick={() => index >= 1 && mutators.remove(index)}
      className={styles['list-btn__item']}
      style={{ color: 'red' }}
    />
  );

  const renderAdd = () =>
    value.length < 8 && (
      <Icons
        type="PlusOutlined"
        onClick={() => {
          mutators.push();
        }}
        className={styles['list-btn__item']}
        style={{ color: '#000' }}
      />
    );

  return (
    <div>
      {value &&
        value.map((_: any, index: number) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={styles['list-item__wrapper']}
          >
            <SchemaField path={FormPath.parse(path).concat(index)} />
            <div className={styles['list-btn__wrapper']}>
              {value.length < 8 && renderAdd()}
              {index > 0 && renderRemove(index)}
            </div>
          </div>
        ))}
    </div>
  );
};

const ArrayForm = ({ schema, onChange, templateCode }: Props) => {
  const { categoriesTree, previewList } = useStoreState('programa');

  const templateCodeRef = useRef([] as any);
  templateCodeRef.current = templateCode;

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
    { setFieldState }: Actions,
  ) => {
    const setTitle = (name: string, title: string) => {
      action.setFieldState(name, (state) => {
        state.props.title = title;
      });
    };

    const hide = (name: string) => {
      setFieldState(name, (state) => {
        state.editable = false;
      });
    };

    const setProps = (name: string, props: any) => {
      const type = [
        'EXTERNAL_SKIP_PAGE',
        'PRODUCT_DETAIL_PAGE',
        'GROUP_PURCHASE_PAGE',
        'DESIGN_DETAIL',
        'CATEGORY_PAGE',
        'SCHEME_TAG_SEARCH',
      ];
      setFieldState(name, (state) => {
        state.editable = type.includes(props.actionType);
        state.props['x-props'] = {
          ...state.props['x-props'],
          ...props,
        };
        state.props['x-rules'] = props['x-rules'];
      });
    };

    const setValue = (name: string, values: any) => {
      setFieldState(name, (state) => {
        state.value = values;
      });
    };

    $('onFieldValueChange').subscribe(() => {
      // 监听值变化动态生成规则
      action.getFormState(async (state: any) => {
        const { lists } = state.values;

        const listss = lists?.map((item: any) => ({ picUrl: item?.picUrl }));
        if (JSON.stringify(listss) !== JSON.stringify(previewList)) {
          window.$fastDispatch((model) => model.programa.updateState, {
            previewList: listss,
          });
        }

        let maxImageWidth: number;
        let maxImageHeight: number;
        switch (localStorage.getItem('templateCodeRef') as TemplateCodeType) {
          case 'ADVERT_TEMPLATE_FOUR':
            maxImageWidth = 750;
            maxImageHeight = 360;
            break;
          case 'ADVERT_TEMPLATE_EIGHT':
            maxImageWidth = 680;
            maxImageHeight = 192;
            break;
          default:
            maxImageWidth = 1920;
            maxImageHeight = 1080;
            break;
        }
        (lists || []).forEach((_: never, i: number) => {
          setTitle(`lists.${i}.picUrl`, `图片(位置${dic[i]})`);
          const rule = {
            maxImageWidth,
            maxImageHeight,
          };
          const placeholder = `${maxImageWidth} x ${maxImageHeight}`;

          action.setFieldState(`lists.${i}.picUrl`, (subState) => {
            subState.props['x-component-props'] = {
              ...subState.props['x-component-props'],
              rule,
              placeholder,
            };
          });
        });
      });
    });

    $('onFieldValueChange', 'lists.*.picUrl').subscribe(() => {
      action.getFormState((formState) => {
        onChange && onChange((formState.values as any).lists);
      });
    });

    const setTypeString = (name: string) => {
      setProps(name, {
        type: 'string',
        placeholder: '请输入',
      });
    };

    $('onFieldValueChange', 'lists.*.actionType').subscribe((fieldState) => {
      const actionType = fieldState.value;
      const actionValue = FormPath.transform(
        fieldState.name,
        /\d+/,
        (i) => `lists.${i}.actionValue`,
      );

      switch (actionType) {
        case 'EXTERNAL_SKIP_PAGE':
          setProps(actionValue, {
            type: 'string',
            placeholder: '请输入',
            actionType,
            'x-rules': {
              message: '请输入正确的格式',
              // eslint-disable-next-line max-len
              pattern:
                /(((^https?:(?:\/\/)?)(?:[-;:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\\+\\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\\+~%\\/.\w-_]*)?\??(?:[-\\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
            },
          });
          break;
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
        case 'CATEGORY_PAGE':
          setProps(actionValue, {
            type: 'tree',
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
          setTypeString(actionValue);
          setValue(actionValue, '');
          setTimeout(() => {
            hide(actionValue);
          });
      }
    });
  };

  return (
    <div>
      <SchemaForm
        actions={action}
        fields={
          useMemo(
            () => ({
              array: ArrayField,
            }),
            [],
          ) as any
        }
        effects={arrayFormEffect}
      >
        <SchemaMarkupField
          type="array"
          name="lists"
          items={{
            type: 'object',
            properties: schema,
          }}
          default={Array(1).fill({})}
        />
      </SchemaForm>
    </div>
  );
};

export default ArrayForm;
