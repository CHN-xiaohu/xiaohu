import type {
  IFormExtendsEffectSelector,
  ISchemaFormAsyncActions,
  ISchemaFormActions,
} from '@formily/antd';
import SchemaForm, { createAsyncFormActions } from '@formily/antd';

type Props = {
  initialValues?: any;
  defaultLength?: number;
  onChange: (value: any) => any;
};

export const action = createAsyncFormActions();

type Actions = ISchemaFormActions | ISchemaFormAsyncActions;

const ProductForm = ({ initialValues, onChange }: Props) => {
  const arrayFormEffect = ($: IFormExtendsEffectSelector<any, Actions>) => {
    $('onFieldValueChange').subscribe(() => {
      action.getFormState((state: any) => {
        onChange(state.values.picUrl);
      });
    });
  };
  return (
    <SchemaForm
      actions={action}
      effects={arrayFormEffect}
      initialValues={initialValues}
      schema={{
        type: 'object',
        properties: {
          picUrl: {
            type: 'uploadFile',
            title: '图片(位置A)',
            required: true,
            'x-component-props': {
              placeholder: '720 * 204',
              rule: {
                maxImageWidth: 720,
                maxImageHeight: 204,
              },
            },
          },
        },
      }}
      inline
    />
  );
};

export default ProductForm;
