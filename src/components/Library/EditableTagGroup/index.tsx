import type { ChangeEvent } from 'react';
import { Input, Button, Tag, message } from 'antd';
import { useImmer } from 'use-immer';
import { useWatch } from '@/foundations/hooks';
import type { ButtonProps } from 'antd/es/button/button';

import styles from './index.less';

type EditableTagGroupProps = {
  value?: string[];
  inputMaxLength?: number;
  editButtonProps?: Omit<ButtonProps, 'onClick'>;
  canRepeat?: boolean;
  onChange?: (value: string[]) => void;
};

export const EditableTagGroup = ({
  value,
  canRepeat = false,
  inputMaxLength = 30,
  onChange,
  editButtonProps = {},
}: EditableTagGroupProps) => {
  const [state, setState] = useImmer({
    inputValue: '',
    value: [] as string[],
    inputEditable: false,
  });

  // 受控处理
  useWatch(() => {
    setState((draft) => {
      draft.value = value || [];
    });
  }, [value]);

  useWatch(() => {
    onChange?.(state.value);
  }, [state.value]);

  const toggleInputEditable = () => {
    setState((draft) => {
      draft.inputEditable = !draft.inputEditable;
    });
  };

  const handleAddTag = () => {
    if (!state.inputValue) {
      toggleInputEditable();

      return;
    }

    if (!canRepeat && state.value.includes(state.inputValue)) {
      message.warn('不能添加重复数据');
      return;
    }

    setState((draft) => {
      draft.value.push(draft.inputValue);
      draft.inputValue = '';
      draft.inputEditable = false;
    });
  };

  const handleRemoveTag = (index: number) => {
    setState((draft) => {
      draft.value.splice(index, 1);
    });
  };

  const handleSetInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();

    setState((draft) => {
      draft.inputValue = e.target.value;
    });
  };

  const renderTagGroup = state.value.map((tag, index) => (
    <Tag
      className={styles.tag}
      closable
      onClose={() => handleRemoveTag(index)}
      key={`${tag + index}`}
    >
      {tag}
    </Tag>
  ));

  const renderInput = state.inputEditable && (
    <Input
      autoFocus
      className={styles.input}
      maxLength={inputMaxLength}
      onBlur={handleAddTag}
      placeholder="请输入添加的数据"
      onPressEnter={handleAddTag}
      value={state.inputValue}
      onChange={handleSetInputValue}
    />
  );

  return (
    <div className={styles.wrapper}>
      {renderTagGroup}
      {renderInput}
      {!state.inputEditable && (
        <Button {...{ children: '添加', ...editButtonProps, onClick: toggleInputEditable }} />
      )}
    </div>
  );
};
