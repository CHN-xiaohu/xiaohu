import { useShowTakeProductPrice } from '@/pages/Product/Miniprogram/useShowTakeProductsPriceModal';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const IsShowTakeProductPrice = () => {
  const { openShowTakeProductPrice, ShowTakeProductPriceElement } = useShowTakeProductPrice({});

  return (
    <div style={{ display: 'flex' }}>
      {ShowTakeProductPriceElement}
      <span>商品价格</span>
      <div style={{ margin: '0 0 10px 10px' }}>
        <QuestionCircleOutlined />
        <span
          onClick={() => openShowTakeProductPrice()}
          style={{ color: '#1890ff', marginLeft: '10px', cursor: 'pointer' }}
        >
          查看商品拿货价
        </span>
      </div>
    </div>
  );
};
