import type { IFieldState } from '@/components/Business/Formily';
import { getBizGroupSelectorList } from '@/pages/Product/Api/groups';

export const labelLinkage = (
  resetSkipValueFieldState: (cb: (f: IFieldState) => void) => void,
  type: string,
  chooseProductValue: string,
) => {
  if (type === 'SPECIFY_LABEL') {
    resetSkipValueFieldState((state) => {
      const message = '请选择系标签';
      state.props['x-component'] = 'SelectByLoadMore';
      state.value = chooseProductValue;
      state.props['x-component-props'] = {
        placeholder: '请选择标签',
        request: (params: AnyObject) =>
          getBizGroupSelectorList({
            ...params,
            selectField: params.searchValue ? params.searchValue : chooseProductValue,
            searchValue: undefined,
          }).then((res) => ({
            data: (res.data as any).map((item: any) => ({
              label: item.name,
              value: `${item.id}，${item.name}`,
            })),
            total: res.data.total,
          })),
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
