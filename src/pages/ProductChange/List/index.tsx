import { GeneralTableLayout } from '@/components/Business/Table';
import { Ellipsis } from '@/components/Library/Ellipsis';

import { Image } from '@/components/Business/Table/Image';

import { history } from 'umi';

import { getProductsChangeList } from '../Api';

type IDataProps = {
  productInfoId: string; // 分销商品id
  image: string; // 商品首图
  name: string; // 商品名称
  changeTime: string; // 变更时间
  status: number; // 商品状态
};

export default function ProductChangeList() {
  const handleGoToEdit = (data: IDataProps) => {
    // 1：有效，0：无效
    if (data.status === 1) {
      history.push(`/product/distribution/form/${data.productInfoId}`);
    }
  };

  return (
    <GeneralTableLayout
      request={getProductsChangeList as any}
      operationButtonListProps={false}
      columns={[
        {
          title: '首图',
          dataIndex: 'image',
          render: (src: string) => <Image src={src} />,
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          width: 138,
          render: (text, row) => (
            <a
              style={row.status === 1 ? undefined : { color: '#333', cursor: 'inherit' }}
              onClick={() => handleGoToEdit(row)}
            >
              <Ellipsis>{text}</Ellipsis>
            </a>
          ),
        },
        {
          title: '变更说明',
          dataIndex: 'changeRemark',
        },
        {
          title: '变更时间',
          dataIndex: 'changeTime',
          width: 184,
        },
      ]}
    />
  );
}
