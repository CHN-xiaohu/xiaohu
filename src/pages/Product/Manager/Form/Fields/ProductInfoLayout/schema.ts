import { useImmer } from 'use-immer';

import { useMemo, useEffect } from 'react';
import type { IFormAsyncActions } from '@formily/antd';
import type { TSchemas, TSchema } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { useDebounceWatch } from '@/foundations/hooks';

import { useFormatChargeTreeOptions } from './useFormatChargeTreeOptions';
import { useFormatBrandOptions } from './useFormatBrandOptions';
import { useSyncSchemaValues } from './useSyncSchemaValues';

import styles from '../../index.less';

export const stringFilterOption = (input: string, option: { props: { children: string } }) =>
  option.props.children.indexOf(input) > -1;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useProductInfoLayoutBySchema = (
  formActions: IFormAsyncActions,
  isImportFromProduct: boolean,
  isMiniprogramProduct: boolean,
): TSchemas => {
  const [state, setState] = useImmer({
    supplierIdEnum: [] as { value: string; label: string }[],
    storeIdEnum: [] as { value: string; label: string }[],
  });

  useDebounceWatch(
    () => {
      if (isImportFromProduct || isMiniprogramProduct) {
        window.$fastDispatch((model) => model.product.requestAllStoreUsers);
      } else {
        window.$fastDispatch((model) => model.product.requestSuppliers);
      }
    },
    [isImportFromProduct, isMiniprogramProduct],
    { immediate: true },
  );

  const { initialValues, suppliers, storeUsers } = useStoreState('product');

  const formatChargeTreeOptionsResult = useFormatChargeTreeOptions(initialValues.chargeUnitId);

  // 计价单位处理
  useEffect(() => {
    if (!formatChargeTreeOptionsResult.chargeUnitIds.length) {
      return;
    }

    formActions.setFieldState('*.*.productInfoLayout.*.chargeUnits', (fieldState) => {
      fieldState.value = formatChargeTreeOptionsResult.chargeUnitIds;
      // (fieldState.props as any)['x-component-props'].options = chargeTreeOptions
    });

    if (initialValues?.groups?.length > 0) {
      formActions.setFieldState('*.*.productInfoLayout.*.groups', (fieldState) => {
        fieldState.value = initialValues?.groups?.map((items: AnyObject) => ({
          value: items.id,
          key: items.id,
          label: items.name,
        }));
      });
    }

    if (isImportFromProduct) {
      formActions.setFieldState('*.*.productInfoLayout.*.virtualChargeUnitsNameField', (fState) => {
        fState.value = formatChargeTreeOptionsResult.chargeUnitNames.join(' / ');
      });
    }
  }, [formatChargeTreeOptionsResult.chargeUnitIds]);

  // 同步初始数据到表单中
  useSyncSchemaValues(formActions, initialValues);

  // 所属品牌的 options 处理
  const { brandIdOptions } = useFormatBrandOptions(initialValues.brandId, initialValues.brandName);

  // 供应商相关处理
  useEffect(() => {
    const getSelectOptions = () => {
      const selectOptions = suppliers.map((item) => ({ value: item.id, label: item.supplierName }));

      // 处理所选项被禁用的情况
      if (
        initialValues.supplierId &&
        !selectOptions.some((v) => v.value === initialValues.supplierId)
      ) {
        selectOptions.push({
          value: initialValues.supplierId,
          label: initialValues.supplierName || '',
        });
      }

      return selectOptions;
    };

    // formActions.setFieldState('*.*.productInfoLayout.*.supplierId', fieldState => {
    //   (fieldState.props as any).enum = getSelectOptions();
    // })

    setState((draft) => {
      draft.supplierIdEnum = getSelectOptions();
    });
  }, [suppliers, initialValues.supplierId]);

  // 商家处理
  useEffect(() => {
    const getSelectOptions = () => {
      const selectOptions = storeUsers.map((item) => ({
        value: item.id,
        label: `${item.storeName}(${item.linkPhone})`,
      }));

      // 处理所选项被禁用的情况
      if (initialValues.storeId && !selectOptions.some((v) => v.value === initialValues.storeId)) {
        selectOptions.push({
          value: initialValues.storeId,
          label: `${initialValues.storeName || ''}(${initialValues.linkPhone || ''})`,
        });
      }

      return selectOptions;
    };

    setState((draft) => {
      draft.storeIdEnum = getSelectOptions();
    });
  }, [storeUsers, initialValues.storeId]);

  return useMemo(() => {
    const chargeUnits = {
      title: '计价单位',
      'x-component': 'ChargeUnitCascader',
      display: !isImportFromProduct,
      'x-component-props': {
        placeholder: '请选择计价单位',
        showSearch: true,
        fieldNames: { label: 'name', value: 'id', children: 'children' },
        options: formatChargeTreeOptionsResult.chargeTreeOptions,
      },
      'x-rules': {
        required: true,
        message: '请选择计价单位',
      },
    };

    // 用于小程序导入采购商品时的占位显示
    const virtualChargeUnitsNameField = {
      title: '计价单位',
      type: 'string',
    };

    const storeId = {
      title: '所属商家',
      type: 'string',
      enum: state.storeIdEnum,
      editable: true,
      'x-props': {
        addonAfter: '{{ storeHelp(help) }}',
      },
      'x-component-props': {
        placeholder: '请输入商家名称进行搜索',
        showSearch: true,
        filterOption: stringFilterOption,
      },
      'x-rules': {
        required: true,
        message: '请选择所属商家',
      },
    } as TSchema;

    const supplierId = {
      title: '商品供应商',
      type: 'string',
      enum: state.supplierIdEnum,
      'x-props': {
        addonAfter: '{{ supplierHelp(help) }}',
      },
      'x-component-props': {
        placeholder: '请输入供应商名称进行搜索',
        showSearch: true,
        filterOption: stringFilterOption,
      },
      'x-rules': {
        required: true,
        message: '请选择商品供应商',
      },
    };

    return {
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        title: '商品信息',
        type: 'inner',
      },
      properties: {
        item1: {
          type: 'object',
          'x-component': 'grid',
          'x-component-props': {
            gutter: 12,
            cols: [12, 12],
          },
          properties: {
            name: {
              title: '商品名称',
              type: 'string',
              'x-component-props': {
                placeholder: '请输入商品名称',
              },
              'x-rules': [
                { required: true, message: '请输入商品名称' },
                { max: 50, message: '商品名称不能超过 50 个字符' },
              ],
            },
            ...(isImportFromProduct
              ? {
                  virtualChargeUnitsNameField,
                  chargeUnits,
                }
              : { chargeUnits }),
          },
        },

        // ====
        item2: {
          type: 'object',
          'x-component': 'grid',
          'x-component-props': {
            gutter: 24,
            cols: [12, 12],
          },
          properties: {
            ...(isImportFromProduct || isMiniprogramProduct ? { storeId } : { supplierId }),
            brandId: {
              title: '商品品牌',
              type: 'string',
              enum: brandIdOptions,
              'x-component-props': {
                placeholder: '请选择商品品牌',
                showSearch: true,
                filterOption: stringFilterOption,
              },
              'x-rules': {
                required: true,
                message: '请选择商品品牌',
              },
            },
          },
        },

        // ====
        item3: {
          type: 'object',
          'x-component': 'grid',
          'x-component-props': {
            gutter: 24,
            cols: [12, 12],
          },
          properties: {
            virtualUrl: {
              title: '三维效果',
              type: 'string',
              'x-component-props': {
                placeholder: '请输入三维效果 url',
              },
              'x-rules': {
                checkUrl: true,
              },
            },
            serial: {
              title: '商品排序',
              type: 'number',
              'x-component-props': {
                placeholder: '请输入商品排序',
                min: 0,
                max: 99999,
                style: {
                  width: 160,
                },
              },
              'x-rules': {
                required: true,
                message: '请输入商品排序',
              },
            },
          },
        },

        item4: {
          type: 'object',
          'x-component': 'grid',
          'x-component-props': {
            gutter: 24,
            cols: [12, 12],
          },
          properties: {
            groups: {
              title: '商品分组',
              type: 'GroupSelect',
              description: '商品种类繁多时，按照不同标准给商品进行分类、打标签等',
              editable: true,
            },
          },
        },

        images: {
          title: '商品图片',
          type: 'uploadFile',
          'x-props': {
            itemClassName: `${styles.formItem} ${styles.uploadImage}`,
          },
          'x-component-props': {
            multiple: true,
            limit: 6,
            isDraggableSort: true,
            addonBefore:
              '主图建议大小不能超过1MB；建议尺寸800*800及以上，尽量用正方形的图可避免变形；可拖拽图片进行排序',
          },
          'x-rules': {
            required: true,
            message: '请上传商品图片',
          },
        },

        videoUrl: {
          title: '商品视频',
          type: 'uploadVideo',
          'x-props': {
            itemClassName: styles.formItem,
          },
          'x-component-props': {
            placeholder: '请上传少于3Mb、长度短于300秒的视频',
            accept: '.mp4',
            maxSize: 3,
            duration: 300,
          },
        },
      },
    } as TSchemas;
  }, [
    brandIdOptions,
    formatChargeTreeOptionsResult.chargeTreeOptions,
    state.supplierIdEnum,
    state.storeIdEnum,
  ]);
};
