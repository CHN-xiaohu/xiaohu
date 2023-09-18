import { mapStyledProps, connect, registerFormField } from '@formily/antd';

import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd/es/tree-select';
import { usePersistFn } from 'ahooks';

declare global {
  interface GlobalFormSchemaComponentType {
    treeSelect: TreeSelectProps<any>;
  }
}

const Wrapper = (props: any) => {
  const { onBlur, onChange, onFocus, ...last } = props;

  // 避免 UFORM 在 clone 时候造成的循环依赖，先这样避免一下，等 UFORM 修复
  const newChange = usePersistFn((e: any) => {
    onChange?.(e);
  });

  const newBlur = usePersistFn(() => onBlur?.());

  const newFocus = usePersistFn(() => onFocus?.());

  return (
    <TreeSelect
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      {...last}
      onChange={newChange}
      onBlur={newBlur}
      onFocus={newFocus}
    />
  );
};

registerFormField(
  'treeSelect',
  connect({
    getProps: mapStyledProps,
  })(Wrapper),
);

// fix https://github.com/umijs/umi/issues/6766 Module parse failed: Top-Level-Await 报错
export {};
