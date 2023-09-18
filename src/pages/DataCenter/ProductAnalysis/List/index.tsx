import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import { useState, useCallback } from 'react';

import type { SorterResult } from 'antd/lib/table/interface';

import { useStoresToSelectOptions } from '../../useStoresToSelectOptions';

import type { DataCenterColumns } from '../../Api';
import { getProductAnalysis } from '../../Api';
import { todayTime, stringFilterOption } from '../../Constants';

export default function ProductAnalysis() {
  const [isShowSelectStoreId, setShowSelectStoreId] = useState(false);
  const { storesSelectOptions } = useStoresToSelectOptions();
  const { actionsRef } = useGeneralTableActions<DataCenterColumns>();

  const handleGetRequestList = (params: any) => {
    if (Number(params?.sourceType) !== 0) {
      setShowSelectStoreId(false);
      params.storeId = '';
    }
    if (!params.start) {
      params.start = todayTime().start;
      params.end = todayTime().end;
    }
    return getProductAnalysis(params);
  };

  const handleSelect = (value: any) => {
    setShowSelectStoreId(value === 0);
  };

  const handleTableChange = useCallback(
    (_pagination: any, _filters: any, sorter: SorterResult<DataCenterColumns>) => {
      const fieldMap = {
        field: sorter.field,
        sequenceType: sorter.order === 'descend' ? 'DESC' : 'ASC',
      };
      const searchFormData = {} as AnyObject;
      const sortList = [fieldMap];
      if (sorter.order && sorter.columnKey) {
        searchFormData.sorts = sortList;
      }
      actionsRef.current.reload({
        temporarySearchFormData: {
          current: _pagination.current,
        },
        searchFormData,
      });
    },
    [],
  );

  return (
    <>
      <GeneralTableLayout<DataCenterColumns>
        request={(params) => handleGetRequestList(params) as any}
        getActions={actionsRef}
        operationButtonListProps={false}
        tableProps={{
          onChange: handleTableChange as any,
          rowKey: 'productInfoId',
          scroll: { x: 1500 },
          style: { width: 1600 },
        }}
        searchProps={{
          items: [
            {
              '[start,end]': {
                title: '统计时间',
                type: 'convenientDateRange',
                'x-component-props': {
                  defaultValue: [todayTime().start, todayTime().end],
                  format: 'YYYY-MM-DD',
                },
              },
            },
            {
              sourceType: {
                title: '数据来源',
                type: 'string',
                'x-component-props': {
                  onSelect: handleSelect,

                  placeholder: '所有/小程序/APP/PC',
                },
                enum: [
                  {
                    label: '所有',
                    value: '',
                  },
                  {
                    label: '小程序',
                    value: 0,
                  },
                  {
                    label: 'APP',
                    value: 1,
                  },
                  {
                    label: 'PC',
                    value: 2,
                  },
                ],
              },
              storeId: {
                title: '选择店铺',
                type: 'string',
                default: '',
                visible: isShowSelectStoreId,
                'x-component-props': {
                  placeholder: '请选择店铺',
                  dataSource: [{ value: '', label: '所有店铺' }, ...storesSelectOptions],
                  showSearch: true,
                  filterOption: stringFilterOption,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '商品',
            dataIndex: 'name',
            width: 140,
            fixed: 'left',
          },
          {
            title: '访客数',
            dataIndex: 'vistorNum',
            sorter: true,
            width: 50,
          },
          {
            title: '浏览数',
            dataIndex: 'viewNum',
            sorter: true,
            width: 50,
          },
          {
            title: '加购数',
            dataIndex: 'addCartNum',
            sorter: true,
            width: 50,
          },
          {
            title: '下单件数',
            dataIndex: 'orderItemNum',
            sorter: true,
            width: 60,
          },
          {
            title: '支付件数',
            dataIndex: 'payItemNum',
            sorter: true,
            width: 60,
          },
          {
            title: '支付金额',
            dataIndex: 'payAmount',
            sorter: true,
            width: 60,
          },
          {
            title: '支付客单价',
            dataIndex: 'payEachPrice',
            sorter: true,
            width: 80,
          },
          {
            title: '支付人数',
            dataIndex: 'payPeopleNum',
            sorter: true,
            width: 70,
          },
          {
            title: '成功退款笔数',
            dataIndex: 'refundNum',
            sorter: true,
            width: 90,
          },
          {
            title: '成功退款金额',
            dataIndex: 'refundAmount',
            sorter: true,
            width: 90,
          },
        ]}
      />
    </>
  );
}
