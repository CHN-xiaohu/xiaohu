import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';
import { history } from 'umi';
import { Modal, message, Popover } from 'antd';
import QRCode from 'qrcode.react';

import { useCallback, useState, useEffect } from 'react';
import { ButtonList } from '@/components/Library/ButtonList';

import { UserInfoCache } from '@/services/User';

import type { SalesmanColumns } from '../../Api';
import { getSalesmanList, auditSalesmans, getPlatform } from '../../Api';
import { useAddSalesmanForm } from '../useAddSalesmanForm';
import { useRejectAuditForm } from '../useRejectAuditForm';

import { useStoresToSelectOptions } from '../useStoresToSelectOptions';
import { useSalesmanNotPage } from '../useSalesmanNotPage';

export default function ({ statusType }: any) {
  const { tenantCode, name, userId } = UserInfoCache.get({});

  const { actionsRef } = useGeneralTableActions<SalesmanColumns>();
  const { storesSelectOptions } = useStoresToSelectOptions();
  const { salesmanNotPageSelectOptions } = useSalesmanNotPage();
  const [isOpenPass, setOpenPass] = useState(false);
  const [selectList, setSelectList] = useState([] as any);
  const [compony, setCompony] = useState('');
  const [isJustOne, setJustOne] = useState(false);

  const handleCreateAdSuccess = useCallback(() => actionsRef.current.reload(), []);

  useEffect(() => {
    getPlatform(userId).then((res) => {
      const { data } = res;
      setCompony(data.companyName);
    });
  }, []);

  const { openForm, ModalFormElement } = useAddSalesmanForm({
    onAddSuccess: handleCreateAdSuccess,
    stores: storesSelectOptions,
    salesmanNotPage: salesmanNotPageSelectOptions,
  });

  const {
    openForm: openAuditReject,
    ModalFormElement: ModalAuditRejectFormElement,
  } = useRejectAuditForm({
    onAddSuccess: handleCreateAdSuccess,
    selectList,
  });

  const handleOpenPass = () => {
    if (isJustOne) {
      setSelectList([]);
    }
    if (selectList.length > 0 && !isJustOne) {
      setOpenPass(true);
    } else {
      message.warning('请先选择业务员！');
    }
  };

  const openPassObj = {
    visible: isOpenPass,
    title: '提示',
    width: 250,
    onCancel() {
      setOpenPass(false);
    },
    onOk() {
      auditSalesmans({
        ids: selectList,
        auditStatus: 1,
      }).then(() => {
        setOpenPass(false);
        return handleCreateAdSuccess();
      });
    },
  };

  const handleOpenAuditReject = () => {
    if (isJustOne) {
      setSelectList([]);
    }
    if (selectList.length > 0 && !isJustOne) {
      openAuditReject();
    } else {
      message.warning('请先选择业务员！');
    }
  };

  const handleOnChange = (values: any) => {
    setJustOne(false);
    setSelectList(values);
  };

  const handleDownloadQRCode = () => {
    const canvasImg = document.getElementById('qrCodeId'); // 获取canvas类型的二维码
    const img = new Image();
    img.src = (canvasImg as any).toDataURL('image/png'); // 将canvas对象转换为图片的data url
    const downLink = document.getElementById('down_link') as any;
    downLink.href = img.src;
    downLink.download = '二维码'; // 图片name
  };

  const handleGetQRCode = (codes: any) => {
    const baseUrl = 'https://app-h5.zazfix.com/agentRegister';
    return (
      <div
        style={{
          width: '150px',
          height: '180px',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <QRCode
          id="qrCodeId"
          style={{ width: '150px', height: '150px', padding: '4px' }}
          value={`${baseUrl}?salesmanId=${codes?.id}&tenantCode=${tenantCode}&app_name=${name}&company=${compony}`}
        />
        <a style={{ textAlign: 'center' }} onClick={() => handleDownloadQRCode()} id="down_link">
          点击下载
        </a>
      </div>
    );
  };

  const handleOperateButton = () => {
    if (statusType === '1') {
      return [
        {
          text: '新增业务员',
          type: 'primary',
          onClick: () => {
            openForm();
          },
        },
      ];
    }
    if (statusType === '0') {
      return [
        {
          text: '批量通过',
          type: 'primary',
          onClick: () => {
            handleOpenPass();
          },
        },
        {
          text: '批量拒绝',
          type: 'primary',
          onClick: () => {
            handleOpenAuditReject();
          },
        },
      ];
    }
    return [];
  };

  const handlePerPass = (id: string) => {
    setJustOne(true);
    setSelectList([id]);
    setOpenPass(true);
  };

  const handlePerReject = (id: string) => {
    setJustOne(true);
    setSelectList([id]);
    openAuditReject();
  };

  const hanldeOperationButton = (records: any) => {
    return {
      '1': [
        {
          text: (
            <div>
              <Popover content={handleGetQRCode(records)} placement="bottom">
                <span>下载推广码</span>
              </Popover>
            </div>
          ),
          type: 'primary',
          size: 'small',
          onClick: () => {
            handleGetQRCode(records);
          },
        },
        {
          text: '查看信息',
          type: 'primary',
          size: 'small',
          onClick: () => history.push(`/appCenter/salesman/detail/${records.id}`),
        },
      ],
      '0': [
        {
          text: '通过',
          type: 'primary',
          size: 'small',
          onClick: () => {
            handlePerPass(records.id);
          },
        },
        {
          text: '拒绝',
          type: 'primary',
          size: 'small',
          onClick: () => {
            handlePerReject(records.id);
          },
        },
      ],
    }[statusType];
  };

  return (
    <>
      <Modal {...openPassObj}>确定审核通过？</Modal>
      {ModalFormElement}
      {ModalAuditRejectFormElement}
      <GeneralTableLayout<SalesmanColumns>
        request={(params: any) =>
          getSalesmanList({
            pageNo: params?.current,
            pageSize: params?.size,
            ...params,
            auditStatus: statusType,
          }) as any
        }
        tableProps={{
          rowKey: 'id',
          rowSelection:
            statusType === '0' &&
            ({
              onChange: handleOnChange,
            } as any),
        }}
        getActions={actionsRef}
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
              '[startTime,endTime]': convenientDateRangeSchema({ title: '加入时间' }),
            },
            {
              id: {
                title: '邀请人',
                type: 'string',
                'x-component-props': {
                  dataSource: salesmanNotPageSelectOptions || [],
                  showSearch: true,
                  filterOption: (input: any, option: any) => {
                    return (
                      option.props.children.indexOf(input) > -1 ||
                      option.props.registerPhone.indexOf(input) > -1
                    );
                  },
                  placeholder: '名称、注册手机',
                },
              },
            },
          ],
        }}
        operationButtonListProps={{
          list: handleOperateButton() as any,
        }}
        columns={[
          {
            title: '名称',
            dataIndex: 'salesmanName',
            width: '13%',
          },
          {
            title: '注册手机',
            dataIndex: 'registerPhone',
            width: '10%',
          },
          {
            title: '邀请者',
            dataIndex: 'invitationSalesmanName',
            render: (data) => <span>{data || '--'}</span>,
            width: '20%',
          },
          {
            title: '成交订单数',
            dataIndex: 'totalOrderNum',
            width: '8%',
          },
          {
            title: '成交金额',
            dataIndex: 'totalOrderAmount',
            width: '8%',
          },
          {
            title: '累计收益',
            dataIndex: 'totalProfit',
            width: '8%',
          },
          {
            title: '累计经销商',
            dataIndex: 'totalStoreNum',
            width: '8%',
          },
          {
            title: <span>{Number(statusType) !== 1 ? '申请时间' : '加入时间'}</span>,
            dataIndex: 'createTime',
            width: '15%',
          },
          {
            title: <span>{statusType === '2' ? '拒绝理由' : '操作'}</span>,
            dataIndex: 'id',
            width: '10%',
            render: (data: any, records: any) => {
              return statusType === '2' ? (
                <span>{records?.auditMsg}</span>
              ) : (
                <ButtonList list={hanldeOperationButton(records)} />
              );
            },
          },
        ]}
      />
    </>
  );
}
