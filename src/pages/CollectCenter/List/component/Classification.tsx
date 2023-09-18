import { memo } from 'react';
import { Col, Card, Row } from 'antd';

type IProps = {
  value: string;
  onChange: (v: string) => void;
  status: number;
  data: any[];
  total: number;
  searchValues: string;
};

export const Classification = memo(
  ({ onChange, value, status, data, total, searchValues }: IProps) => {
    const componentMap = {
      0: () => (
        <Row>
          <span className="classification-text">商品分类:</span>
          {[{ name: '全部', categoryId: '' }, ...data].map((k, index) => {
            return (
              <div key={`${k.categoryId + index}`} className="text">
                <div
                  className={value === k.categoryId ? 'activeColor' : undefined}
                  onClick={() => onChange(k.categoryId)}
                >
                  {k.name}
                </div>
              </div>
            );
          })}
        </Row>
      ),
      1: () => (
        <Row>
          <Col className="found">
            <div>全部结果:</div>
            <div>
              找到<span className="found-total">{total}</span>个
              <span className="search-key">“{searchValues}”</span>相关的商品
            </div>
          </Col>
        </Row>
      ),
      2: () => (
        <Row>
          <Col>
            <span className="no-found">没有找到相关商品信息哦~</span>
          </Col>
        </Row>
      ),
    };

    return <Card className="classification-content">{componentMap[status]?.()}</Card>;
  },
);
