import { useRef, useState } from 'react';
import { Button, Card, List } from 'antd';
import { ButtonList } from '@/components/Library/ButtonList';
import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';
import { SearchFrom } from '@/components/Business/Formily/components/Forms';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { useMount, useRequest, useUpdateLayoutEffect } from 'ahooks';

import { useImmer } from 'use-immer';

import { createAsyncFormActions } from '@formily/antd';

import { SelectedCommodityModal } from './SelectedCommodityModal';
import { useSkuPanelEvent, useSkuPanelSkuChangeEvent } from './Sku/utils';
import { SkuModal as SkuModalComp } from './SkuModal';
import { useModalScroll } from './hooks/useModalScroll';

import type { OnProductChangeParamType, OnProductChangeType } from '../types';
import { getDistributionList, getProduct } from '../Api';

import '../index.less';

const { Item } = List;

export type ChooseCommodityModalProps = {
  onProductChange: OnProductChangeType;
  dataSource: any[];
  onOk?: () => void;
};

const formActions = createAsyncFormActions();

export const ChooseCommodityModal = ({
  children,
  dataSource,
  onProductChange,
  onOk,
}: React.PropsWithChildren<ChooseCommodityModalProps>) => {
  const [chooseVisible, setChooseVisible] = useState(false);
  const { categories } = useStoreState('productCategory') as any;
  const selectedProductIdRef = useRef('');

  const [innerDataSource, setInnerDataSource] = useState([]);

  // useWatch(() => {
  //   setInnerDataSource(dataSource);
  // }, [dataSource]);

  const skuPanelEvent = useSkuPanelEvent();
  const skuPanelSkuChangeEvent = useSkuPanelSkuChangeEvent();

  // 存放搜索条件
  const [queryParams, setQueryParams] = useImmer({
    categoryId: '',
    name: '',
  });

  // 搜索功能
  const handleSearch = (searchValue: any) => {
    setQueryParams((draft) => {
      draft.name = searchValue.name;
      draft.categoryId = searchValue.categoryId;
    });
  };

  // 点击选择商品请求对应的商品数据
  const { run: getProductData, loading: getProductLoading } = useRequest(
    (id) => {
      selectedProductIdRef.current = id;
      return getProduct(id);
    },
    {
      manual: true,
      formatResult: (res) => res.data,
      onSuccess: (result) => {
        skuPanelEvent.emit({ data: result, isUpdate: false });
      },
    },
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { data, loading: isLoading, loadMore, reload, noMore } = useRequest(
    (params) => {
      const size = 20;
      const current = params?.nextPage || 1;
      return getDistributionList({
        current,
        size,
        productState: 1,
        ...queryParams,
      }).then((res: any) => ({
        nextPage: current + 1,
        total: res.data.total,
        list: res.data.records,
      }));
    },
    {
      loadMore: true,
      ref: containerRef,
      isNoMore: (d) => (d ? d.list.length >= d.total : false),
    },
  );

  useMount(() => {
    window.$fastDispatch((model) => model.productCategory.handleRequestCategories, {
      resetRequest: true,
    });
  });

  // 搜索触发重新请求
  useUpdateLayoutEffect(() => {
    reload();
  }, [queryParams]);

  const handleBottom = () => {
    if (noMore) {
      return;
    }
    loadMore();
  };

  const handleCancel = () => {
    setChooseVisible(false);
    setInnerDataSource([]);
  };

  const handleInnerDataSource = (opt?: Partial<OnProductChangeParamType>) => {
    const newData = opt?.data ?? dataSource;

    setInnerDataSource(newData);
    onProductChange({ data: newData, ...opt });
  };

  const { modalClassName, startScrollListener } = useModalScroll({ handleBottom });

  const Footer = () => {
    const [, runReRender] = useState([]);

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <SelectedCommodityModal
          setVisible={setChooseVisible}
          dataSource={innerDataSource}
          onProductChange={(v) => {
            handleInnerDataSource(v);
            setTimeout(() => {
              runReRender([]);
            });
          }}
        />

        <ButtonList
          list={[
            {
              text: '确定',
              type: 'primary',
              onClick: () => {
                handleCancel();
                onOk?.();
              },
            },
          ]}
        />
      </div>
    );
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setChooseVisible(true);
          startScrollListener();
        }}
      >
        {children}
      </Button>

      <ModalWrapper
        {...{
          title: '选择商品',
          visible: chooseVisible,
          className: modalClassName,
          bodyStyle: {
            backgroundColor: '#f0f2f5',
          },
          onCancel: handleCancel,
          onOk: handleCancel,
          footer: () => <Footer />,
          children: (
            <>
              <SearchFrom
                {...{
                  onSearch: (searchValue) => handleSearch(searchValue),
                  onReset: () =>
                    setQueryParams((draft) => {
                      draft.name = '';
                      draft.categoryId = '';
                    }),
                  actions: formActions,
                  items: [
                    {
                      name: {
                        title: '商品名称',
                        type: 'string',
                        'x-props': {
                          placeholder: '商品名称',
                        },
                      },
                      categoryId: {
                        title: '商品类目',
                        type: 'treeSelect',
                        'x-component-props': {
                          placeholder: '选择类目',
                          treeData: categories,
                          showSearch: true,
                          treeNodeFilterProp: 'title',
                          treeDefaultExpandAll: false,
                        },
                      },
                    },
                  ],
                }}
              />

              <List
                loading={isLoading}
                grid={{
                  gutter: 8,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
                  xl: 5,
                  xxl: 6,
                }}
                className="list-content"
                dataSource={data?.list}
                renderItem={(item: any) => {
                  return (
                    <Item className="list">
                      <Card className="list-item">
                        <div className="produce-img-content">
                          <img src={item.image} alt="" className="produce-img" />
                        </div>
                        <p className="produce-desc">{item.name}</p>
                        <div className="produce-btn">
                          <Button
                            loading={selectedProductIdRef.current === item.id && getProductLoading}
                            block
                            onClick={() => {
                              getProductData(item.id);
                            }}
                          >
                            选择商品
                          </Button>
                        </div>
                      </Card>
                    </Item>
                  );
                }}
              />

              <SkuModalComp
                {...{
                  skuPanelEvent,
                  skuPanelSkuChangeEvent,
                  dataSource: innerDataSource,
                  onProductChange: handleInnerDataSource,
                }}
              />
            </>
          ),
        }}
      />
    </>
  );
};
