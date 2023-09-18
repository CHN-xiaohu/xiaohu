/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { useImmer } from 'use-immer';
import { Form, message } from 'antd';
import type { FormInstance } from 'antd/lib/form';

import { useDebounceWatch } from '@/foundations/hooks';

import { usePersistFn } from 'ahooks';
import { MoneyText } from '@/components/Library/MoneyText';

import type { ISkuStepperProps } from './components/SkuStepper';
import { SkuStepper } from './components/SkuStepper';
import type { ISkuActionsProps } from './components/SkuActions';
import { SkuActions } from './components/SkuActions';
import type { ISkuMessagesProps } from './components/SkuMessages';
import { SkuMessages } from './components/SkuMessages';
import './index.less';
import { SkuRowBody } from './components/SkuRowBody';

export * from './hooks';

export type TSkuListItem = {
  id: React.Key; // skuId，下单时后端需要
  price: React.Key; // 价格（单位分）
  image?: string; // sku 图片
  sku_value_map: React.Key[]; // sku 规格 id 集合
  sku_name_map: React.Key[]; // sku 规格 name 集合
  minimumSale?: number; // 最小起批量
  originMinimumSale?: number; // 原最小起批量
  /**
   * 原价
   */
  originPrice?: React.Key;
  stock_num?: number; // 当前 sku 组合对应的库存
  [k: string]: any;
};

type TActionFCs = {
  [k in 'onAddCart' | 'onBuy']?: (v: {
    messages?: AnyObject<string>;
    count: number;
    skuData: TSkuListItem;
  }) => void;
};

export interface ISkuProps
  extends Pick<
      ISkuStepperProps,
      | 'quota'
      | 'quotaUnit'
      | 'quotaUnit'
      | 'quotaUsed'
      | 'startSaleNum'
      | 'hideQuotaText'
      | 'customStepperConfig'
    >,
    Omit<ISkuActionsProps, 'onAddCart' | 'onBuy'>,
    TActionFCs {
  initialSku?: {
    selectedNum?: number;
    sku_value_map?: React.Key[]; // sku 规格 id 集合
    sku_parent_value_map: React.Key[]; // sku 规格所属父级 id 集合
    messages?: AnyObject<string>;
  };
  nonStandardPriceOptions?: {
    minimumSale: number | undefined;
    chargeUnit: any;
  };
  standardPriceOptions?: any;

  dataSource?: {
    name?: string;

    image?: string;
    /**
     * 默认价格
     */
    price?: React.Key;
    /**
     * 原价
     */
    originPrice?: React.Key;
    /**
     * 商品总库存
     */
    stock_num?: number;
    /**
     * 规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
     */
    collection_id?: React.Key;
    /**
     * 是否无规格商品
     */
    none_sku?: boolean;
    /**
    /**
     * 起售数
     */
    minimumSale: number;
    // 原最小起批量
    originMinimumSale?: number;
    /**
     * 商品单位
     */
    // unitName: string;

    tree: {
      /**
       * skuKeyName：规格类目名称
       */
      k: string;
      k_id: React.Key;
      v: {
        id: React.Key; // skuValueId：规格值 id
        name: string; // skuValueName：规格值名称
        image?: string; // 规格类目图片，只有第一个规格类目可以定义图片
        previewImage?: string; // 用于预览显示的规格类目图片
      }[];
    }[];

    list: TSkuListItem[];
  };

  /**
   * 商品留言区
   */
  Messages?: React.ReactNode;
  messagesFields?: ISkuMessagesProps['fields'];

  // 步进器
  selectedNum?: number;
  stepperTitle?: string;
  disableStepperInput?: boolean;
  hideQuotaText?: boolean;
  stepperSuffix?: React.ReactNode;
  unStepperMax?: boolean;
  onSelectSkuChange?: (v: TSkuListItem) => void;
  onSelectedSkuCombStatus?: (v: boolean) => void;
  onFieldsChange?: (changedFields: any[], allFields: any[]) => void;

  /**
   * 操作按钮区
   */
  Actions?: React.ReactNode;

  // 获取表单实例
  getFormInstance?: React.MutableRefObject<
    FormInstance & { handleAddCartOrBuy: (t: 'addCart' | 'buy') => () => Promise<any> }
  >;

  isNonStandard?: boolean;
}

