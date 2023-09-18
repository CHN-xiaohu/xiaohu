import { Image } from '@/components/Business/Table/Image';

import { ButtonList } from '@/components/Library/ButtonList';

import { Button, Table, Input } from 'antd';

import styles from '../../index.less';

const ProductTable = (props: any) => {
  const {
    selectRowProducts,
    handleGoChoose,
    handleToggleIsFirst,
    handleGoRemove,
    handleSortChange,
  } = props;

  const handlePrice = (min: any, max: any) => {
    if (min === max) {
      return min;
    }
    return `${min}~${max}`;
  };

  const columns = [
    {
      title: '首图',
      dataIndex: 'image',
      render: (src: string) => <Image src={src} />,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '类目',
      dataIndex: 'categoryNamePath',
    },
    {
      title: '单位',
      dataIndex: 'chargeUnitName',
      render: (data: any, records: any) => {
        return <span>{data || records?.chargeUnit?.chargeUnitName}</span>;
      },
    },
    {
      title: '零售价（小程序）',
      dataIndex: 'minSalePrice',
      render: (data: any, records: any) => <span>￥{handlePrice(data, records.maxSalePrice)}</span>,
    },
    {
      title: '展示排序',
      dataIndex: 'sort',
      width: '10%',
      render: (value: any, records: any) =>
        !records.firstPage ? (
          <span>---</span>
        ) : (
          <Input
            style={{ textAlign: 'center' }}
            type="number"
            value={value}
            onChange={(e) => handleSortChange(e.target.value, records.id)}
          />
        ),
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (_: any, records: any) => {
        const list = [
          records.firstPage
            ? {
                text: '取消显示',
                onClick: () => {
                  handleToggleIsFirst(records.id);
                },
              }
            : {
                text: '首页展示',
                onClick: () => {
                  handleToggleIsFirst(records.id);
                },
              },
          {
            text: '删除',
            onClick: () => {
              handleGoRemove(records.id);
            },
          },
        ];
        return <ButtonList isLink list={list} />;
      },
    },
  ];

  return (
    <div className={styles.addProduct}>
      <div className={styles.titleBg}>
        <span className={styles.title}>专题商品</span>
        <Button type="primary" size="small" onClick={handleGoChoose}>
          添加商品
        </Button>
      </div>
      <Table
        columns={columns}
        bordered
        dataSource={selectRowProducts}
        rowKey="id"
        pagination={{
          pageSize: 10,
          total: selectRowProducts.length,
          showTotal: (total: number) => `共 ${total} 个`,
        }}
      />
    </div>
  );
};

export default ProductTable;
