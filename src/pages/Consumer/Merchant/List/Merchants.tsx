import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { memo, useState, useCallback } from 'react';
import { Modal, message } from 'antd';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import {
  generateDefaultSelectOptions,
  convenientDateRangeSchema,
  useGeneralTableActions,
  GeneralTableLayout,
} from '@/components/Business/Table';

import { Question } from '@/pages/Dashboard/Workplace';

import type { MerchantColumns } from '../Api';
import {
  getMerchantList,
  ChargeVipDetail,
  showAuditIsOpen,
  getSalesmanNotPage,
  resetPassword,
} from '../Api';
import MerchantVip from '../component/MerchantVip';

import { useMerchantForm } from '../form/Form';
import { useGoldMerchantForm } from '../form/GoldMerchantForm';
import { useGoldMerchantPayModal } from '../form/GoldMerchantPayModal';
import { useAuditDeployForm } from '../form/AuditDeployForm';
import { useAuditMerchantForm } from '../form/AuditMerchantForm';

import { auditStatusMap, auditStatusColorMap } from '../Constants';

const { confirm } = Modal;

export const Merchants = memo(({ auditStatus }: any) => {
  const { productCategories } = useStoreState('merchant');

  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([] as any);
  const [openMerchantVip, setOpenMerchant] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [vipName, setVipName] = useState('');
  const [partners, setPartners] = useState([]);
  const [vipExpireTime, setVipExpireTime] = useState('');
  const [isVip, setIsVip] = useState(1);
  const [vipDetail, setVipDetail] = useState({});

  const request = (params: any) => {
    if (params.startTime) {
      params.startTime = `${params.startTime} 00:00:00`;
    }

    if (params.endTime) {
      params.endTime = `${params.endTime} 23:59:59`;
    }
    params.auditStatus = auditStatus;

    return getMerchantList(params);
  };

  const { actionsRef } = useGeneralTableActions<MerchantColumns>();

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  const handleGetChargeDetail = () => {
    ChargeVipDetail().then((res) => {
      const { data } = res;
      const newDetail = {
        vipName: data.vipName,
        storePay: data.storePay,
        currentPrice: data.currentPrice,
        originalPrice: data.originalPrice,
      };
      setVipName(data.vipName);
      setVipDetail(newDetail);
    });
  };

  const handleCreateGoldMerchant = useCallback(() => {
    handleGetChargeDetail();
    return actionsRef.current.reload();
  }, []);

  useMount(() => {
    getSalesmanNotPage().then((res) => {
      const partner = res.data.map((item: any) => ({
        value: item.id,
        label: `${item.salesmanName}（${item.registerPhone}）`,
      }));

      setPartners(partner);
    });
    handleGetChargeDetail();
  });

  const { openForm, ModalFormElement } = useMerchantForm({
    onAddSuccess: handleCreateAdSuccess,
    downPartners: partners,
    categories: productCategories,
  });

  const { openForm: openVipForm, ModalFormElement: ModalVipFormElement } = useGoldMerchantForm({
    onAddSuccess: handleCreateGoldMerchant,
  });

  const { openGoldMerchantPay, ModalGoldMerchantPayElement } = useGoldMerchantPayModal();

  const { openForm: openAuditDeploy, ModalFormElement: ModalAuditDeployFormElement } =
    useAuditDeployForm({
      onAddSuccess: handleCreateAdSuccess,
    });

  const handleAuditIsOpen = () => {
    showAuditIsOpen().then((res) => {
      const initMap = { isOpen: !res.data };
      openAuditDeploy({ ...initMap });
    });
  };

  const handleResetPassword = () => {
    if (selectedProductRowKeys.length > 0) {
      confirm({
        title: '重置密码确认',
        icon: <QuestionCircleOutlined />,
        content: '确定将选择账号密码重置为123456，确定后进行账号密码重置',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          resetPassword(selectedProductRowKeys).then(() => {
            actionsRef.current.reload();
          });
        },
        onCancel() {
          console.log('onCancel');
        },
      });
    } else {
      message.warning('请选择一条数据');
    }
  };

  const { openForm: openAuditMerchant, ModalFormElement: ModalAuditMerchantFormElement } =
    useAuditMerchantForm({
      onAddSuccess: handleCreateAdSuccess,
    });

  const handleOpenVip = (record: any) => {
    setOpenMerchant(true);
    setMerchantId(record.id);
    setVipExpireTime(record.vipExpireTime);
    setIsVip(record.hasVip);
  };

  const vipMessageOpt = {
    width: 1000,
    storeId: merchantId,
    visible: openMerchantVip,
    isVip,
    vipName,
    vipExpireTime: vipExpireTime.substring(0, 10),
    ModalVipFormElement,
    onCancel() {
      setOpenMerchant(false);
    },
    onOk() {
      setOpenMerchant(false);
    },
  };

  const handleSelectChange = (keys: any[]) => {
    setSelectedProductRowKeys(keys);
  };

  return (
    <>
      {ModalFormElement}
      {ModalVipFormElement}
      {ModalAuditDeployFormElement}
      {ModalAuditMerchantFormElement}
      {ModalGoldMerchantPayElement}

      {openMerchantVip && <MerchantVip {...vipMessageOpt} />}

      <GeneralTableLayout<MerchantColumns>
        tableProps={{
          tableLayout: 'auto',
          rowSelection: {
            onChange: handleSelectChange,
          },
        }}
        request={request}
        useTableOptions={{
          formatResult: (res) => ({
            total: res.data.total,
            data: res.data.records?.map((item: any) => ({
              ...item,
              fullAddress: ['provinceName', 'cityName', 'areaName', 'detailedAddress']
                .map((k) => item[k])
                .join(''),
            })),
          }),
        }}
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          items: [
            {
              content: {
                title: '模糊搜索',
                type: 'string',
                'x-component-props': {
                  placeholder: '商家姓名、注册手机、联系手机',
                },
              },
              '[startTime,endTime]': convenientDateRangeSchema(),
            },
            {
              hasVip: {
                title: '会员等级',
                type: 'checkableTags',
                default: 3,
                'x-component-props': {
                  options: generateDefaultSelectOptions(
                    [
                      { label: '普通商家', value: 1 },
                      { label: '金牌商家', value: 0 },
                    ],
                    3,
                  ),
                },
              },
            },
          ],
        }}
        operationButtonListProps={{
          maxCount: 5,
          list: [
            {
              text: '新增商家',
              type: 'primary',
              onClick: () => openForm(),
            },
            {
              text: '金牌商家付费设置',
              type: 'primary',
              onClick: () => openVipForm({ ...vipDetail }),
            },
            {
              text: '商家审核设置',
              type: 'primary',
              onClick: () => handleAuditIsOpen(),
            },
            {
              text: '商家会员付费管理',
              type: 'primary',
              onClick: () => openGoldMerchantPay(),
            },
            { text: '密码重置', onClick: () => handleResetPassword(), icon: 'RetweetOutlined' },
          ],
        }}
        columns={[
          {
            title: '店铺名称',
            dataIndex: 'storeName',
          },
          {
            title: '商家姓名',
            dataIndex: 'linkName',
          },
          {
            title: '联系手机',
            dataIndex: 'linkPhone',
            width: '10%',
          },
          {
            title: '详细地址',
            dataIndex: 'fullAddress',
            width: '25%',
            ellipsisProps: true,
          },
          {
            title: '注册时间',
            dataIndex: 'createTime',
            dateFormatter: 'string',
          },
          {
            title: '状态',
            dataIndex: 'auditStatus',
            render: (type: number, row: any) => {
              return (
                <span style={{ color: auditStatusColorMap[type] }}>
                  {auditStatusMap[type]}

                  {type === 2 && (
                    <Question iconStyle={{ marginLeft: 6 }} title="" dataSource={[row.auditLog]} />
                  )}
                </span>
              );
            },
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '审核',
                  onClick: () => openAuditMerchant({ ...row }),
                  visible: ![1, 2].includes(row.auditStatus),
                },
                {
                  text: '编辑',
                  onClick: () =>
                    openForm({
                      ...row,
                      partnerId: row.partnerId === '-1' ? '0' : row.partnerId,
                      place: [row.provinceName, row.cityName, row.areaName] || undefined,
                    }),
                },
                { text: '会员信息', onClick: () => handleOpenVip(row) },
              ],
            },
          },
        ]}
      />
    </>
  );
});
