import { mapStyledProps } from '@/components/Business/Formily/Utils/mapStyledProps';
import { connect, registerFormField, mapTextComponent } from '@formily/antd';
import { isCnCharacter } from '@spark-build/web-utils';
import { Input as AntdInput } from 'antd';
import type { InputProps } from 'antd/lib/input';
import { useRef } from 'react';

import './index.less';

type MixInputProps = InputProps & {
  showLengthCount?: boolean;
  isDistinguishBetweenCnOrEnLenCalc?: boolean;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalDefaultFormSchemaLayouts {
    input: Omit<MixInputProps, 'value' | 'onChange'>;
  }
}

const Input = ({
  showLengthCount,
  onChange,
  isDistinguishBetweenCnOrEnLenCalc,
  ...props
}: MixInputProps) => {
  const valueRealLengthRef = useRef(0);

  const distinguishBetweenCnOrEnLenCalc = (v: string) => {
    if (!isDistinguishBetweenCnOrEnLenCalc) {
      return v.length;
    }

    return Array.from({ length: v.length }).reduce(
      (sum: number, _, idx) => sum + (isCnCharacter(v[idx]) ? 2 : 1),
      0,
    );
  };

  const suffix = () => {
    if (!showLengthCount || !props.maxLength) {
      return undefined;
    }

    const currentLen = !props.value
      ? 0
      : valueRealLengthRef.current || distinguishBetweenCnOrEnLenCalc(String(props.value));

    return (
      <span className="ant-input-show-count">
        {currentLen} / {props.maxLength}
      </span>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    if (props.maxLength && isDistinguishBetweenCnOrEnLenCalc) {
      if (value) {
        const len = distinguishBetweenCnOrEnLenCalc(value);

        valueRealLengthRef.current = props.maxLength;

        if (len > props.maxLength) {
          let interceptLen = len - props.maxLength;

          while (interceptLen > 0) {
            value = value.slice(0, value.length - 1);

            interceptLen -= isCnCharacter(value[value.length - 1]) ? 2 : 1;
          }
        } else {
          valueRealLengthRef.current = len;
        }
      } else {
        valueRealLengthRef.current = 0;
      }
    }

    e.target.value = value;

    onChange?.(e);
  };

  return <AntdInput {...{ ...props, onChange: handleChange, suffix: suffix() }} />;
};

Input.isFieldComponent = true;

registerFormField(
  'input',
  connect({
    getProps: mapStyledProps,
    getComponent: mapTextComponent,
  })(Input),
);
