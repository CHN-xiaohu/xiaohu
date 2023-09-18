import type { SwitchOnChangeParams } from '@/components/Business/Table';
import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { convertToChinese, getContentContainerHeight } from '@/utils';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useCategoryFrom } from './Form';

import { loopFindData, formatCategoryData } from '../Utils';
import type { CategoryTree } from '../models/Category';

import { updateCategoryStatus, getCategories } from '../Api';

export default function ProductCategory() {
  const { actionsRef } = useGeneralTableActions<CategoryTree>();
  const { categories } = useStoreState('productCategory') as any;

  const handleStateChange = ({ dataSource, value }: SwitchOnChangeParams<CategoryTree[0]>) => {
    return updateCategoryStatus({ id: dataSource.row.id, ...value }).then(() => {
      // 当被禁用的时候，更新缓存起来的分类数据
      window.$fastDispatch((model) => model.productCategory.handleRequestCategories, {
        resetRequest: true,
      });

      actionsRef.current.setDataSource((source) => {
        // 直接更新数据，不用请求后端
        loopFindData({
          data: source,
          key: dataSource.row.id,
          callback: (_, idx, arr) => {
            arr[idx] = {
              ...arr[idx],
              ...value,
            };
          },
        });
      });
    });
  };

  const handleSuccess = () => {
    actionsRef.current.reload();
    window.$fastDispatch((model) => model.productCategory.handleRequestCategories, {
      resetRequest: true,
    });
  };

  const { openForm, ModalFormElement } = useCategoryFrom({
    categories,
    onSubmitSuccess: handleSuccess,
  });

  return (
    <>
      {ModalFormElement}

      <GeneralTableLayout<CategoryTree[0], any>
        request={getCategories}
        getActions={actionsRef as any}
        useTableOptions={{
          formatResult: (res) => ({
            data: formatCategoryData(res.data) as any,
            total: 0,
          }),
        }}
        defaultAddOperationButtonListProps={{
          text: '新增分类',
          onClick: () => openForm(),
        }}
        tableProps={{
          pagination: false,
          scroll: { y: getContentContainerHeight() - 148 },
        }}
        columns={[
          {
            title: '类目名称',
            dataIndex: 'name',
          },
          {
            title: '类目编码',
            dataIndex: 'numbering',
            width: 180,
          },
          {
            title: '类目排序',
            dataIndex: 'serial',
            width: 120,
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: 75,
            switchProps: {
              modalProps: ({ value, row }) => ({
                children: (
                  <>
                    {
                      // eslint-disable-next-line no-extra-boolean-cast
                      Boolean(value)
                        ? '确定禁用类目？'
                        : `确定启用${convertToChinese(row.currentLevel)}级类目？`
                    }
                  </>
                ),
              }),
              onChange: handleStateChange,
            },
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 80,
            buttonListProps: {
              list: ({ row }) => [{ text: '编辑', onClick: () => openForm(row) }],
            },
          },
        ]}
      />
    </>
  );
}
