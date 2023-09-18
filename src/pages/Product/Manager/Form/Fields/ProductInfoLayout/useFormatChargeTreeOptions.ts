import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useMount } from 'ahooks';
import type { ChargeTreeColumns } from '@/pages/Product/Api';
import { chargeTree } from '@/pages/Product/Api';

export const useFormatChargeTreeOptions = (chargeUnitId?: string) => {
  const [state, setState] = useImmer({
    chargeTreeOptions: [] as ChargeTreeColumns[],
    chargeUnitIds: [] as string[],
    chargeUnitNames: [] as string[],
  });

  useMount(() => {
    chargeTree().then((res) => {
      setState((draft) => {
        draft.chargeTreeOptions = res.data;
      });
    });
  });

  useEffect(() => {
    const { chargeTreeOptions } = state;

    if (chargeUnitId && chargeTreeOptions.length) {
      let chargeUnitIds: string[];
      let chargeUnitNames: string[];
      for (let i = 0; i < chargeTreeOptions.length; i += 1) {
        const findRealChargeUnitItem = chargeTreeOptions[i].children.find(
          (chil) => Number(chil.id) === Number(chargeUnitId),
        );

        if (findRealChargeUnitItem) {
          chargeUnitIds = [chargeTreeOptions[i].id, findRealChargeUnitItem.id];
          chargeUnitNames = [chargeTreeOptions[i].name, findRealChargeUnitItem.name];
          break;
        }
      }

      setState((draft) => {
        draft.chargeUnitIds = chargeUnitIds;
        draft.chargeUnitNames = chargeUnitNames;
      });
    }
  }, [state.chargeTreeOptions, chargeUnitId]);

  return state;
};
