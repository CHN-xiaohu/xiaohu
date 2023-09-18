import { Col, Row } from 'antd';

import styles from './style.less';

import type { ListItem } from '..';

export type RowProp = {
  cols: ColProp[];
};

type ColProp = {
  placeholder?: string;
  item?: ListItem;
  span?: number;
  children?: RowProp[];
};

type Props = {
  rowData: RowProp[];
  style?: string;
};

export default (props: Props) => {
  const { rowData = [], style = {} } = props;

  const renderCol = (colList: ColProp[]) => {
    const { length } = colList;
    const defaultSpan = 24 / length;
    return colList.map((e, i) => {
      const src = e.item && e.item.picUrl;
      const span = e.span || defaultSpan;
      const children = e.children || null;
      const placeholder = e.placeholder || '';
      const Content = children ? (
        // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
        renderRow(children)
      ) : src ? (
        <img
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={styles.img}
          src={src}
          alt={placeholder}
        />
      ) : (
        <div className={styles.img}>{placeholder}</div>
      );
      return (
        <Col
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          span={span}
          className={styles.col}
        >
          {Content}
        </Col>
      );
    });
  };

  const renderRow = (rowList: RowProp[]) =>
    rowList.map((e, i) => (
      <Row
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        style={{
          height: `${100 / rowList.length}%`,
        }}
        justify="space-between"
        gutter={[2, 2]}
      >
        {renderCol(e.cols)}
      </Row>
    ));
  return (
    <div style={style} className={styles.wrapper}>
      {renderRow(rowData)}
    </div>
  );
};
