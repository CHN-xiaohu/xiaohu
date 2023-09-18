import type { SwitchOnChangeParams } from '@/components/Business/Table';
import {
  generateDefaultSelectOptions,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import { useCallback } from 'react';

import { useBrandForm } from './Form';

import type { BrandColumns } from '../Api';
import { getBrandList, updateBrandStatus } from '../Api';

export default function ProductBrand() {
  const { actionsRef } = useGeneralTableActions<BrandColumns>();

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = useBrandForm({
    onSubmitSuccess: handleCreateAdSuccess,
  });

  const handleChangeStatus = ({
    dataSource,
    value,
  }: SwitchOnChangeParams<BrandColumns, { status: number }>) => {
    return updateBrandStatus({ id: dataSource.row.id, ...value }).then(handleCreateAdSuccess);
  };

  return (
    <>
      {ModalFormElement}
      <GeneralTableLayout<BrandColumns>
        request={getBrandList}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              searchText: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '品牌名称、英文名称',
                },
              },
              status: {
                title: '品牌状态',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions([
                    { label: '正常', value: 1 },
                    { label: '禁用', value: 0 },
                  ]),
                },
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          text: '新增品牌',
          onClick: () => openForm(),
        }}
        columns={[
          {
            title: '品牌名称',
            dataIndex: 'cnName',
          },
          {
            title: '品牌英文',
            dataIndex: 'enName',
          },
          {
            title: '品牌图标',
            dataIndex: 'image',
            image: true,
          },
          {
            title: '关联类目',
            dataIndex: 'categorys',
            width: '20%',
            formatterValue: ({ value }) => value?.map((item: any) => item?.name)?.join('，'),
            ellipsisProps: true,
          },
          {
            title: '品牌排序',
            dataIndex: 'serial',
          },
          {
            title: '状态',
            dataIndex: 'status',
            switchProps: {
              modalProps: ({ value }) => ({
                children: (
                  <>
                    {
                      // eslint-disable-next-line no-extra-boolean-cast
                      Boolean(value) ? (
                        <span>
                          确定禁用该品牌商吗？
                          <br />
                          禁用后，会影响品牌下商品的筛选
                        </span>
                      ) : (
                        '确定启用该品牌商？'
                      )
                    }
                  </>
                ),
              }),
              onChange: handleChangeStatus,
            },
          },
          {
            title: '新增时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '编辑',
                  onClick: () => {
                    openForm({ ...row, categoryIds: row.categorys?.map((item) => item.id) });
                  },
                },
              ],
            },
          },
        ]}
      />
    </>
  );
}
