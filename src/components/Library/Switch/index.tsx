import React from 'react';

import { Switch, Modal, message } from 'antd';
import type { SwitchProps } from 'antd';

import type { ModalProps } from 'antd/es/modal';
import { useImmer } from 'use-immer';
import { useWatch } from '@/foundations/hooks';

export type SwitchPlusProps<V = any> = {
  field?: string;
  value: string | number | boolean;
  /**
   * switch 打开时的值
   */
  activeValue?: boolean | number | string;
  /**
   * switch 关闭时的值
   */
  inactiveValue?: boolean | number | string;
  /**
   * switch 选中时的内容
   */
  checkedChildren?: string | React.ReactNode;
  /**
   * switch 非选中时的内容
   */
  unCheckedChildren?: string | React.ReactNode;
  loading?: boolean;
  checkCanSwitch?: () => Promise<any>;
  onChange?: (obj: V) => Promise<any>;
  modalProps?: Omit<ModalProps, 'visible' | 'onOk' | 'onCancel'> & { children?: React.ReactNode };
} & Pick<SwitchProps, 'checkedChildren' | 'unCheckedChildren'>;

const returnTypeValue = (value: any, checked: boolean) =>
  typeof value === 'boolean'
    ? checked
    : typeof value === 'string'
    ? String(checked)
    : Number(checked);

const Main: React.FC<SwitchPlusProps> = ({
  field,
  value,
  modalProps,
  onChange,
  checkCanSwitch,
  activeValue,
  inactiveValue,
  loading = false,
  checkedChildren,
  unCheckedChildren,
}) => {
  const [state, setState] = useImmer({
    visible: false,
    loading: false,
  });

  useWatch(() => {
    setState((draft) => {
      draft.loading = loading;
    });
  }, [loading]);

  const checkedState = activeValue !== undefined ? value === activeValue : Boolean(value);

  const handleCancel = React.useCallback(() => {
    setState((draft) => {
      draft.visible = false;
      draft.loading = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOk = async () => {
    let errorMessage;
    if (checkCanSwitch) {
      await checkCanSwitch().catch((error: Error) => {
        errorMessage = String(error.message || error);
      });
    }

    if (errorMessage) {
      message.error(errorMessage);
    } else if (onChange) {
      // 因为当前 ant-design 的 switch 只支持 boolean, 而为了方便使用，这里需要根据传入值类型再进行相应的转换
      const checkedValue =
        activeValue === undefined
          ? returnTypeValue(value, !value)
          : !checkedState
          ? activeValue
          : inactiveValue;

      await onChange(field ? { [field]: checkedValue } : checkedValue);
    }

    if (modalProps) {
      handleCancel();
    }

    setState((draft) => {
      draft.loading = false;
    });
  };

  const handleClick = () => {
    setState((draft) => {
      draft.visible = !!modalProps;
      draft.loading = true;
    });

    if (!modalProps) {
      handleOk();
    }
  };

  return (
    <>
      <Switch
        loading={state.loading}
        checked={checkedState}
        onClick={handleClick}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
      />

      {modalProps && (
        <Modal
          {...{
            title: '提示',
            ...modalProps,
            visible: state.visible,
            onOk: handleOk,
            onCancel: handleCancel,
          }}
        />
      )}
    </>
  );
};

export const SwitchPlus = React.memo(Main);
