import { useRef, useMemo, useState, useEffect } from 'react';
import { List, Card, Col, Row, BackTop, Spin } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';

import { useImmer } from 'use-immer';

import { useDebounceByMemo, useLoadingWrapper } from '@/foundations/hooks';
import { useMount, usePersistFn, useEventListener } from 'ahooks';
import { history } from 'umi';
import './index.less';

import type { RouteChildrenProps } from '@/typings/basis';

import { SearchCard } from './component/SearchCard';
import { Sorting } from './component/Sorting';
import { Classification } from './component/Classification';
import { SupplyRange } from './component/SupplyRange';

import { getCProduceList, getTreeList } from '../Api';

type IDataProps = {
  image: string;
  name: string;
  minSupplyPrice: string;
  maxSupplyPrice: string;
  minProfitMargin: number;
  maxProfitMargin: number;
  id: string;
};

// 处理利润率乘以100%
const format = (point: number) => {
  const formate = parseFloat(point * 100).toFixed(2);
  return `${formate}%`;
};

const { Item } = List;

// 回到顶部按钮样式
const style = {
  height: 60,
  width: 60,
  borderRadius: '50%',
  backgroundColor: '#FFF',
  color: '#666',
  textAlign: 'center',
  fontSize: 40,
};

export default function CollectCenterList({ location }: RouteChildrenProps) {
  const [queryParams, setQueryParams] = useImmer({
    categoryId: '',
    name: location.state?.value || '',
    supplyPriceStart: '',
    supplyPriceEnd: '',
    sortFields: [] as string[],
  });

  // 存放商品列表数据
  const [productRes, setProductRes] = useImmer({
    total: 0,
    current: 1,
    size: 20,
    data: [],
  });

  const canLoadMore = useRef(true);

  const [treeList, setTreeList] = useState([]); // 存放类目列表

  const { isLoading, runRequest } = useLoadingWrapper({ seconds: 0.26 });

  // 加载更多数据
  const loadMoreProductList = usePersistFn((pageOptions?: { current?: number; size?: number }) => {
    const size = pageOptions?.size ?? productRes.size;
    let current = pageOptions?.current ?? productRes.current + 1;
    if (current === 2) {
      current = 3;
    }
    runRequest(() =>
      getCProduceList({
        ...queryParams,
        current,
        size,
      }).then((res) => {
        const { data } = res;
        setProductRes((draft) => {
          draft.data = !pageOptions?.current ? draft.data.concat(data.records) : data.records;
          draft.total = data.total;
          draft.current = data.current;
          canLoadMore.current = draft.total > draft.data.length;
        });
      }),
    );
  });

  // 使用防抖优化滚动事件
  const HandleScroll = useDebounceByMemo(() => {
    if (!canLoadMore.current) {
      return;
    }
    // 滚动条到底部距离小于300加载更多数据
    if (document.body.scrollHeight - (document.body.clientHeight + document.body.scrollTop) < 300) {
      loadMoreProductList({ size: 10 });
    }
  });

  // 加载第一页数据
  useEffect(() => {
    loadMoreProductList({ current: 1 });
  }, [queryParams]);

  useEventListener('scroll', HandleScroll, { target: document.body });

  useMount(() => {
    getTreeList().then((res) => {
      const { data } = res;
      setTreeList(data);
    });
  });

  // 搜索功能
  const handleSearch = (value: string) => {
    setQueryParams((draft) => {
      draft.name = value;
    });
  };

  // 点击集采中心回到有分类的页面
  const handleBackInitialStatus = () => {
    setQueryParams((d) => {
      d.name = '';
    });
  };

  // 监听最低价
  const handleWatchMinPrice = (value: string) => {
    setQueryParams((draft) => {
      draft.supplyPriceStart = value;
    });
  };

  // 监听最高价
  const HandleWatchMaxPrice = (value: string) => {
    if (value >= queryParams.supplyPriceStart) {
      setQueryParams((draft) => {
        draft.supplyPriceEnd = value;
      });
    }
  };

  // 处理分类状态
  const classificationStatusByTotalAndSearchResult = useMemo(
    () => (queryParams.name ? (productRes.total === 0 ? 2 : 1) : 0),
    [queryParams.name, productRes.total],
  );

  // 跳转商品详情
  const handleGoDetail = (id: string) => {
    history.push(`/collection/Product/detail/${id}`);
  };

  return (
    <div>
      <SearchCard
        defaultValue={queryParams.name}
        onSearch={handleSearch}
        onClick={handleBackInitialStatus}
      />
      <Row>
        <Col span={24}>
          <Classification
            onChange={(id) => {
              setQueryParams((draft) => {
                draft.categoryId = id;
              });
            }}
            value={queryParams.categoryId}
            status={classificationStatusByTotalAndSearchResult}
            data={treeList}
            total={productRes.total}
            searchValues={queryParams.name}
          />
        </Col>
      </Row>
      <Row className="condition-content">
        <Col>
          <Sorting
            onChange={(v: any) =>
              setQueryParams((draft) => {
                draft.sortFields = v;
              })
            }
          />
        </Col>
        <Col>
          <SupplyRange watchMinPrice={handleWatchMinPrice} watchMaxPrice={HandleWatchMaxPrice} />
        </Col>
      </Row>
      <Spin spinning={isLoading}>
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 5,
            xl: 5,
            xxl: 6,
          }}
          className="list-content"
          dataSource={productRes.data}
          renderItem={(item: IDataProps) => {
            return (
              <Item className="list">
                <Card
                  onClick={() => {
                    handleGoDetail(item.id);
                  }}
                  className="list-item"
                >
                  <div className="produce-img-content">
                    <img src={item.image} alt="" className="produce-img" />
                  </div>
                  <p className="produce-desc">{item.name}</p>

                  <p className="supply-price">
                    供货价：￥
                    {item.minSupplyPrice
                      ? [
                          item.minSupplyPrice,
                          item.maxSupplyPrice !== item.minSupplyPrice && item.maxSupplyPrice,
                        ]
                          .filter(Boolean)
                          .join('~￥')
                      : '***'}
                  </p>

                  <p className="profits">
                    利润：
                    <span>
                      {item.minSupplyPrice
                        ? [
                            format(item.minProfitMargin),
                            format(item.maxProfitMargin) !== format(item.minProfitMargin) &&
                              format(item.maxProfitMargin),
                          ]
                            .filter(Boolean)
                            .join('~')
                        : '**%'}
                    </span>
                  </p>
                </Card>
              </Item>
            );
          }}
        />
      </Spin>

      <BackTop target={() => document.body}>
        <div style={style}>
          <VerticalAlignTopOutlined />
        </div>
      </BackTop>
    </div>
  );
}
