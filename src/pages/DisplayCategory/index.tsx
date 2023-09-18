import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { Image } from '@/components/Business/Table/Image';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { Modal } from 'antd';
import { useCallback, useState } from 'react';

import { useDisplayCategoryForm } from './Form';
import type { displayCategoryColumn } from './Api';
import {
  deleDisplayCategory,
  setSample,
  getTheSample,
  delMiniCategory,
  getMiniSample,
  setMiniSample,
  delSupplyCategory,
} from './Api';
import { Sample } from './component/sample';

export default function DisplayCategory() {
  const displayCategory = useStoreState('displayCategory');
  const { actionsRef } = useGeneralTableActions<displayCategoryColumn>();

  const handleRequest = (params: any) =>
    window.$fastDispatch((model) => model.displayCategory.getDisplayCategories, {
      params,
    });

  const [isOpenDelete, setOpenDelete] = useState(false);
  const [displayCategoryId, setAdvId] = useState('0');
  const [isShowSample, setIsShowSample] = useState(false);
  const [sampleType, setSampleType] = useState('SIMPLE');

  const handleCreateSuccess = useCallback(() => {
    setTimeout(() => {
      actionsRef.current.reload();
    }, 800);
  }, []);

  const { openForm, ModalFormElement } = useDisplayCategoryForm({
    displayCategories: actionsRef.current.dataSource,
    productCategories: displayCategory.productCategories,
    parentCategories: displayCategory.parentCategories,
    groupsList: displayCategory.groupsList,
    onAddSuccess: handleCreateSuccess,
  });

  const deleteModal = {
    visible: isOpenDelete,
    title: '提示',
    width: 250,
    onCancel() {
      setOpenDelete(false);
    },
    onOk() {
      if (window.location.pathname.split('/').includes('miniCatetory')) {
        delMiniCategory(displayCategoryId).then(handleCreateSuccess);
      } else if (window.location.pathname.split('/').includes('supplyCategory')) {
        delSupplyCategory(displayCategoryId).then(handleCreateSuccess);
      } else {
        deleDisplayCategory(displayCategoryId).then(handleCreateSuccess);
      }
      setOpenDelete(false);
    },
  };

  const handleDeleteDisplayCategory = (id: any) => {
    setOpenDelete(true);
    setAdvId(id);
  };

  const handleShowSample = () => {
    if (window.location.pathname.split('/').includes('miniCatetory')) {
      getMiniSample().then((res) => {
        setSampleType(res.data.style);
      });
    } else {
      getTheSample().then((res) => {
        setSampleType(res.data.style);
      });
    }
    setIsShowSample(true);
  };

  const sampleOpt = {
    title: '模版样式',
    visible: isShowSample,
    width: 900,
    sampleType,
    onOk() {
      if (window.location.pathname.split('/').includes('miniCatetory')) {
        setMiniSample({ style: sampleType }).then(() => {
          actionsRef.current.reload();
        });
      } else {
        setSample({ style: sampleType }).then(() => {
          actionsRef.current.reload();
        });
      }
      setIsShowSample(false);
    },
    onCancel() {
      setIsShowSample(false);
    },
    onChangeSample(value: any) {
      setSampleType(value.target.value);
    },
  };

  const ButtonLists = window.location.pathname.split('/').includes('supplyCategory')
    ? [
        {
          text: '新增分类',
          onClick: () => openForm(),
          type: 'primary',
        },
      ]
    : ([
        {
          text: '新增分类',
          onClick: () => openForm(),
          type: 'primary',
        },
        {
          text: '样式设置',
          onClick: () => handleShowSample(),
          type: 'primary',
        },
      ] as any);

  return (
    <>
      <Sample {...sampleOpt} />
      {ModalFormElement}
      <Modal {...deleteModal}>确认删除该运营类目？</Modal>
      <GeneralTableLayout<displayCategoryColumn, any>
        request={handleRequest as any}
        getActions={actionsRef}
        tableProps={{
          pagination: false,
        }}
        operationButtonListProps={{
          list: ButtonLists,
        }}
        useTableOptions={{
          formatResult: () => ({
            data: displayCategory.displayCategories,
            total: 0,
          }),
        }}
        searchProps={{
          items: [
            {
              name: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '分类别名',
                  style: { width: 300 },
                },
              },
              categoryType: {
                title: '类目类型',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '商品分类', value: 0 },
                      { label: '商品分组', value: 1 },
                    ],
                    '',
                  ),
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '分类别名',
            dataIndex: 'name',
            width: '20%',
          },
          // window.location.pathname.split('/').includes('supplyCategory') ? {
          //   title: '关联分类',
          //   dataIndex: 'treeNamePath',
          // },
          {
            title: `${
              window.location.pathname.split('/').includes('supplyCategory')
                ? '关联分类'
                : '所属关联'
            }`,
            width: '30%',
            dataIndex: 'treeNamePath',
            render: (data: any, records: any) => (
              <span>{Number(records?.categoryType) === 0 ? data : records?.groupName}</span>
            ),
          },
          {
            title: '图标',
            dataIndex: 'icon',
            width: '15%',
            render: (src: string) => <Image src={src} />,
          },
          {
            title: '类型',
            dataIndex: 'categoryType',
            width: '9%',
            render: (categoryType: any) => <span>{!categoryType ? '商品分类' : '商品分组'}</span>,
          },
          {
            title: '排序',
            dataIndex: 'serial',
            width: '6%',
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
            width: '13%',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: '8%',
            buttonListProps: {
              list: ({ row }) => [
                { text: '编辑', onClick: () => openForm(row) },
                { text: '删除', onClick: () => handleDeleteDisplayCategory(row.id) },
              ],
            },
          },
        ]}
      />
    </>
  );
}
