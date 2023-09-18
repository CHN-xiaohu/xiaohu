import type { IFieldState } from '@/components/Business/Formily';

export const tagsLinkage = (
  resetSkipValueFieldState: (cb: (f: IFieldState) => void) => void,
  type: string,
  chooseProductValue: string,
  chooseProductId: string,
) => {
  if (type === 'SCHEME_TAG_SEARCH') {
    resetSkipValueFieldState((state) => {
      const message = '请选择标签';
      state.props['x-component'] = 'TagForm';
      state.value = { id: chooseProductId, name: chooseProductValue };
      state.props['x-component-props'] = {
        placeholder: '请选择标签',
      };

      state.props['x-rules'] = [
        {
          required: true,
          message,
        },
      ];
    });
  }
};
