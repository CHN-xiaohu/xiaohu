import React from 'react';

import { Button, Form, Typography } from 'antd';
import { isStr, isNum, convertNumberToChinese } from '@/utils';
import { MathCalcic } from '@spark-build/web-utils';
import { ECommerceCommodityPriceCalculation, getDecimalPointLength } from '@/utils/Money';
import { DownOutlined } from '@ant-design/icons';

import type { ISkuMessagesProps } from './SkuMessages';
import { SkuMessages } from './SkuMessages';
import { calcShopCartProductPrice, isArea } from './Sku/utils';

import styles from '../index.less';

const { Text } = Typography;

export interface MoneyTextProps {
  digits?: number | string;
  toChinese?: true;
  toLocale?: true;
  className?: string;
  currency?: string | React.ReactNode;
}

export const toFixed = (val?: string | number, digits: string | number = 2) =>
  parseFloat((val as string) || '0').toFixed(Number(digits));

export const MoneyText: React.FC<MoneyTextProps> = React.memo(
  ({ children, toChinese, toLocale, className, digits = 2, currency = '￥' }) => {
    let text = children;

    if (isStr(text) || isNum(text)) {
      if (digits) {
        text = toFixed(text, digits);
      }

      if (toChinese) {
        text = convertNumberToChinese(String(text));
      }

      if (toLocale) {
        text = text.toLocaleString();
      }
    }

    return (
      <span className={`money-text ${className || ''}`}>
        <span className="money-text--symbol">{currency}</span>
        {text}
      </span>
    );
  },
);

export const UnitPrice = (price: React.Key = 0, row: any) => (
  <span className={styles.unitPrice}>
    <MoneyText>{price}</MoneyText>/<span>{row?.productInfo?.chargeUnit?.chargeUnitName}</span>
  </span>
);

export const Subtotal = (notCalcNonStandard?: boolean) => (price: React.Key = 0, row: any) => (
  <MoneyText className="product-price">
    {calcShopCartProductPrice(price, row, notCalcNonStandard)}
  </MoneyText>
);

export const generateSkuMessageField = (name: React.Key) => `message_${name}`;

export const calcArea = (areas: (string | number)[], unitName?: string) => {
  const sunNumber =
    areas?.[0] && areas?.[1]
      ? ECommerceCommodityPriceCalculation(
          new MathCalcic(areas[0]).multipliedBy(areas[1]).toNumber(),
        )
      : undefined;

  if (!unitName) {
    return String(sunNumber);
  }

  return sunNumber ? `${sunNumber} ${unitName}` : '';
};

// 根据传入的商品的非标准计价配置，生成 antd form item 参数
export const getSkuMessageFieldsByChargeUnit = (
  chargeUnit: { attrs: any[]; attrResult: any; chargeUnitName: any },
  fieldPrefix = '',
) => {
  // 根据后端返回的计价方式来生成计价表单字段配置
  const result = chargeUnit.attrs?.reduce((prev, current, index) => {
    const fieldName = `${fieldPrefix}${generateSkuMessageField(index)}`;

    prev![fieldName] = {
      type: 'number',
      name: fieldName,
      label: `购买${current.attrName}`,
      initialValue: current.attrVal || undefined,
      componentProps: {
        min: 0.01,
        max: 99999,
        addonAfter: current.attrUnitName,
        placeholder: `请输入购买${current.attrName}`,
        style: {
          width: '100%',
        },
      },
      rules: [
        { required: true, message: `请输入购买${current.attrName}` },
        {
          validator: (_: any, value: string) => {
            let errorMessage = '';
            const newValue = parseFloat(value);

            if (Number.isNaN(newValue)) {
              errorMessage = '请输入正确的数字';
            } else if (getDecimalPointLength(value) > 2) {
              errorMessage = '最多只能输入两位小数';
            } else {
              // eslint-disable-next-line no-nested-ternary
              errorMessage =
                newValue < 0.01 ? '最小数值为 0.01' : newValue > 99999 ? '最大数值为 99999' : '';
            }

            return errorMessage ? Promise.reject(new Error(errorMessage)) : Promise.resolve();
          },
        },
      ],
    };

    return prev;
  }, {});

  if (result && isArea(chargeUnit.attrResult)) {
    const messageShouldUpdateFields = chargeUnit.attrs.map(
      (_, index) => `${fieldPrefix}${generateSkuMessageField(index)}`,
    );

    const areaFieldName = `${fieldPrefix}${generateSkuMessageField('area')}`;
    result[areaFieldName] = {
      label: '购买面积',
      type: 'string',
      shouldUpdate: (prevValues: Record<string, any>, curValues: Record<string, any>) =>
        messageShouldUpdateFields.some((k) => prevValues[k] !== curValues[k]),
      children: ({ getFieldsValue }: { getFieldsValue: any }) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const fieldsValues = getFieldsValue(messageShouldUpdateFields) as AnyObject<
          number | undefined
        >;

        const realValue = (Object.values(fieldsValues).filter(Boolean) as unknown) as string[];

        return realValue.length === 2 ? calcArea(realValue!, chargeUnit.chargeUnitName) : '--';
      },
      componentProps: {
        readOnly: true,
      },
    };
  }

  return result;
};

