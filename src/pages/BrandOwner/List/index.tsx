import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import { useState, useCallback, useMemo } from 'react';
import { history } from 'umi';
import { Modal, Switch } from 'antd';
import { useMount, useRequest } from 'ahooks';
import { stringify } from 'qs';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useChannelsToSelectOptions } from './useChannelsToSelectOptions';

import { useBrandOwnerForm } from '../Form';
import type { BrandOwnerColumns } from '../Api';
import { generateCode, updateStatus, getBrandOwnerList } from '../Api';

export const versionTypes = {
  0: '企业版',
  1: '门店版',
  2: '渠道版',
};

export const versionTypeSelect = Object.keys(versionTypes).map((item) => {
  return { label: versionTypes[item], value: Number(item) };
});

export default function BrandOwnerList() {
  const { actionsRef } = useGeneralTableActions<BrandOwnerColumns>();
  const windows = typeof window !== 'undefined' ? window : ({} as any);
  const [isChangeStatus, setChangeStatus] = useState(false);
  const [brandOwnerId, setBrandOwnerId] = useState('');
  const [brandOwnerStatus, setBrandOwnerStatus] = useState('');

  const { channelsSelectOptions, runGetBelongChannel } = useChannelsToSelectOptions();
  const { categories, listValid } = useStoreState('productCategory');

  const listValidMap = useMemo(
    () =>
      listValid.reduce(
        (results, current) => ({ ...results, [current.id]: current }),
        {} as Record<string, typeof listValid[number]>,
      ),
    [listValid],
  );

  useMount(() => {
    window.$fastDispatch((model) => model.productCategory.handleRequestCategories, {
      resetRequest: true,
    });
  });

  const handleCreateAdSuccess = useCallback(() => {
    runGetBelongChannel();
    actionsRef.current.reload();
  }, []);

  const { data: loginCode, run } = useRequest(
    (params) => generateCode({ account: params.account, loginTenantCode: params.loginTenantCode }),
    {
      formatResult: (res) => res.data,
      manual: true,
      onSuccess: (result, params: any) => {
        if (result) {
          // eslint-disable-next-line max-len
          const openWin = windows.open(
            `https://${params[0]?.domain}/users/login?${stringify({
              grantType: 'pps_oauth',
              account: params[0]?.account,
              code: loginCode,
            })}`,
            '_blank',
          );
          openWin.opener = null;
        }
      },
    },
  );

  const jumpLanding = (_data: any, records: any) => {
    run({
      account: records?.tenantAccount,
      loginTenantCode: records?.tenantCode,
      domain: records?.domain,
    });
  };

  const { openForm, ModalFormElement } = useBrandOwnerForm({
    onAddSuccess: handleCreateAdSuccess,
    channelsSelectOptions,
    versionTypeSelect,
    categories,
  });

  const onChangeStatus = (_: any, record: any) => {
    setChangeStatus(true);
    setBrandOwnerId(record.id);
    setBrandOwnerStatus(record.status);
  };

  const statusOpt = {
    title: '提示',
    visible: isChangeStatus,
    width: 250,
    onCancel() {
      setChangeStatus(false);
    },
    onOk() {
      setChangeStatus(false);
      updateStatus({ id: brandOwnerId }).then(() => {
        handleCreateAdSuccess();
      });
    },
  };

  return (
    <>
      {ModalFormElement}
      <Modal {...statusOpt}>
        {Number(brandOwnerStatus) === 0
          ? '确定禁用改品牌商吗？\n禁用后，品牌商应用无法正常使用'
          : '确定启用该品牌商吗？\n启用后，品牌商应用可正常使用'}
      </Modal>
      <GeneralTableLayout<BrandOwnerColumns, any>
        request={getBrandOwnerList as any}
        getActions={actionsRef}
        defaultAddOperationButtonListProps={{
          text: '新增',
          onClick: () => openForm(),
        }}
        tableProps={{
          scroll: { x: 1500 },
          style: { width: 1600 },
        }}
        searchProps={{
          items: [
            {
              selectField: {
                title: '模糊搜索',
                type: 'string',
                'x-component-props': {
                  placeholder: '品牌商名称、联系人、联系人手机',
                },
                col: 12,
              },
              '[checkStartDate,checkEndDate]': {
                title: '添加时间',
                type: 'convenientDateRange' as 'convenientDateRange',
                col: 12,
                'x-props': {
                  itemClassName: 'search-form__convenientDateRange',
                },
              },
            },
            {
              status: {
                title: '品牌商状态',
                type: 'checkableTags',
                default: '',
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '禁用', value: 0 },
                      { label: '启用', value: 1 },
                    ],
                    '',
                  ),
                },
              },
              belongChannel: {
                title: '所属渠道',
                type: 'string',
                enum: channelsSelectOptions || [],
                'x-component-props': {
                  showSearch: true,
                  filterOption: (input: any, option: any) => {
                    return (
                      option.children.indexOf(input) > -1 ||
                      option.contactnumber.indexOf(input) > -1
                    );
                  },
                  placeholder: '请选择渠道',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '品牌商名称',
            dataIndex: 'tenantName',
            render: (data: any, records: any) => {
              return (
                <div onClick={() => jumpLanding(data, records)} style={{ cursor: 'pointer' }}>
                  {data}
                </div>
              );
            },
            fixed: 'left',
          },
          {
            title: '账号',
            dataIndex: 'tenantAccount',
          },
          {
            title: '联系人',
            dataIndex: 'linkman',
          },
          {
            title: '联系人手机',
            dataIndex: 'contactNumber',
          },
          {
            title: '品牌商域名',
            dataIndex: 'domain',
          },
          {
            title: '所属渠道',
            dataIndex: 'belongChannel',
            render: (v, records) =>
              channelsSelectOptions.find((item) => item.value === v)?.label ||
              records?.belongChannelInfo?.applyTenantName,
          },
          {
            title: '版本类型',
            dataIndex: 'versionType',
            render: (v) => versionTypes[v] || '--',
          },
          {
            title: '金牌商家个数（个）',
            dataIndex: 'goldMerchantNumber',
          },
          {
            title: '短信条数',
            dataIndex: 'smsNumber',
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
          },
          {
            title: '品牌商状态',
            dataIndex: 'status',
            render: (data: any, records: any) => (
              <Switch checked={Number(data) === 1} onChange={(e) => onChangeStatus(e, records)} />
            ),
          },
          {
            title: '操作',
            dataIndex: 'id',
            fixed: 'right',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '编辑',
                  onClick: () => {
                    openForm({
                      ...row,
                      mainCategory: row?.mainCategory?.filter((id) => !!listValidMap[id]),
                    });
                  },
                },
                {
                  text: '开通服务管理',
                  onClick: () =>
                    history.push({
                      pathname: `/brandOwner/serviceManageList/${row.id}`,
                      query: {
                        tenantCode: row.tenantCode,
                        tenantName: row.tenantName,
                      },
                    }),
                },
              ],
            },
          },
        ]}
      />
    </>
  );
}
