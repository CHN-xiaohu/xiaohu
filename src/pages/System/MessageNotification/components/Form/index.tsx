import { useCallback, useRef } from 'react';
import { useModalForm } from '@/components/Business/Formily';
import { createAsyncFormActions } from '@formily/antd';

import { useMount } from 'ahooks';

import { ButtonList } from '@/components/Library/ButtonList';

import styles from './index.less';

import { getSystemFields, getTemplateUsageList, updateSaveTemplate } from '../../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const useMessageForm = ({ onAddSuccess }: Props) => {
  const fieldMappingRef = useRef({} as AnyObject<string>);

  const schemaRef = useRef({
    purposeId: {
      title: '模板用途',
      type: 'string',
      enum: [],
      'x-component-props': {
        placeholder: '请选择模板用途',
      },
      'x-rules': {
        required: true,
        message: '请选择模板用途',
      },
    },
    templateId: {
      title: '模板id',
      type: 'string',
      description: '模板内容，需和模板ID内容一致',
      'x-component-props': {
        placeholder: '请输入模板ID',
      },
      'x-rules': [
        {
          required: true,
          message: '请输入模板ID',
        },
      ],
    },
    status: {
      title: '启用状态',
      type: 'number',
      default: 1,
      'x-component': 'switch',
      // 'x-linkages': [
      //   {
      //     type: 'value:visible',
      //     condition: '{{ !!$self.value }}',
      //     target: '*(fieldMapping,content)',
      //   },
      // ],
    },
    fieldMapping: {
      title: '模板内容',
      type: 'customizeTable',
      maxItems: 7,
      'x-rules': {
        required: true,
        message: '请添加模板内容',
      },
      'x-props': {
        wrapperCol: { span: 18 },
      },
      'x-component-props': {
        tableProps: {
          bordered: true,
        },
        autoHideFooterNodeWhenLimit: true,
        renderHeader: ({ add }: AnyObject) => (
          <div style={{ marginBottom: 15, marginTop: 5 }}>
            <ButtonList list={[{ type: 'primary', text: '添加字段', onClick: () => add() }]} />
          </div>
        ),
        renderOperation: ({ remove }: AnyObject) => (
          <ButtonList
            isLink
            list={[
              {
                text: '删除',
                popconfirmProps: {
                  title: '确定需要删除嘛？',
                  okText: '确定',
                  cancelText: '取消',
                  onConfirm: () => {
                    remove();
                  },
                },
              },
            ]}
          />
        ),
      },
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            display: false,
          },

          fieldId: {
            title: '系统字段',
            type: 'string',
            enum: [] as LabeledValue[],
            'x-component-props': {
              placeholder: '请选择系统字段',
            },
            'x-rules': [
              {
                required: true,
                message: '请选择系统字段',
              },
            ],
          },

          templateParamName: {
            title: '微信模板字符',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入微信模板字符',
            },
            'x-rules': [
              {
                required: true,
                message: '请输入微信模板字符',
              },
            ],
          },

          defaultValue: {
            title: '默认值',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入默认值',
            },
          },
        },
      },
    },
    content: {
      title: '模板示例',
      type: 'string',
      description: '模板详情页内的模板示例说明',
      'x-component': 'TextArea',
      'x-component-props': {
        placeholder: '请输入模板示例',
      },
    },
  });

  useMount(() => {
    getTemplateUsageList({ appType: 1 }).then((res) => {
      formActions.setFieldState('purposeId', (fieldState) => {
        fieldState.props.enum = res.data?.map((example: any, index: any) => ({
          label: example.purposeName,
          value: index,
        }));
      });
    });

    getSystemFields({ appType: 1 }).then((res) => {
      schemaRef.current.fieldMapping.items.properties.fieldId.enum = res.data.map((item) => {
        fieldMappingRef.current[item.id] = item.fieldAlias;

        return {
          label: item.fieldAlias,
          value: item.id,
        };
      });
    });
  });

  // 保存模板
  const saveTemplate = useCallback(
    (values) =>
      updateSaveTemplate({
        ...values,
        appType: 1,
        fieldMapping: values.fieldMapping.map(
          (item: Record<keyof typeof schemaRef.current.fieldMapping.items.properties, any>) => ({
            ...item,
            fieldAlias: fieldMappingRef.current[item.fieldId],
          }),
        ),
      }).then(onAddSuccess),
    [onAddSuccess],
  );

  const { openModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    onSubmit: saveTemplate,
    className: styles.wrap,
    schema: schemaRef.current,
  });

  const handleOpenEditorForm = (initialValues: AnyObject = {}) => {
    openModalForm({
      title: `${initialValues.id ? '编辑' : '新增'}模板`,
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenEditorForm,
    ModalFormElement,
  };
};
