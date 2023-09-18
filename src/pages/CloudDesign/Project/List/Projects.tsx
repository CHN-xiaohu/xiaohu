import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { Modal, Button, message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { useRequest } from 'ahooks';
import qs from 'qs';

import { registerFormField, connect, mapStyledProps } from '@formily/antd';

import { FormOutlined } from '@ant-design/icons';

import { UserInfoCache } from '@/services/User';

import { useStoresToSelectOptions } from '@/pages/Coupon/useStoresToSelectOptions';

import { getPcMallDeploy } from '@/pages/System/MallConfig/Api';

import { useEditName } from '../component/useEditName';
import { useEditLabel } from '../component/useEditLabel';
import SelectDesigner from '../component/selectDesigner';

import styles from '../index.less';

import * as api from '../Api';

import type { ProjectColumns } from '../Api';
import { syncList } from '../Api';
import {
  getTabsList,
  syncDesign,
  getSetTabs,
  getDomainName,
  getRecommendProject,
  setOrCancelRecommends,
  getDesignerProject,
  getMyDesignList,
} from '../Api';
import { useMerchantForm } from '../component/Form';
import { useQRForm } from '../component/useQRForm';

const sleep = () => new Promise((r) => setTimeout(() => r(undefined), 300));

registerFormField(
  'selectDesigners',
  connect({
    getProps: mapStyledProps,
  })(SelectDesigner as any),
);

export function Projects({ projectType }: any) {
  const { actionsRef } = useGeneralTableActions<ProjectColumns>();
  const userInfo = UserInfoCache.get();
  const [imgUrl, setImgUrl] = useState('');
  const [isShowPic, setShowPic] = useState(false);
  const [designId, setDesignId] = useState('');
  const [tags, setTags] = useState([] as any);
  const [isRecommend, setRecommend] = useState(false);
  const [selectedKeys, setSelectKeys] = useState([] as any);
  const { storeSelectOptions } = useStoresToSelectOptions();

  const { source } = userInfo;

  const { data: url } = useRequest(() => getDomainName({ tenantCode: userInfo.tenantCode }), {
    formatResult: (res) => {
      // 获取正式域名
      let viewUrlData = res.data.find((item: any) => item.type === 1 && item.port === 0) as any;

      // 如果不存在，那么就取临时域名
      if (!viewUrlData) {
        viewUrlData = res.data.find((item: any) => item.port === 0);
      }

      return `${
        viewUrlData?.isHttps !== 0 ? 'https' : 'http'
      }://${viewUrlData?.domainUrl.trim()}/design-projects/`;
    },
  });

  const { data: pcMallDeploy } = useRequest(() => getPcMallDeploy(), {
    formatResult: (res) => {
      return res.data;
    },
  });

  const handleCreateAdSuccess = useCallback(() => {
    setTimeout(() => {
      actionsRef.current.reload();
    }, 1000);
  }, []);

  const goToDesignPage = (query?: AnyObject & { dest: number }) => {
    const params = qs.stringify({
      ...query,
    });

    window.open(`/cloudDesign/design?${params}`);
  };

  const handleDesign = () => {
    goToDesignPage({ dest: 4 });
  };

  const handleUpdateDesign = (id: string) => {
    goToDesignPage({ dest: 1, designid: id });
  };

  useEffect(() => {
    getTabsList().then((res) => {
      setTags(res.data);
    });
  }, []);

  const handleShowPic = (picUrl: any) => {
    setImgUrl(picUrl);
    setShowPic(true);
  };

  const handleClosePic = () => {
    setShowPic(false);
  };

  const picObt = {
    title: '图片展示',
    visible: isShowPic,
    width: 900,
    onCancel() {
      handleClosePic();
    },
  };

  const { openForm, ModalFormElement } = useEditName({
    onAddSuccess: handleCreateAdSuccess,
  });

  const { openForm: openLabelForm, ModalFormElement: LabelModalFormElement } = useEditLabel({
    tags,
    designId,
    onAddSuccess: handleCreateAdSuccess,
  });

  const { openForm: handleOpenSelectedForm, ModalFormElement: ModalSelectedFormElement } =
    useMerchantForm({
      onAddSuccess: handleCreateAdSuccess,
      storeSelectOptions,
    });

  const { openForm: handleOpenQR, ModalFormElement: ModalQRFormElement } = useQRForm();

  const handleAddLabels = (id: string) => {
    setDesignId(id);
    getSetTabs(id).then((res) => {
      const valueObt = {} as any;
      tags.forEach((tag: any) => {
        if (tag.isMultipleSelected) {
          valueObt[`${tag.tagCategoryName}`] = res.data;
        } else {
          res.data?.forEach((items: any) => {
            if (tag.tags.map((ii: { id: any }) => ii.id)?.includes(items)) {
              valueObt[`${tag.tagCategoryName}`] = items;
            }
          });
        }
      });

      openLabelForm({ ...valueObt });
    });
  };

  const designCURDById = (id: string, method: 'copyProject' | 'delProject') =>
    api[method](id).then(sleep).then(handleCreateAdSuccess);

  const handleOnChange = (values: any) => {
    setSelectKeys(values);
  };

  const handleGetRequestUrl = () => {
    if (projectType === '1') {
      return getMyDesignList;
    }
    if (projectType === '2') {
      return getDesignerProject;
    }
    return getRecommendProject;
  };

  const recommendObj = {
    title: '提示',
    visible: isRecommend,
    okText: '确定',
    cancelText: '取消',
    width: 350,
    onCancel() {
      setRecommend(false);
    },
    onOk() {
      const recommendKey = projectType !== '3' ? 1 : 0;
      const recommendTips = projectType === '3' ? '取消成功！' : '设置成功！';
      if (projectType === '1') {
        handleOpenSelectedForm({ designIds: selectedKeys, recommend: recommendKey });
        setRecommend(false);
        return;
      }
      setOrCancelRecommends({ designIds: selectedKeys, recommend: recommendKey }).then(() => {
        message.success(`${recommendTips}`);
        setRecommend(false);
        actionsRef.current.reload();
      });
    },
  };

  const handleRecommend = () => {
    if (selectedKeys.length < 1) {
      message.warning('请选择方案！');
      return;
    }

    setRecommend(true);
  };

  const handleSyncList = () => {
    if (selectedKeys.length < 1) {
      message.warning('请选择方案！');
      return;
    }
    syncList(selectedKeys).then(() => actionsRef.current.reload());
  };

  const searchParams =
    projectType === '1'
      ? [
          {
            keyword: {
              title: '模糊查询',
              type: 'string',
              'x-component-props': {
                placeholder: '方案名称',
              },
            },
          },
        ]
      : ([
          {
            keyword: {
              title: '模糊查询',
              type: 'string',
              'x-component-props': {
                placeholder: '方案名称',
              },
            },
            appuid: {
              title: '设计师',
              type: 'selectDesigners' as any,
            },
          },
        ] as any);

  const operaterButton = () => {
    return {
      '1': [
        {
          text: '我要设计',
          visible: source !== 'KUJIALE',
          type: 'primary',
          onClick: () => handleDesign(),
        },
        {
          text: '同步方案',
          visible: true,
          onClick: () =>
            syncDesign()
              .then(() => {
                message.success('操作成功');
                actionsRef.current.reload();
              })
              .catch((e) => {
                message.error(e);
              }),
        },
        {
          text: '批量推荐',
          visible: true,
          onClick: () => handleRecommend(),
        },
        {
          text: '同步商品清单',
          visible: true,
          onClick: () => handleSyncList(),
        },
      ],
      '2': [
        {
          text: '批量推荐',
          visible: true,
          type: 'primary',
          onClick: () => handleRecommend(),
        },
      ],
      '3': [
        {
          text: '取消推荐',
          visible: true,
          onClick: () => handleRecommend(),
        },
      ],
    }[projectType].filter((item: { visible: any }) => item.visible);
  };

  const coverPicObj = {
    title: '方案封面图',
    dataIndex: 'coverPic',
    width: '28%',
    render: (data: any, records: any) => {
      return (
        <div>
          {Number(records?.recommend) === 1 && (
            <span
              style={{
                backgroundColor: 'red',
                padding: '5px 8px',
                color: '#ffffff',
                position: 'absolute',
                right: '17px',
              }}
            >
              推荐
            </span>
          )}
          <img onClick={() => handleShowPic(data)} className={styles.imgs} src={data} alt="" />
        </div>
      );
    },
  };

  const handleSups = (named: any) => {
    if (named.indexOf('m&amp;sup2;') > -1) {
      return named.replace('m&amp;sup2;', '㎡');
    }
    if (named.indexOf('m&sup2;') > -1) {
      return named.replace('m&sup2;', '㎡');
    }
    if (named.indexOf('m&amp;sup3;') > -1) {
      return named.replace('m&amp;sup3;', 'm³');
    }
    if (named.indexOf('m&sup3;') > -1) {
      return named.replace('m&sup3;', 'm³');
    }
    return named;
  };

  const projectDetail = {
    title: '方案信息',
    dataIndex: 'city',
    width: '45%',
    render: (data: any, records: any) => {
      return (
        <div className={styles.detail}>
          <div className={styles.titleLine}>
            <div className={styles.title}>{handleSups(records?.name) as any}</div>
            {projectType === '1' && source !== 'KUJIALE' && (
              <FormOutlined className={styles.modify} onClick={() => openForm({ ...records })} />
            )}
          </div>
          <div className={styles.areas}>
            小区区域：{records.city} {records.commName}
          </div>
          <div className={styles.areas}>小区房型：{records.specName}</div>
          <div className={styles.areas}>修改时间：{records.modifiedTime}</div>
          {records?.tags?.length !== 0 && (
            <div className={styles.roomTabs}>
              <div className={styles.leftSide}>
                {records?.tags?.slice(0, 5)?.map((tagItem: any) => {
                  return (
                    <span key={tagItem?.id} className={styles.preElement}>
                      {tagItem?.name}
                    </span>
                  );
                })}
                {records?.tags?.length > 5 && (
                  <span className={styles.andSoOn}>等{records?.tags.length}个</span>
                )}
              </div>
              {projectType === '1' && source !== 'KUJIALE' && (
                <Button size="small" onClick={() => handleAddLabels(records.designId)}>
                  设置标签
                </Button>
              )}
            </div>
          )}
          {records.dataType === 2 && projectType === '3' && (
            <div className={styles.storeAreas}>
              <div className={styles.relatedStore}>
                关联商家：{storeSelectOptions.find((item) => item.value === records.storeId)?.label}
              </div>
              <FormOutlined
                className={styles.modify}
                onClick={() =>
                  handleOpenSelectedForm({
                    designIds: [records?.designId],
                    recommend: records?.recommend,
                  })
                }
              />
            </div>
          )}
        </div>
      );
    },
  };

  const operateObj = {
    title: '操作',
    dataIndex: 'designId',
    width: '10%',
    buttonListProps: {
      maxCount: 5,
      list: ({ value, row }: any) =>
        [
          {
            text: '查看方案',
            visible: !!pcMallDeploy?.name,
            onClick: () => window.open(`${url}${value}`),
          },
          {
            text: '装修设计',
            visible: projectType === '1' && source !== 'KUJIALE',
            onClick: () => {
              handleUpdateDesign(value);
            },
          },
          {
            text: '删除',
            visible: projectType === '1' && source !== 'KUJIALE',
            modalProps: {
              title: '确定删除该方案吗？',
              onOk: () => designCURDById(value, 'delProject'),
            },
          },
          {
            text: '复制方案',
            visible: projectType === '1' && source !== 'KUJIALE',
            modalProps: {
              title: '确定复制该方案吗？',
              onOk: () => designCURDById(value, 'copyProject'),
            },
          },
          {
            text: '推广二维码',
            visible: true,
            onClick: () => handleOpenQR({ designId: value, designName: row.name }),
          },
        ].filter((item: { visible: any }) => item.visible),
    },
  };

  const designObj = {
    title: '所属设计师',
    dataIndex: 'designerName',
    width: '18%',
  };

  return (
    <div className={styles.project}>
      {ModalQRFormElement}
      {ModalFormElement}
      {LabelModalFormElement}
      {ModalSelectedFormElement}
      <Modal
        footer={
          <Button type="primary" onClick={() => handleClosePic()}>
            确定
          </Button>
        }
        {...picObt}
      >
        <div className={styles.showPic}>
          <img alt="" src={imgUrl} className={styles.showPic} />
        </div>
      </Modal>
      <Modal {...recommendObj}>
        {projectType !== '3' ? '确认添加推荐方案？' : '确认取消推荐方案？'}
      </Modal>
      <GeneralTableLayout<ProjectColumns, any>
        request={handleGetRequestUrl() as any}
        getActions={actionsRef}
        useTableOptions={{
          formatResult: (res) => ({
            total: res.data.total,
            data: (res.data.records as ProjectColumns[]).map((item) => ({
              ...item,
            })),
          }),
        }}
        tableProps={{
          rowKey: 'designId',
          rowSelection: {
            onChange: handleOnChange,
          },
        }}
        searchProps={{
          minItem: 3,
          items: searchParams,
        }}
        operationButtonListProps={{
          maxCount: 4,
          list: operaterButton(),
        }}
        columns={
          projectType !== '1'
            ? [coverPicObj, projectDetail, designObj, operateObj]
            : ([coverPicObj, projectDetail, operateObj] as any)
        }
      />
    </div>
  );
}
