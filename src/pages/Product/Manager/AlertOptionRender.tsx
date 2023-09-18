import type { AlertOptionRenderProps } from '@/components/Business/Table/GeneralTable/components/Alert';

/**
 * 上下架切换
 *
 * @param props GeneralTableLayout alertOptionRender props
 * @param handler 上下架调用的函数
 * @param productState 1 上架 2 下架
 */
export const AlertOptionRender = ({
  props,
  handler,
  productState,
  modifyStock,
  modifyWarning,
}: {
  props: AlertOptionRenderProps<any>;
  handler: Function;
  productState: 1 | 2;
  modifyStock: Function;
  modifyWarning: Function;
}) => {
  const { intl, onCleanSelected } = props;

  const modifyInventoryInBulk = (
    <a onClick={() => modifyStock()} key="1">
      {intl.formatMessage({ id: 'product.table.alert.modifyInventoryInBulk' })}
    </a>
  );

  const batchModifyInventoryWarning = (
    <a onClick={() => modifyWarning()} key="4">
      {intl.formatMessage({ id: 'product.table.alert.batchModifyInventoryWarning' })}
    </a>
  );

  return [
    <a onClick={() => handler(productState === 1 ? 2 : 1)} key="0">
      {intl.formatMessage({
        id: `product.table.alert.${productState === 2 ? 'shelves' : 'takeOff'}`,
      })}
    </a>,
    modifyInventoryInBulk,
    batchModifyInventoryWarning,
    <a onClick={onCleanSelected} key="2">
      {intl.formatMessage({ id: 'table.alert.clear' })}
    </a>,
  ];
};
