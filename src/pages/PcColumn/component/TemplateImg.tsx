import { Image } from '@/components/Business/Table/Image';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import type { ISchemaFieldComponentProps } from '@formily/antd';
import { modelNamespace } from '@/pages/PcColumn/Constant';

export const TemplateImg = (props: ISchemaFieldComponentProps) => {
  const { productAdvImgType } = useStoreState(modelNamespace as 'pcColumn');

  return (
    <Image
      style={{
        width: '430px',
        marginLeft: '29px',
        height: `${productAdvImgType !== 'PC_NAVIGATION_TEMPLATE_ONE' ? '150px' : ''}`,
      }}
      src={props?.value}
    />
  );
};
