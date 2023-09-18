import { useMemo } from 'react';
import * as React from 'react';
import { Breadcrumb, Popconfirm } from 'antd';

import styles from './index.less';

export type CategoryBreadcrumbProps = {
  value: { label: string; value: string }[];
  currentStep: number;
  isShowEditCategoryPopconfirm: boolean;
  canEditCategory?: boolean;
  onClickEdit?: () => void;
};

const ShowErrorEl = (message: string, style?: React.CSSProperties) => (
  <div className="ant-form-item-has-error" style={style}>
    <div className="ant-form-item-explain">
      <span>{message}</span>
    </div>
  </div>
);

const tipsMap = {
  1: '请选择二级分类',
  2: '请选择三级分类',
};

export const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = React.memo(
  ({
    value = [],
    canEditCategory = true,
    currentStep,
    isShowEditCategoryPopconfirm,
    onClickEdit,
  }) => {
    return useMemo(() => {
      const renderEditButton = () =>
        !isShowEditCategoryPopconfirm ? (
          <a style={{ marginLeft: 10 }} onClick={onClickEdit}>
            修改类目
          </a>
        ) : (
          <Popconfirm
            title="切换类目，会造成商品参数、销售属性丢失，是否继续切换？"
            onConfirm={onClickEdit}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ marginLeft: 10 }}>修改类目</a>
          </Popconfirm>
        );

      return (
        <div className={styles.wrapper}>
          <span className={styles.text}>
            {!value.length ? ShowErrorEl('尚未选择类目, 请选择至三级分类') : '已选类目'}
          </span>
          <Breadcrumb separator=">">
            {value.map((item) => (
              <Breadcrumb.Item key={item.value}>{item.label}</Breadcrumb.Item>
            ))}
          </Breadcrumb>

          {!!tipsMap[value.length] && ShowErrorEl(tipsMap[value.length], { marginLeft: 30 })}

          {canEditCategory && !!currentStep && renderEditButton()}
        </div>
      );
    }, [value, currentStep, canEditCategory, isShowEditCategoryPopconfirm]);
  },
);
