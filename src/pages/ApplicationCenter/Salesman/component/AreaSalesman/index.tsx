import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useCallback, useState } from 'react';

import { useAreaSetting } from './useAreaSetting';

import type { SalesmanColumns } from '../../Api';
import { getTenantRegionalSalesman, getTenantSelectedRegionalAgentInfos } from '../../Api';

export default function AreaSalesman() {
  const { actionsRef } = useGeneralTableActions<SalesmanColumns>();
  const [areaCodeList, setAreaCodeList] = useState([]);

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const { openForm, ModalFormElement } = useAreaSetting({
    onAddSuccess: handleCreateAdSuccess,
  });

  const handleAddressCode = (addressCodes: any, isHasId: boolean) =>
    addressCodes?.map((item: any) =>
      ['province', 'city', 'area']
        .map((v) => ({
          value: isHasId ? item[`${v}Id`] : item[`${v}Name`],
          label: item[`${v}Name`],
        }))
        .filter((v: any) => v.value !== '' && v.value !== '-1'),
    );

  const handleOpens = (records: any) => {
    getTenantSelectedRegionalAgentInfos(records?.id).then((res) => {
      openForm({
        ...records,
        sysSalesmanRegionalAgentInfos:
          records?.sysSalesmanRegionalAgentInfos.length > 0
            ? handleAddressCode(records?.sysSalesmanRegionalAgentInfos, false)
            : [],
        initSysSalesmanRegionalAgentInfos:
          records?.sysSalesmanRegionalAgentInfos.length > 0
            ? handleAddressCode(records?.sysSalesmanRegionalAgentInfos, true)
            : [],
        alreadyAddressList: res?.data?.length > 0 ? handleAddressCode(res?.data, false) : [],
      });
    });
  };

  const handleChangeCascader = (value: any, selectedOptions: any) => {
    const codeList = selectedOptions?.map((item: any) => item.name);
    setAreaCodeList(codeList);
  };

  return (
    <>
      {ModalFormElement}
      <GeneralTableLayout<SalesmanColumns>
        request={(params: any) =>
          getTenantRegionalSalesman({
            pageNo: params?.current,
            pageSize: params?.size,
            ...params,
          }) as any
        }
        getActions={actionsRef}
        operationButtonListProps={false}
        useTableOptions={{
          formatSearchParams: (params) => ({
            ...params,
            provinceName: params?.addressId?.[0] ? areaCodeList![0] : undefined,
            cityName: params?.addressId?.[1] ? areaCodeList![1] : undefined,
            areaName: params?.addressId?.[2] ? areaCodeList![2] : undefined,
            addressName: undefined,
          }),
        }}
        searchProps={{
          minItem: 3,
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '业务员姓名、注册手机',
                },
              },
              addressId: {
                title: '服务区域',
                type: 'area',
                'x-component-props': {
                  onChange: handleChangeCascader,
                  showAreaLevel: 3,
                  placeholder: '请选择服务区域',
                  changeOnSelect: true,
                  expandTrigger: 'click',
                  isUseCode: false,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '名称',
            dataIndex: 'salesmanName',
            width: '15%',
          },
          {
            title: '注册手机',
            dataIndex: 'registerPhone',
            width: '15%',
          },
          {
            title: '服务区域',
            dataIndex: 'sysSalesmanRegionalAgentInfos',
            width: '55%',
            render: (data: any) => {
              const addressDetail = data
                ?.map((items: any) => `${items?.provinceName}${items?.cityName}${items?.areaName}`)
                ?.join('、');
              return <div>{addressDetail || '--'}</div>;
            },
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: '15%',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '区域配置',
                  onClick: () => {
                    handleOpens(row);
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
