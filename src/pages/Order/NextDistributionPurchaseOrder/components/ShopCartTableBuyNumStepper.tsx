import { useMemo } from 'react';
import { ECommerceCommodityPriceCalculation, MathCalcic } from '@spark-build/web-utils';

import { Stepper } from './Stepper';
import { isArea, isNonStandard } from './Sku/utils';

export const getNonStandard = (attrResult: string, attrs: { attrVal: any }[]) =>
  isArea(attrResult)
    ? ECommerceCommodityPriceCalculation(
        new MathCalcic(attrs[0].attrVal || 1).multipliedBy(attrs[1].attrVal || 1).toNumber(),
      )
    : attrs![0].attrVal;

const noStockStyle = {
  color: '#F33E3E',
  fontSize: '12px',
  marginTop: '5px',
};
const saleStyle = {
  fontSize: '12px',
  marginTop: '5px',
};

const renderStockTip = (buyNum: number, stock: number) => {
  let text = '';

  if (stock < buyNum) {
    text = '库存不足';
  } else if (stock < 10) {
    text = '库存紧张';
  }

  return text && <div style={noStockStyle}>{text}</div>;
};

const renderSale = (_isNonStandard: boolean, minimumSale: number, unitName: string) => {
  let text = '';
  if (minimumSale === 1) {
    text = '';
  } else {
    text = _isNonStandard
      ? `不足${minimumSale}${unitName}按${minimumSale}${unitName}计价`
      : `${minimumSale}${unitName}起售`;
  }
  return text && <div style={saleStyle}>{text}</div>;
};

export const ShopCartTableBuyNumStepper = ({
  dataSource,
  onStepperChange,
  unMax = false,
}: {
  dataSource: any;
  onStepperChange: any;
  unMax?: boolean;
}) => {
  const { chargeWay, attrResult, attrs = [] } = dataSource.productInfo.chargeUnit;

  // eslint-disable-next-line no-underscore-dangle
  const _isNonStandard = isNonStandard(chargeWay);

  const buyNum = useMemo(() => {
    const calcBuyNum = new MathCalcic(dataSource.buyNum);

    if (_isNonStandard) {
      calcBuyNum.multipliedBy(getNonStandard(attrResult, attrs!));
    }

    return calcBuyNum.toNumber();
  }, [_isNonStandard, attrResult, attrs, dataSource.buyNum]);

  return (
    <div>
      <Stepper
        /**
         * 最低起售取决于标准计价跟非标准计价，如果是非标，那么就不做强制最低起售，如果是标准，那么就是需要强制最低起售
         */
        min={_isNonStandard ? 1 : Number(dataSource.product.minimumSale) || 1}
        max={unMax || _isNonStandard ? undefined : Number(dataSource.product?.stock)}
        value={dataSource.buyNum}
        onChange={onStepperChange}
      />
      {renderSale(
        _isNonStandard,
        Number(dataSource.product.minimumSale) || 1,
        dataSource.productInfo.chargeUnit.chargeUnitName,
      )}
      {renderStockTip(buyNum, Number(dataSource.product.stock))}
    </div>
  );
};
