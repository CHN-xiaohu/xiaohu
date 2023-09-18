/* eslint-disable max-len */
import type { ActionType } from '@/pages/Programa/Constant';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { Icons } from '@/components/Library/Icon';

import { useEffect, useMemo } from 'react';
import type {
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
import { Button } from 'antd';

import styles from './style.less';

import { navigatorSchema } from '../schema/navigatorSchema';

type Props = {
  onChange: (value: any) => any;
};

type Actions = ISchemaFormActions | ISchemaFormAsyncActions;

const dic = ['A', 'B', 'C', 'D', 'E', 'A1', 'B1', 'C1', 'D1', 'E1'];

const ArrayField = (props: any) => {
  const { value, path, mutators } = props;
  const renderRemove = () => (
    <Button
      className={styles['arrayGroup-btn__item']}
      onClick={() => {
        Array(5)
          .fill('')
          .forEach(() => {
            mutators.remove(5);
          });
      }}
    >
      <Icons type="DeleteOutlined" />
      移除图文导航
    </Button>
  );

  const renderAdd = () => (
    <Button
      className={styles['arrayGroup-btn__item']}
      onClick={() => {
        Array(5)
          .fill('')
          .forEach(() => {
            mutators.push();
          });
      }}
    >
      <Icons type="PlusOutlined" />
      添加图文导航
    </Button>
  );
  let key = 1;
  return (
    <div className={styles['form-wrapper']}>
      {value.map((_: any, index: number) => {
        key += 1;
        return (
          <div key={key}>
            <div className={styles['form-item']}>
              <div className={styles['form-field']}>
                <SchemaField path={FormPath.parse(path).concat(index)} />
              </div>
            </div>
            {index === 4 && value.length < 10 && renderAdd()}
            {index === 4 && value.length === 10 && renderRemove()}
          </div>
        );
      })}
    </div>
  );
};

export const action = createAsyncFormActions();
const ArrayForm = ({ onChange }: Props) => {
  const { categoriesTree } = useStoreState('programa');

  useEffect(() => {
    action.setFieldState('*.*.actionValue', (state) => {
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
    const hide = (name: string) => {
      setFieldState(name, (state) => {
        state.editable = false;
      });
    };

    const setProps = (name: string, props: object) => {
      setFieldState(name, (state) => {
        state.editable = true;
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
      const setTitle = (name: string, title: string) => {
        action.setFieldState(name, (state) => {
          state.props.title = title;
        });
      };
      action.getFormState((state: any) => {
        const { lists } = state.values;
        onChange && onChange(lists);

        // 动态设置标题
        (lists || []).forEach((_: never, i: number) => {
          setTitle(`lists.${i}.picUrl`, `图片(位置${dic[i]})`);
        });
      });
    });

    $('onFieldValueChange', 'lists.*.actionType').subscribe((fieldState) => {
      const actionType = fieldState.value as ActionType;
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
            placeholder: '请选择1111',
            actionType,
          });
          break;
        case 'CATEGORY_PAGE':
          setProps(actionValue, {
            type: 'tree',
            placeholder: '请选择',
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
          setProps(actionValue, {
            type: 'string',
            placeholder: '请输入',
          });
          setValue(actionValue, '');
          setTimeout(() => {
            hide(actionValue);
          }, 1);
      }
    });
  };

  return (
    <SchemaForm
      labelCol={{ span: 10 }}
      // wrapperCol={{ span: 13 }}
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
    >
      <SchemaMarkupField
        type="array"
        name="lists"
        items={{
          type: 'object',
          properties: navigatorSchema,
        }}
        default={Array(5).fill({})}
      />
    </SchemaForm>
  );
};

export default ArrayForm;
