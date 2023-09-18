import { Request } from '@/foundations/Request';

export type CategoryColumns = {
  id: string;
  name: string;
  parentId: string;
  numbering: string;
  serial: number;
  status: number;
  currentLevel: number;
  totalChildrenLevel: number;
};

const prefix = '/zwx-product/productcategory';

export const getCategories = async () =>
  Request.get<CategoryColumns>('/list', {
    prefix,
  }) as PromiseResponsePaginateResult<CategoryColumns>;

export const getCategoriesByValid = async () =>
  Request.get<CategoryColumns>('/listValid', { prefix });

export const updateCategoryStatus = async (data: { id: string; status: number }) =>
  Request.post<CategoryColumns>('/updateStatus', { prefix, data });

export const addOrUpdateCategory = async (data: object) =>
  Request.post<CategoryColumns>('/save', { prefix, data });
