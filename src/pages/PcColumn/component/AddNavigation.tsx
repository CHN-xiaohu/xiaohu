import { useState } from 'react';
import { Button, Table, Modal } from 'antd';
import { Image } from '@/components/Business/Table/Image';

import { ButtonList } from '@/components/Library/ButtonList';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { cloneDeep } from 'lodash';

import { modelNamespace, SKIP_TYPE, PC_SKIP_VALUE_SHOW } from '../Constant';

import styles from '../index.less';

export const AddNavigation = ({ navigationList, openForm }: any) => {
  const [isOpenDel, setIsOpenDel] = useState(false);
  const [contentId, setContentId] = useState('');
  const { columnType } = useStoreState(modelNamespace as 'pcColumn');

  const handleSetNavigation = (records: any) => {
    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      perNavigation: records,
    });
    openForm({ ...records });
  };

  const handleDel = (id: string) => {
    setContentId(id);
    setIsOpenDel(true);
  };

  const handleSureDel = () => {
    setIsOpenDel(false);
    const newList = cloneDeep(navigationList);
    newList.splice(
      newList.findIndex((item: any) => item.id === contentId),
      1,
    );

    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      navigationList: newList,
    });
  };

  const handleOperationBut = (records: any) => [
    {
      text: '编辑',
      onClick: () => handleSetNavigation(records),
    },
    {
      text: '删除',
      onClick: () => handleDel(records?.id),
    },
  ];

  const handleActionType = (data: any, records: any) => (
    <div>
      {SKIP_TYPE[data]}
      <span>
        {['PC_DESIGN', 'PC_FIRST_PAGE', 'PC_3D_DESIGN'].includes(data)
          ? ''
          : `（${records[PC_SKIP_VALUE_SHOW[data]]}）`}
      </span>
    </div>
  );

  const navColumns = [
    {
      title: '导航名称',
      dataIndex: 'title',
    },
    {
      title: '导航链接',
      dataIndex: 'actionType',
      render: (data: any, records: any) => handleActionType(data, records),
    },
    {
      title: '排序',
      dataIndex: 'actionSort',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (_: any, records: any) => {
        return <ButtonList isLink list={handleOperationBut(records)} />;
      },
    },
  ];

  const advColumns = [
    {
      title: '广告图',
      dataIndex: 'picUrl',
      render: (data: any, records: any) => {
        const returnImg = data || records.picUrl2;
        return <Image src={returnImg} />;
      },
    },
    {
      title: '导航链接',
      dataIndex: 'actionType',
      render: (data: any, records: any) => handleActionType(data, records),
    },
    {
      title: '排序',
      dataIndex: 'actionSort',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (_: any, records: any) => {
        return <ButtonList isLink list={handleOperationBut(records)} />;
      },
    },
  ];

  return (
    <div className={styles.addNavigation}>
      <Modal
        title="提示"
        width={250}
        visible={isOpenDel}
        onCancel={() => setIsOpenDel(false)}
        onOk={() => handleSureDel()}
      >
        确定删除该{`${columnType === 'ADVERT_TEMPLATE' ? '广告' : '导航'}`}？
      </Modal>
      <div className={styles.titleBg}>
        <span className={styles.title}>
          {columnType === 'ADVERT_TEMPLATE' ? '广告栏目' : '导航栏目'}
        </span>
        <Button type="primary" size="small" onClick={() => openForm()}>
          {columnType === 'ADVERT_TEMPLATE' ? '添加广告' : '添加导航'}
        </Button>
      </div>
      <Table
        bordered
        columns={columnType === 'ADVERT_TEMPLATE' ? advColumns : navColumns}
        dataSource={navigationList}
        className={styles.tablePad}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
};
