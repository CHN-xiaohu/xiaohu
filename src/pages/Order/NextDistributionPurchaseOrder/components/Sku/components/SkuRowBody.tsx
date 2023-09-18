import React, { memo, useCallback, useMemo } from 'react';
import { Button, Form, Space } from 'antd';

import { useImmer } from 'use-immer';
import { useWatch } from '@/foundations/hooks';

import { SkuPermutations } from '../SkuPermutations';
import type { ISkuProps } from '../index';

export const SkuRowBody = memo(
  ({
    dataSource,
    selectedSkuIds,
    onSelectedSkuItem,
  }: {
    dataSource: ISkuProps['dataSource'];
    selectedSkuIds?: Record<React.Key, React.Key>;
    onSelectedSkuItem?: (
      parent_id: React.Key,
      skuAttributeId: React.Key,
      selectedSkuIds: Record<React.Key, React.Key>,
    ) => void;
  }) => {
    const skuPermutations = useMemo(() => new SkuPermutations(dataSource), [dataSource]);

    const [state, setState] = useImmer({
      selectedSkuIds: {} as { [k in React.Key]: React.Key },
      disabledSkuIds: [] as React.Key[],
    });

    const calcNextEmptyKV = useCallback(
      (draft: typeof state) => {
        const { nextEmptyKV } = skuPermutations?.executeBySelected(
          Object.values(draft?.selectedSkuIds),
        );

        draft.disabledSkuIds = nextEmptyKV;
      },
      [skuPermutations],
    );

    useWatch(
      () => {
        setState((draft) => {
          draft.selectedSkuIds = selectedSkuIds || {};

          calcNextEmptyKV(draft);
        });
      },
      [selectedSkuIds],
      { isAreEqual: true },
    );

    const handleSelectedSkuItem = useCallback(
      (parent_id: React.Key, skuAttributeId: React.Key) => {
        setState((draft) => {
          if (
            draft.selectedSkuIds[parent_id] &&
            draft.selectedSkuIds[parent_id] === skuAttributeId
          ) {
            delete draft.selectedSkuIds[parent_id];
          } else {
            draft.selectedSkuIds[parent_id] = skuAttributeId;
          }

          calcNextEmptyKV(draft);

          onSelectedSkuItem?.(
            parent_id,
            skuAttributeId,
            JSON.parse(JSON.stringify(draft?.selectedSkuIds)),
          );
        });
      },
      [onSelectedSkuItem, setState, calcNextEmptyKV],
    );

    return (
      <>
        {dataSource?.tree?.map((item, index) => (
          <Form.Item key={`${item.k}_${index}`} label={item.k}>
            <Space wrap>
              {item.v.map((skuValue) => (
                <Button
                  key={skuValue.id}
                  type={state.selectedSkuIds[item.k_id] === skuValue.id ? 'primary' : 'default'}
                  disabled={
                    state.disabledSkuIds.includes(skuValue.id) ||
                    skuPermutations.emptySkuMap.includes(String(skuValue.id))
                  }
                  onClick={() => handleSelectedSkuItem(item.k_id, skuValue.id)}
                >
                  {skuValue.name}
                </Button>
              ))}
            </Space>
          </Form.Item>
        ))}
      </>
    );
  },
);
