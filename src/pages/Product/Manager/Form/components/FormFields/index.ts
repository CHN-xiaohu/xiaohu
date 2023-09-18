import { useMemo } from 'react';
import { connect } from '@app_business/Formily';

import { ColumnSelect } from './ColumnSelect';
import { CategoryBreadcrumb } from './CategoryBreadcrumb';
import { DetailEditor } from './DetailEditor';
import { TableUploadImage } from './Upload/Image';
import { ParamsList } from './ParamsList';
import { SpecificationGroups, Specification } from './SpecificationAttributes';
import { SpecificationTable } from './SpecificationTable';

export const useFields = (moreFieldComponent = {} as AnyObject) =>
  useMemo(
    () => ({
      columnSelect: connect()(ColumnSelect),
      categoryBreadcrumb: connect()(CategoryBreadcrumb),
      detailEditor: connect()(DetailEditor),
      specificationTableUploadImage: connect()(TableUploadImage),
      paramsList: ParamsList,

      // 规格属性
      specificationGroups: SpecificationGroups,
      specification: connect()(Specification),

      // sku table
      specificationTable: SpecificationTable,
      ...moreFieldComponent,
    }),
    [],
  );
