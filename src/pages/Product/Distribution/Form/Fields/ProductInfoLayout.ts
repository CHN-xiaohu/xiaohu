import { useMemo, useEffect, useRef } from 'react';
import type { IFormAsyncActions } from '@formily/antd';
import type { TSchemas } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import {
  useSyncSchemaValues,
  useFormatBrandOptions,
  useFormatChargeTreeOptions,
  stringFilterOption,
} from '@/pages/Product/Manager/Form/Fields/ProductInfoLayout';

import { useMount } from 'ahooks';

import { getAllStoreUsers } from '@/pages/Consumer/Supplier/Api';

import { useDebounceByMemo } from '@/foundations/hooks';

import styles from '../index.less';

import { modelNamespace } from '..';

export const useProductInfoLayoutBySchema = (formActions: IFormAsyncActions): TSchemas => {
  const { initialValues } = useStoreState(modelNamespace);
  const storeEnumOptionsRef = useRef([] as { value: string; label: string }[]);

  // 同步初始数据到表单中
  useSyncSchemaValues(formActions, initialValues, []);

  // 销售渠道的初始数据同步
  useEffect(() => {
    if (!initialValues.name) {
      return;
    }

    formActions.setFieldValue(
      '*.*.productInfoLayout.*.salesChannel',
      [initialValues.mini && 'mini', initialValues.purchase && 'purchase'].filter(Boolean),
    );
  }, [initialValues.name]);

  // 所属品牌的 options 处理
  const { brandIdOptions } = useFormatBrandOptions(
    initialValues.brandId,
    initialValues.brandName,
    modelNamespace,
  );

  const formatChargeTreeOptionsResult = useFormatChargeTreeOptions(initialValues.chargeUnitId);

  useMount(() => {
    setTimeout(() => {
      // 根据需求，禁用部分表单字段
      formActions.hostUpdate(() => {
        [
          ...['images', 'videoUrl'].map((name) => `*.*.productInfoLayout.${name}`),
          ...['name', 'virtualUrl', 'chargeUnits', 'brandId'].map(
            (name) => `*.*.productInfoLayout.*.${name}`,
          ),
        ].forEach((formPath) => {
          formActions.setFieldState(formPath, (fieldState) => {
            fieldState.editable = false;
          });
        });
      });
    });
  });

  // 分组 同步

  useEffect(() => {
    if (initialValues?.groups?.length > 0) {
      formActions.setFieldState('*.*.productInfoLayout.*.groups', (fieldState) => {
        fieldState.value = initialValues?.groups?.map((items) => ({
          label: items.name,
          value: items.id,
          key: items.id,
        }));
      });
    }
  }, [initialValues?.groups]);

  // 计价单位处理
  useEffect(() => {
    if (!formatChargeTreeOptionsResult.chargeUnitIds.length) {
      return;
    }

    formActions.setFieldState('*.*.productInfoLayout.*.chargeUnits', (fieldState) => {
      fieldState.value = formatChargeTreeOptionsResult.chargeUnitIds;
    });

    formActions.setFieldState('*.*.productInfoLayout.*.virtualChargeUnitsNameField', (fState) => {
      fState.value = formatChargeTreeOptionsResult.chargeUnitNames.join(' / ');
    });
  }, [formatChargeTreeOptionsResult.chargeUnitIds]);

  const handleGetstoreUsers = useDebounceByMemo(async () => {
    // 为啥需要这样绕一下，是因为需要保证 getAllStoreUsers 只请求一次
    // 但是如果只请求一次的话，会因为 storeId 字段是默认 visible = false
    // 这就会导致第一次没办法设到值，所以需要一个中间变量来储存绕一下
    if (!storeEnumOptionsRef.current.length) {
      const getSelectOptions = async () => {
        const selectOptions = await getAllStoreUsers().then((res) =>
          res.data.map((item) => ({
            value: item.id,
            label: `${item.storeName}(${item.linkPhone})`,
          })),
        );

        // 处理所选项被禁用的情况
        if (
          initialValues.storeId &&
          !selectOptions.some((v) => v.value === initialValues.storeId)
        ) {
          selectOptions.push({
            value: initialValues.storeId,
            label: `${initialValues.storeName || ''}(${initialValues.linkPhone || ''})`,
          });
        }

        return selectOptions;
      };

      const enumOptions = await getSelectOptions();
      storeEnumOptionsRef.current = enumOptions;
    }

    formActions.setFieldState('*.*.productInfoLayout.*.storeId', (fieldState) => {
      fieldState.props.enum = storeEnumOptionsRef.current;
    });
  });

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

            // 用于占位显示，为了统一表现
            virtualChargeUnitsNameField: {
              title: '计价单位',
              type: 'string',
              editable: false,
            },
            chargeUnits: {
              title: '计价单位',
              type: 'cascader',
              display: false,
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
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            // full: true,
            autoRow: true,
            columns: 2,
          },
          properties: {
            salesChannel: {
              title: '销售渠道',
              type: 'string',
              'x-component': 'Checkbox',
              enum: [
                { label: '采购 App', value: 'purchase' },
                { label: '小程序商城', value: 'mini' },
              ],
              'x-rules': {
                required: true,
                message: '请选择销售渠道',
              },
              'x-linkages': [
                {
                  type: 'value:effect',
                  effect: ({ setFieldState, getFieldState }: IFormAsyncActions) => {
                    getFieldState('*.*.productInfoLayout.*.salesChannel', (fieldState) => {
                      if (!fieldState.value) {
                        return;
                      }

                      setFieldState('*.*.productInfoLayout.*.storeId', (state) => {
                        state.visible = (fieldState.value as string[]).includes('mini');

                        if (state.visible && !state.props.enum?.length) {
                          handleGetstoreUsers();
                        }
                      });
                    });
                  },
                },
              ],
            },
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
            storeId: {
              title: '所属商家',
              type: 'string',
              visible: false,
              enum: [],
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

        item3: {
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
  }, [brandIdOptions, formatChargeTreeOptionsResult.chargeTreeOptions]);
};
