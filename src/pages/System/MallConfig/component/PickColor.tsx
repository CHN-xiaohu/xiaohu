import * as React from 'react';
import { Input, Button, Popover } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ChromePicker } from 'react-color';

import { useImmer } from 'use-immer';

import type { InputProps } from 'antd/lib/input';
import { useWatch } from '@/foundations/hooks';
import './index.less';

type IInputProps = {
  value?: any;
  placeholder: string;
  onChange?: (value: any) => void;
} & InputProps;

export const PickColor = React.memo((props: IInputProps) => {
  const { value, onChange, placeholder } = props;

  /**
   * colors: 颜色值
   * hide：隐藏拾色器
   */
  const [state, setState] = useImmer({
    colors: value,
    hide: false,
  });

  // 监听颜色值
  useWatch(() => {
    onChange && onChange(state.colors);
  }, [state.colors]);

  // 改变颜色值
  const handleChangeColor = (val: AnyObject) => {
    setState((draft) => {
      draft.colors = val.hex;
    });
  };

  // 控制拾色器显示还是隐藏（true：隐藏）
  const handleChangeVisible = (visible: boolean) => {
    setState((draft) => {
      draft.hide = visible;
    });
  };

  // 存储输入框颜色值
  const onInputChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((draft) => {
      draft.colors = e.target.value;
    });
  };

  // 关闭拾色器
  const handleClosePicker = () => {
    setState((draft) => {
      draft.hide = false;
    });
  };

  // 重置颜色
  const handleRestColor = () => {
    setState((draft) => {
      draft.colors = '';
    });
  };

  // 拾色器配置
  const PickOption = {
    color: state.colors,
    disableAlpha: true,
    onChange: handleChangeColor,
  };

  // 拾色器
  const Picker = (
    <>
      <ChromePicker {...PickOption} />
      <div className="button-group">
        <Button onClick={handleRestColor} style={{ marginRight: 10 }}>
          清空
        </Button>
        <Button onClick={handleClosePicker} type="primary">
          确定
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Input
        placeholder={placeholder}
        value={value}
        className="picker-input"
        onChange={onInputChangeColor}
      />
      <Popover
        content={Picker}
        trigger="click"
        visible={state.hide}
        onVisibleChange={handleChangeVisible}
        placement="right"
      >
        <Button type="primary">
          <DownOutlined />
        </Button>
      </Popover>
    </>
  );
});