export const skuHasExpired = (status: React.Key) => Number(status) === 2;

export const RenderProductInfo = <T extends AnyObject>({
  dataSource,
  onOpenSkuModal,
  onMessageFieldsChange,
  readOnly = false,
  preview = false,
}: {
  dataSource: T;
  readOnly?: boolean;
  preview?: boolean;
  onOpenSkuModal?: (v: T) => void;
  onMessageFieldsChange?: (v: any) => void;
}) => {
  // 处理非标准计价
  let messagesFields: ISkuMessagesProps['fields'];
  // https://ant.design/components/form-cn/#components-form-demo-global-state
  const fields = [] as {
    name: string[];
    value: any;
  }[];

  const { chargeUnit } = dataSource.productInfo || {};
  if (chargeUnit.attrs) {
    messagesFields = getSkuMessageFieldsByChargeUnit(chargeUnit as any, dataSource.id);

    if (messagesFields) {
      Object.keys(messagesFields).forEach((field) => {
        const current = messagesFields![field];
        current.componentProps.disabled = readOnly;

        current.wrapperCol = {
          span: 11,
        };

        fields.push({
          name: [current.name! as string],
          value: current.initialValue,
        });

        if (preview) {
          current.type = 'preview';
        }
      });
    }
  }

  const handleGetProductStatus = () => {
    if (Number(dataSource.product?.stock) === 0) {
      return <Text type="danger">库存不足</Text>;
    }
    if (Number(dataSource.product?.stock) < Number(dataSource.product?.minimumSale)) {
      return <Text type="danger">库存小于起售数</Text>;
    }
    return (
      <Text type="danger">
        {dataSource.productInfo.productState === 2
          ? '已下架'
          : skuHasExpired(dataSource.status)
          ? '已选规格组合失效'
          : '未知的失效状态'}
      </Text>
    );
  };

  return (
    <div className={'product-info--preview'}>
      <p className={'product-info--title'}>{dataSource.productInfo.name}</p>

      {/* 后期抽离成更小的子组件 */}
      {dataSource.product.sku &&
        !readOnly &&
        (skuHasExpired(dataSource.status) ? (
          <Button onClick={() => onOpenSkuModal?.(dataSource)}>重选规格</Button>
        ) : (
          <div className="skuItem" onClick={() => onOpenSkuModal?.(dataSource)}>
            <span className="ellipsis">{dataSource.product.sku}</span>
            {!preview && <DownOutlined />}
          </div>
        ))}

      {!readOnly && messagesFields && !!Object.keys(messagesFields).length && (
        <Form
          requiredMark={false}
          className="skuMessageForm"
          fields={fields}
          id={`skuMessageForm_${dataSource.id}`}
          // eslint-disable-next-line no-shadow
          onValuesChange={(_, formValues) =>
            onMessageFieldsChange?.({
              ...(dataSource as any),
              charge: {
                chargeUnitId: chargeUnit.chargeUnitId,
                attrs: chargeUnit!.attrs!.map((item: any, index: React.Key) => ({
                  ...item,
                  attrVal: formValues[
                    `${dataSource.id}${generateSkuMessageField(index)}`
                  ] as string,
                })),
              },
            })
          }
        >
          <SkuMessages fields={messagesFields} />
        </Form>
      )}

      {/* 预览模式下的失效状态判断 */}
      {readOnly && handleGetProductStatus()}
    </div>
  );
};
