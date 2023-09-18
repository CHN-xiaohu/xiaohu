import type { ChangeEventHandler } from 'react';
import { memo } from 'react';
import { Input } from 'antd';
import { useWatch } from '@/foundations/hooks';
import { useImmer } from 'use-immer';
import classNames from 'classnames';
import type { CascaderValueType } from 'antd/lib/cascader';

import './index.less';

import { AreaByAmap } from '../Area';

export type IAddressProps = {
  value: { names?: string[]; codes: string[]; detail: string };
  onChange?: (v?: IAddressProps['value']) => void;
  className?: string;
};

export const Address = memo(({ value = {} as any, className, onChange }: IAddressProps) => {
  const [state, setState] = useImmer({
    area: {
      codes: [] as string[],
      names: [] as string[],
    },
    detail: '',
  });

  useWatch(
    () => {
      if (!value) {
        return;
      }

      setState((draft) => {
        if (value.codes) {
          draft.area.codes = value.codes;
        }

        if (value.names) {
          draft.area.names = value.names;
        }

        draft.detail = value.detail || '';
      });
    },
    [value],
    { immediate: true, isAreEqual: true },
  );

  useWatch(() => {
    if (!onChange) {
      return;
    }

    // 因为这个组件是一个整体，所以如果有值没有填写到，那么就返回 undefined 回去，以便上层进行必填验证处理
    const isAllDone = !!state.detail && !!state.area.codes.length && !!state.area.names;

    onChange(isAllDone ? { detail: state.detail, ...state.area } : undefined);
  }, [state]);

  const handleAreaChange = (
    v: CascaderValueType,
    selectedOptions: AMap.DistrictSearch.District[],
  ) => {
    setState((draft) => {
      draft.area.codes = v.map((item) => String(item));
      draft.area.names = selectedOptions?.map((item) => item.name) || [];
    });
  };

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setState((draft) => {
      draft.detail = e.target.value;
    });
  };

  return (
    <div className={classNames('area-address', className)}>
      <AreaByAmap
        className="area-address--area"
        placeholder="请选择省市县信息"
        value={state.area.codes}
        onChange={handleAreaChange}
      />

      <Input.TextArea
        value={state.detail}
        autoSize
        onChange={handleTextareaChange}
        placeholder="请填写详细地址信息"
      />
    </div>
  );
});
