import { useRef } from 'react';

import type { TableActions } from './Container';

export const useGeneralTableActions = <T extends Record<string, any>>() => {
  const actionsRef = useRef({} as TableActions<T>);

  return {
    actionsRef,
  };
};
