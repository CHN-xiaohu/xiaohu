import { useCallback, useState, useEffect } from 'react';

import { Tabs, Card, Button } from 'antd';

import Details from './component/Details';

import { useAddSalesmanForm } from '../component/useAddSalesmanForm';
import { useStoresToSelectOptions } from '../component/useStoresToSelectOptions';
import { useSalesmanNotPage } from '../component/useSalesmanNotPage';

import { getSalesmanDetail, getSalesmanIncome, getTenantSelectedRegionalAgentInfos } from '../Api';

const { TabPane } = Tabs;

export default function SalesmanDetail({
  match: {
    params: { id },
  },
}: any) {
  const { storesSelectOptions } = useStoresToSelectOptions();
  const { salesmanNotPageSelectOptions } = useSalesmanNotPage();
  const [details, setDetails] = useState({} as any);

  const handleEmpty = (emptyValue: any) => {
    if (emptyValue === '-1' || emptyValue === '') {
      return undefined;
    }
    return emptyValue;
  };

  const handleGetSalesmanDetail = () => {
    getSalesmanDetail(id).then((res) => {
      let responseData = {};
      const { data } = res;
      const addressDetail = data?.sysSalesmanRegionalAgentInfos
        ?.map((items: any) => `${items?.provinceName}${items?.cityName}${items?.areaName}`)
        ?.join('、');
      data.serviceArea = addressDetail || '无';
      data.provinceId = handleEmpty(data.provinceId);
      data.cityId = handleEmpty(data.cityId);
      data.areaId = handleEmpty(data.areaId);

      getSalesmanIncome(data?.storeId).then((resp) => {
        const datas = resp.data;
        const countNum = [
          { nums: datas?.orderNum, title: '今日新增订单数' },
          { nums: datas?.estimateIncome, title: '今日新增订单分佣金额' },
          { nums: datas?.totalOrderNum, title: '累计成交订单数' },
          { nums: datas?.totalAmount, title: '累计成交订单分佣金额' },
          { nums: datas?.salesmanNum, title: '累计经销商数' },
        ];
        responseData = {
          ...data,
          invitationSalesmanName: data.invitationSalesmanName || '无',
          places: data.provinceName + data.cityName + data.areaName || '无',
          place: [data.provinceName, data.cityName, data.areaName],
          linkPhone: data.linkPhone || '无',
          countNum,
        };
        setDetails(responseData);
      });
    });
  };

  useEffect(() => {
    handleGetSalesmanDetail();
  }, []);

  const handleCreateSuccess = useCallback(() => handleGetSalesmanDetail(), []);

  const { openForm, ModalFormElement } = useAddSalesmanForm({
    onAddSuccess: handleCreateSuccess,
    stores: storesSelectOptions,
    salesmanNotPage: salesmanNotPageSelectOptions,
  });

  const handleAddressCode = (addressCodes: any) =>
    addressCodes?.map((item: any) =>
      ['provinceId', 'cityId', 'areaId']
        .map((v) => item[v])
        .filter((v: any) => v !== '' && v !== '-1'),
    );

  const handleEditForm = (detailsValue: any) => {
    getTenantSelectedRegionalAgentInfos(id).then((res) => {
      openForm({
        ...detailsValue,
        countNum: undefined,
        sysSalesmanRegionalAgentInfos:
          detailsValue?.sysSalesmanRegionalAgentInfos.length > 0
            ? handleAddressCode(detailsValue?.sysSalesmanRegionalAgentInfos)
            : [],
        alreadyAddressList: res?.data?.length > 0 ? handleAddressCode(res?.data) : [],
      });
    });
  };

  return (
    <Card>
      {ModalFormElement}
      <Button type="primary" onClick={() => handleEditForm(details)}>
        编辑业务员信息
      </Button>
      <Tabs defaultActiveKey="1">
        <TabPane key="1" tab="基础信息">
          <Details initialValues={details} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
