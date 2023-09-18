import type { IFormAsyncActions } from '@formily/antd';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { useImmer } from 'use-immer';
import { useWatch, useDebounceWatch } from '@/foundations/hooks';

import type { UseResetSkuValuesProps } from './useResetSkuValues';

import { specificationAttributesFormPath } from '.';
import { skuCacheManage } from '../../Utils/Specification';

type Props = {
  formActions: IFormAsyncActions;
} & Pick<UseResetSkuValuesProps, 'modelNamespace'>;

export const useHandleAttributeFormField = ({ formActions, modelNamespace = 'product' }: Props) => {
  const { attributes, reselectCategory } = useStoreState(modelNamespace);

  const [state, setDefaultCheckAttributes] = useImmer({
    defaultCheckAttributes: {} as AnyObject,
    realAttributes: [] as typeof attributes,
  });

  useWatch(() => {
    // 防止编辑商品时，商品的所有规格属性都被禁用或者是删除的时候，不能正常显示已选的规格属性
    setDefaultCheckAttributes((draft) => {
      draft.realAttributes = [];
    });
  }, [reselectCategory]);

  useDebounceWatch(() => {
    // 如果新的分类 id 跟旧的分类 id 不一致了，那就不处理属性被禁用的情况
    if (reselectCategory > 0) {
      formActions.setFieldState(specificationAttributesFormPath, (fieldState) => {
        fieldState.value = [];
        fieldState.props!['x-component-props']!.dataSource = attributes;
        fieldState.props!['x-component-props']!.defaultCheckAttributes = {};
      });

      return;
    }

    const realAttributes = JSON.parse(JSON.stringify(attributes || [])) as typeof attributes;

    // 遍历判断是否存在属性已经被禁用，但是 sku 数据里面还存有该属性的情况
    // 如果有，那么就将其添加到 attributes 集合中
    for (const [idVal, childrens] of skuCacheManage.cacheCheckAttributesByIdResultMap.entries()) {
      let targetIndex: number | undefined;
      // 遍历父级
      realAttributes.forEach((item, index) => {
        if (item.id === idVal) {
          targetIndex = index;
        }
      });

      // 如果存在, 那么就再匹对下下级
      if (targetIndex !== undefined) {
        childrens.forEach((item) => {
          if (!realAttributes[targetIndex as number].propVals.some((v) => v.id === item.value)) {
            realAttributes[targetIndex as number].propVals.push({
              name: item.label,
              id: item.value,
            });
          }
        });
      } else {
        // 不存在
        realAttributes.push({
          id: childrens[0].parent_id,
          name: childrens[0].parent_name,
          required: 0,
          custom: 0,
          propVals: childrens.map((item) => ({ name: item.label, id: item.value })),
        } as any);
      }
    }

    // 防止编辑商品时，商品的所有规格属性都被禁用或者是删除的时候，不能正常显示已选的规格属性
    setDefaultCheckAttributes((draft) => {
      draft.realAttributes = realAttributes;
    });

    formActions.setFieldState(specificationAttributesFormPath, (fieldState) => {
      fieldState.value = [];
      fieldState.props!['x-component-props']!.dataSource = realAttributes;
      fieldState.props!['x-component-props']!.defaultCheckAttributes = state.defaultCheckAttributes;
    });
  }, [attributes, state.defaultCheckAttributes]);

  return {
    setDefaultCheckAttributes,
    realAttributes: state.realAttributes,
  };
};