export const Sku = ({
  dataSource,

  loading,

  initialSku,

  Messages,
  messagesFields,

  onFieldsChange,

  // 步进器
  quota = 0,
  quotaUsed = 0,
  startSaleNum = 1,
  quotaUnit,
  selectedNum,
  stepperTitle,
  disableStepperInput = false,
  hideQuotaText = false,
  unStepperMax,
  stepperSuffix,
  customStepperConfig,

  onSelectSkuChange,
  onSelectedSkuCombStatus,

  // 按钮区域
  Actions,
  addCartButtonProps,
  showAddCartBtn = true,
  showBuyBtn = true,
  buyButtonProps,
  onAddCart,
  onBuy,

  isNonStandard,

  getFormInstance,
}: ISkuProps) => {
  const { none_sku, stock_num = 9 } = dataSource || {};

  const [form] = Form.useForm();
  const [state, setState] = useImmer({
    // 选中的 sku 项集合
    selectedSkuIds: {} as AnyObject<React.Key>,
    // 禁用的 sku 项集合
    disabledSkuIds: [] as React.Key[],
    // 商品图片
    goodsImg: dataSource?.image || '',
    // 选中的该项 sku 的数据源
    selectedSkuData: null as TSkuListItem | null,
    supplyPrice: dataSource?.price || 0,
    originPrice: dataSource?.originPrice || 0,
    stock_num,
    messageValues: {} as AnyObject<string>,
    selectedNum: startSaleNum || selectedNum || 1,
  });

  // 查找当前勾选的 sku 项
  const handleSelectedSkuComb = usePersistFn((isResetCount = true) => {
    let selectedSkuComb = false;
    const run = () => {
      const { list: skuList = [] } = dataSource || {};

      const innerSetState = (selectedSkuItem = {} as TSkuListItem) => {
        setState((draft) => {
          draft.selectedSkuData = Object.keys(selectedSkuItem).length ? selectedSkuItem : null;
          draft.supplyPrice = selectedSkuItem.supplyPrice ?? dataSource?.price ?? 0;
          draft.originPrice = selectedSkuItem.originPrice ?? dataSource?.originPrice ?? 0;
          draft.goodsImg = selectedSkuItem.image || dataSource?.image || '';

          // 标准计价的 sku 切换时，自动将购买数量切换为其最低起售数量
          if (!isNonStandard && isResetCount) {
            form.setFieldsValue({
              count: selectedSkuItem.minimumSale || 1,
            });
          }
        });
      };

      // 判断是否全部选完了
      if (skuList[0].sku_value_map.length !== Object.keys(state.selectedSkuIds).length) {
        innerSetState();
        return;
      }

      const selectedSkuItem = skuList.find((item) =>
        Object.values(state.selectedSkuIds).every((skuId) => item.sku_value_map.includes(skuId)),
      );

      if (!selectedSkuItem) {
        innerSetState();
        return;
      }

      selectedSkuComb = true;
      innerSetState(selectedSkuItem);

      onSelectSkuChange?.(selectedSkuItem);
    };

    run();

    onSelectedSkuCombStatus?.(selectedSkuComb);
  });

  useDebounceWatch(
    () => {
      form.setFieldsValue({
        count: initialSku?.selectedNum || state.selectedNum || 1,
      });
    },
    [initialSku?.selectedNum, selectedNum],
    { ms: 60 },
  );

  useDebounceWatch(
    () => {
      setState((draft) => {
        if (initialSku?.sku_value_map && initialSku?.sku_parent_value_map) {
          draft.selectedSkuIds = initialSku.sku_parent_value_map.reduce((obj, parent_id, idx) => {
            obj[parent_id] = initialSku.sku_value_map![idx];
            return obj;
          }, {});

          setTimeout(() => handleSelectedSkuComb(false));
        }
      });
    },
    [initialSku?.sku_value_map],
    { immediate: true, isAreEqual: true, ms: 160 },
  );

  const handleSelectedNumChange = React.useCallback(
    (v: number) => {
      setState((draft) => {
        draft.selectedNum = v;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSelectedSkuItem = usePersistFn((_, __, selectedSkuIds) => {
    setState((draft) => {
      draft.selectedSkuIds = selectedSkuIds;

      setTimeout(() => handleSelectedSkuComb());
    });
  });

  const getNoSkuDataOfSelectedSkuData = usePersistFn(() => ({
    id: dataSource?.collection_id, // skuId，下单时后端需要
    supplyPrice: dataSource?.price, // 价格（单位分）
    image: dataSource?.image, // sku 图片
    sku_value_map: [], // sku 规格 id 集合
    sku_name_map: [], // sku 规格 name 集合
    minimumSale: dataSource?.minimumSale, // 最小起批量
    originMinimumSale: dataSource?.originMinimumSale, // 原最小起批量
    originPrice: dataSource?.originPrice,
    stock_num: dataSource?.stock_num, // 库存数
  }));

  const handleAddCartOrBuy = usePersistFn((type: 'addCart' | 'buy') => async () => {
    return form
      .validateFields()
      .then((values: AnyObject) => {
        const selectedSkuData = !dataSource?.none_sku
          ? state.selectedSkuData
          : getNoSkuDataOfSelectedSkuData();

        if (Number(dataSource?.stock_num) < values.count) {
          throw new Error('库存不足！');
        }

        if (!state.selectedSkuData && dataSource?.list.length) {
          throw new Error('请选择商品规格');
        }

        if (!values.count) {
          throw new Error('请添加购买数量');
        }

        const method = type === 'buy' ? onBuy : onAddCart;

        const fullValues = {
          ...values,
          messages: state.messageValues,
          skuData: selectedSkuData!,
        };

        method?.(fullValues as any);

        return fullValues;
      })
      .catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        error.message && message.error(error.message);

        return Promise.reject(error.message);
      });
  });

  React.useEffect(() => {
    if (getFormInstance?.current) {
      getFormInstance.current = {
        ...form,
        handleAddCartOrBuy,
      };
    }
  }, [form, getFormInstance, handleAddCartOrBuy]);

  return (
    <Form
      colon={false}
      labelAlign="left"
      form={form}
      labelCol={{ span: 3 }}
      onFieldsChange={onFieldsChange}
      // wrapperCol={{ span: 18 }}
    >
      <Form.Item label={'价格'}>
        <MoneyText style={{ color: 'red' }}>
          {state.selectedSkuData?.supplyPrice ?? dataSource?.price}
        </MoneyText>
      </Form.Item>

      <div className="sku-body">
        {!none_sku && (
          <SkuRowBody
            dataSource={dataSource}
            onSelectedSkuItem={handleSelectedSkuItem}
            selectedSkuIds={state.selectedSkuIds}
          />
        )}
      </div>

      {Messages ||
        (messagesFields && !!Object.keys(messagesFields).length && (
          <SkuMessages defaultValue={initialSku?.messages} fields={messagesFields} />
        ))}

      <div className="sku-stock">
        <Form.Item
          label="购买数量"
          name="count"
          validateFirst
          initialValue={initialSku?.selectedNum || state.selectedNum || startSaleNum}
          rules={[
            { required: true, message: '请输入购买数量' },
            { type: 'number', min: 1, message: '至少购买一个' },
          ]}
        >
          <SkuStepper
            {...{
              stock: state.selectedSkuData?.stock_num || dataSource?.stock_num || 0,
              unMax: unStepperMax,
              quota,
              quotaUnit,
              quotaUsed,
              startSaleNum: state.selectedSkuData?.minimumSale ?? startSaleNum,
              customStepperConfig,
              stepperTitle,
              disableStepperInput,
              hideQuotaText,
              skuStockNum: state.stock_num,
              suffix: stepperSuffix,
              onChange: handleSelectedNumChange,
            }}
          />
        </Form.Item>
      </div>

      {Actions || (
        <SkuActions
          {...{
            loading,
            showAddCartBtn,
            showBuyBtn,
            buyButtonProps,
            addCartButtonProps,
            onAddCart: handleAddCartOrBuy('addCart'),
          }}
        />
      )}
    </Form>
  );
};
