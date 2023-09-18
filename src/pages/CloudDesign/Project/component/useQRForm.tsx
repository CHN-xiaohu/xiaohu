import { useModalForm } from '@/components/Business/Formily';
import { Spin } from 'antd';
import type { ISchemaFieldComponentProps } from '@formily/antd';
import { createAsyncFormActions } from '@formily/antd';
import { useRequest } from 'ahooks';
import FileSaver from 'file-saver';

import { getDesignQR } from '../Api';

const formActions = createAsyncFormActions();

const DesignName = ({ value }: ISchemaFieldComponentProps) => {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: '16px',
        color: '#616263',
        fontWeight: 800,
      }}
    >
      {value}
    </div>
  );
};

const QR = ({ value }: ISchemaFieldComponentProps) => {
  const { loading, data } = useRequest(() => getDesignQR(value), {
    refreshDeps: [value],
    formatResult: (res) => res,
  });

  const downLoadImage = () => {
    FileSaver.saveAs(data!);
  };
  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={data} style={{ width: '150px', height: '150px' }}></img>
        <span style={{ paddingTop: '20px', fontSize: '12px', color: '#A4A4A4' }}>
          扫描后，直接访问小程序方案
        </span>
        <a onClick={downLoadImage} style={{ paddingTop: '10px', fontSize: '14px' }}>
          下载二维码
        </a>
      </div>
    </Spin>
  );
};

export const useQRForm = () => {
  const { openModalForm, ModalFormElement } = useModalForm({
    title: '方案二维码',
    actions: formActions,
    isNativeAntdStyle: true,
    components: {
      QR,
      DesignName,
    },
    schema: {
      designName: { type: 'string', 'x-component': 'DesignName' },
      designId: {
        type: 'string',
        'x-component': 'QR',
      },
    },
  });

  const handleOpenSelectedForm = (initialValues: AnyObject) => {
    openModalForm({
      initialValues: { ...initialValues },
    });
  };

  return {
    openForm: handleOpenSelectedForm,
    ModalFormElement,
  };
};
