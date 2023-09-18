import { useModalForm } from '@/components/Business/Formily';
import { toArr, FormPath } from '@formily/shared';
import { useCallback } from 'react';
import { Button, Input } from 'antd';
import { ArrayList } from '@formily/react-shared-components';
import { SchemaField } from '@formily/antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { usePersistFn } from 'ahooks';

import { setServerDomainName, setUpBusinessDomainName } from '../../../Api';

// eslint-disable-next-line max-len
const httpsRegex = /^https*:\/\/([\w-]+(\.[\w-]+)+)+(\s*;\s*https*:\/\/[\w-]+(\.[\w-]+)+)*$/;
// eslint-disable-next-line max-len
const wssRegex = /^wss*:\/\/([\w-]+(\.[\w-]+)+)+(\s*;\s*wss*:\/\/[\w-]+(\.[\w-]+)+)*$/;

export const useConfigureTheServerForm = (getServer: any) => {
  const handleSubmitReview = usePersistFn((values: any) =>
    setServerDomainName(values).then(() => getServer()),
  );

  const { openModalForm, ModalFormElement } = useModalForm({
    isNativeAntdStyle: true,
    onSubmit: handleSubmitReview,
    title: '配置服务器信息',
    footer: ({ onCancel, onOk }) => (
      <>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onOk} type="primary">
          保存并提交
        </Button>
      </>
    ),
    layout: 'vertical',
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
    schema: {
      requestDomain: {
        title: 'request合法域名',
        type: 'string',
        'x-component-props': {
          placeholder: '以https://开头 , 可填写讴歌域名 , 多个域名间请用 ; 分割',
        },
        'x-rules': [
          { required: true, message: '请输入request合法域名' },
          {
            pattern: httpsRegex,
            message: 'request合法域名必须以https://开头的网站',
          },
        ],
      },
      wsRequestDomain: {
        title: 'socket合法域名',
        type: 'string',
        'x-component-props': {
          placeholder: '以wss://开头 , 可填写讴歌域名 , 多个域名间请用 ; 分割',
        },
        'x-rules': [
          { required: true, message: '请输入socket合法域名' },
          {
            pattern: wssRegex,
            message: 'socket合法域名必须以wss://开头的网站',
          },
        ],
      },
      uploadDomain: {
        title: 'uploadFile合法域名',
        type: 'string',
        'x-component-props': {
          placeholder: '以https://开头 , 可填写讴歌域名 , 多个域名间请用 ; 分割',
        },
        'x-rules': [
          { required: true, message: '请输入uploadFile合法域名' },
          {
            pattern: httpsRegex,
            message: 'uploadFile合法域名必须以https://开头的网站',
          },
        ],
      },
      downloadDomain: {
        title: 'downloadFile合法域名',
        type: 'string',
        'x-component-props': {
          placeholder: '以https://开头 , 可填写讴歌域名 , 多个域名间请用 ; 分割',
        },
        'x-rules': [
          { required: true, message: '请输入downloadFile合法域名' },
          {
            pattern: httpsRegex,
            message: 'downloadFile合法域名必须以https://开头的网站',
          },
        ],
      },
    },
  });

  return {
    openServerForm: openModalForm,
    ModalServerFormElement: ModalFormElement,
  };
};

const ArrayCustom = (props: any) => {
  const { value, schema, editable, path, mutators } = props;
  const { renderAddition, renderRemove } = schema.getExtendsComponentProps() || {};

  const dataSource = toArr(value);

  const onAdd = useCallback(
    (defValue?: any[]) => {
      const items = Array.isArray(schema.items)
        ? schema.items[schema.items.length - 1]
        : schema.items;

      if (items && dataSource.length < (schema.maxItems || 5)) {
        mutators.push(defValue || items.getEmptyValue());
      }
    },
    [dataSource.length, mutators, schema.items, schema.maxItems],
  );
  return (
    <ArrayList
      value={value}
      minItems={schema.minItems}
      maxItems={schema.maxItems}
      editable={editable}
      renders={{
        renderAddition,
        renderRemove,
      }}
    >
      {dataSource.map((_, index) => {
        const newPath = FormPath.parse(path).concat(index).toString();
        return (
          <div key={newPath}>
            <span>域名{index + 1} </span>
            <div className="arrayList">
              <SchemaField path={newPath} />
              {index === 0 && (
                <Button
                  style={{ color: '#40a9ff' }}
                  icon={<PlusOutlined />}
                  onClick={() => onAdd()}
                />
              )}
              {index !== 0 && (
                <Button
                  style={{ color: 'red' }}
                  icon={<MinusOutlined />}
                  onClick={() => mutators.remove(index)}
                />
              )}
            </div>
          </div>
        );
      })}
    </ArrayList>
  );
};

ArrayCustom.isFieldComponent = true;

export const useBusinessDomainNameForm = (getBusiness: any) => {
  const handleSubmitReview = usePersistFn((values: any) => {
    const damains = values.webViewDomain.map((item: any) => item.damain).join(';');
    return setUpBusinessDomainName({ webViewDomain: damains }).then(() => getBusiness());
  });

  const { openModalForm, ModalFormElement } = useModalForm({
    isNativeAntdStyle: true,
    onSubmit: handleSubmitReview,
    layout: 'vertical',
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
    components: { ArrayCustom, Input },
    title: '配置业务域名',
    footer: ({ onCancel, onOk }) => (
      <>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onOk} type="primary">
          保存
        </Button>
      </>
    ),
    schema: {
      webViewDomain: {
        type: 'array',
        'x-component': 'ArrayCustom',
        default: [{ damain: '' }],
        items: {
          type: 'object',
          properties: {
            damain: {
              type: 'string',
              'x-component': 'Input',
              'x-rules': [
                { required: true, message: '请输入业务域名' },
                {
                  pattern: httpsRegex,
                  message: '业务域名必须以https://开头的网站',
                },
              ],
            },
          },
        },
      },
    },
  });

  return {
    openBusinessForm: openModalForm,
    ModalBusinessFormElement: ModalFormElement,
  };
};
