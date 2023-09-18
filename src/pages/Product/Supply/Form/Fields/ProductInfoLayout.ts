import { useMemo, useEffect } from 'react';
import type { IFormAsyncActions } from '@formily/antd';
import type { TSchemas } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import {
  useSyncSchemaValues,
  useFormatBrandOptions,
  useFormatChargeTreeOptions,
  stringFilterOption,
} from '@/pages/Product/Manager/Form/Fields/ProductInfoLayout';

import styles from '../index.less';

import { modelNamespace } from '..';

export const useProductInfoLayoutBySchema = (formActions: IFormAsyncActions): TSchemas => {
  const { initialValues } = useStoreState(modelNamespace);

  // 同步初始数据到表单中
  useSyncSchemaValues(formActions, initialValues);

  // 所属品牌的 options 处理
  const { brandIdOptions } = useFormatBrandOptions(
    initialValues.brandId,
    initialValues.brandName,
    modelNamespace,
  );

  const formatChargeTreeOptionsResult = useFormatChargeTreeOptions(initialValues.chargeUnitId);

  // 计价单位处理
  useEffect(() => {
    if (!formatChargeTreeOptionsResult.chargeUnitIds.length) {
      return;
    }

    formActions.setFieldState('*.*.productInfoLayout.*.chargeUnits', (fieldState) => {
      fieldState.value = formatChargeTreeOptionsResult.chargeUnitIds;
    });
  }, [formatChargeTreeOptionsResult.chargeUnitIds]);

  return useMemo(() => {
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
            chargeUnits: {
              title: '计价单位',
              type: 'ChargeUnitCascader',
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
            },
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
  }, [brandIdOptions, formatChargeTreeOptionsResult.chargeTreeOptions]);
};
