import * as React from 'react';
import type { SorterResult } from 'antd/lib/table/interface';
import { message } from 'antd';
import { MoneyText } from '@/components/Library/MoneyText';
import { FormStep } from '@formily/antd-components';
import type { IFormAsyncActions } from '@formily/antd';

export const getSearchFormData = (_pagination: any, _filters: any, sorter: SorterResult<any>) => {
  let searchFormData = {
    sortFields: '',
  };

  if (sorter.order && sorter.columnKey) {
    searchFormData = {
      sortFields: `${sorter.field},${sorter.order.toLocaleUpperCase().replace('END', '')}`,
    };
  }

  return {
    temporarySearchFormData: {
      current: _pagination.current,
    },
    searchFormData,
  };
};

const stateOpt = {
  1: '下',
  2: '上',
};

export const execUpdateProductState = ({
  selectedRowKeys,
  state,
  modal,
  onOk,
  content,
}: {
  selectedRowKeys: string[];
  state?: 1 | 2;
  modal: any;
  onOk: Function;
  content?: string | React.ReactNode;
}) => {
  if (!selectedRowKeys.length) {
    message.warning('请先勾选需要操作的商品');

    return;
  }

  modal.confirm({
    title: '提示',
    content: content || `确定${stateOpt[state || 1]}架选中的商品？`,
    cancelText: '取消',
    okText: '确定',
    onOk,
  });
};

export const showPriceOrBetween = (min: React.Key, max?: React.Key) => {
  if (min === max) {
    return <MoneyText>{min}</MoneyText>;
  }

  return (
    <span>
      <MoneyText>{min}</MoneyText> ~ <MoneyText>{max}</MoneyText>
    </span>
  );
};

export const scrollToCategoryLayoutBottom = () => {
  window.scrollTo({
    top: (document.getElementById('rootLayout')?.offsetTop || 600) + 88,
    behavior: 'smooth',
  });
};

// 回到第一步
export const goFirstStep = (formActions: IFormAsyncActions) => {
  formActions.dispatch!(FormStep.ON_FORM_STEP_GO_TO, { value: 0 });

  requestAnimationFrame(() => {
    scrollToCategoryLayoutBottom();
  });
};
