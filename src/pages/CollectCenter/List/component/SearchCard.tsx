import { memo } from 'react';
import { Row, Col, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './index.less';

const { Search } = Input;

type Props = {
  defaultValue?: string;
  onSearch: (v: any) => void;
  onClick: (v: any) => void;
};

export const SearchCard = memo(({ defaultValue, onSearch, onClick }: Props) => {
  return (
    <Row className="search-content">
      <Col className="content-title" xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        <span className="title-text" onClick={onClick}>
          采集中心
        </span>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
        <Search
          enterButton="搜索"
          onSearch={onSearch}
          defaultValue={defaultValue}
          placeholder="请输入商品关键字"
          prefix={<SearchOutlined style={{ color: '#E0E0E0' }} />}
        />
      </Col>
    </Row>
  );
});
