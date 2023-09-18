import type { ProjectColumns } from '@/pages/CloudDesign/Project/Api';

import { getRecommendProject } from '@/pages/CloudDesign/Project/Api';
import type { IFieldState } from '@/components/Business/Formily';

export const projectLinkage = (
  resetSkipValueFieldState: (cb: (f: IFieldState) => void) => void,
  type: string,
  chooseProductValue: string,
) => {
  if (type === 'DESIGN_DETAIL') {
    resetSkipValueFieldState((state) => {
      const message = '请选择系统推荐方案';
      state.props['x-component'] = 'SelectByLoadMore';
      state.value = chooseProductValue;
      state.props['x-component-props'] = {
        placeholder: '请选择系统推荐方案',
        request: (params: AnyObject) =>
          getRecommendProject({
            ...params,
            keyword: params.searchValue ? params.searchValue : chooseProductValue,
            searchValue: undefined,
          }).then((res) => ({
            data: (res.data.records as ProjectColumns[]).map((item) => ({
              label: item.name,
              value: item.designId,
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
