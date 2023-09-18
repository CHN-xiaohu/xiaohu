import { MoneyText } from '@/components/Library/MoneyText';
import { sum } from 'lodash';

import { calcShopCartProductPrice } from '../components/Sku/utils';

import '../index.less';

export default function OrderTotal({ dataSource }: { dataSource: any[] }) {
  const orderTotal = dataSource.map((item) => calcShopCartProductPrice(item.supplyPrice, item));
  return <MoneyText className="product-orderTotal">{sum(orderTotal)}</MoneyText>;
}
