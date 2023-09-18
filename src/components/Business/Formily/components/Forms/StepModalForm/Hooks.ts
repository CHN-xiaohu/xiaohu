import { useCallback } from 'react';
import { useMakeVisibleHooks } from '@/foundations/hooks';

import type { FormProps } from './Form';
import { Form } from './Form';

export type UseModalFormProps<T> = {
  //
} & Omit<FormProps<T>, 'visible'>;

export const useStepModalForm = <T extends any>(defaultProps?: UseModalFormProps<T>) => {
  const {
    open,
    close: closeForm,
    renderElement: FormElement,
    props,
  } = useMakeVisibleHooks<FormProps>({
    ComponentElement: Form,
    defaultProps,
  });

  const openForm = useCallback(
    (newProps?: Partial<UseModalFormProps<T>>) => {
      open(newProps);
    },
    [open],
  );

  return {
    props,
    openForm,
    closeForm,
    FormElement,
  };
};
