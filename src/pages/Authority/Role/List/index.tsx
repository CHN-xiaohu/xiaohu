import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useState } from 'react';
import { history } from 'umi';

import { Modal, message, Tree, Tabs } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';

import type { roleColumn } from '../Api';
import { getRoleList, removeRole, getMenuTree, setGrant, getUserLimit } from '../Api';

const { confirm } = Modal;
const { TabPane } = Tabs;

export default function AuthorityRoleList() {
  const { actionsRef } = useGeneralTableActions<roleColumn>();
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([] as any);
  const [trees, setTree] = useState([] as any);
  const [isLimmit, setLimmit] = useState(false);
  const [checkedKey, setCheckedKeys] = useState([] as any);

  useMount(() => {
    getMenuTree().then((res) => {
      setTree(res.data.menu);
    });
  });

  const handleSelectChange = (keys: any[]) => {
    setSelectedProductRowKeys(keys);
  };

  // eslint-disable-next-line consistent-return
  const showDeleteConfirm = (id: any) => {
    let ids = '';
    if (id) {
      ids = id;
    } else if (selectedProductRowKeys.length < 1) {
      return message.warning('请先选择要删除的记录！');
    } else {
      selectedProductRowKeys.forEach((items: any) => {
        ids += `${items},`;
      });
      ids = ids.substring(0, ids.lastIndexOf(','));
    }
    confirm({
      title: '删除确认',
      icon: <QuestionCircleOutlined />,
      content: '确定删除选中记录？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        removeRole({ ids }).then(() => {
          actionsRef.current.reload();
        });
      },
      onCancel() {
        console.log('onCancel');
      },
    });
  };

  const handleGeTree = () => {
    if (selectedProductRowKeys.length === 1) {
      getUserLimit(selectedProductRowKeys[0]).then((res) => {
        setCheckedKeys(res.data.menu);
      });
      setLimmit(true);
    } else {
      message.warning('请先选择一条数据！');
    }
  };

  const handleOnCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys);
  };

  const limitOpt = {
    title: '权限配置',
    visible: isLimmit,
    width: 450,
    onCancel() {
      setLimmit(false);
    },
    onOk() {
      const param = {
        roleIds: selectedProductRowKeys,
        menuIds: checkedKey,
        dataScopeIds: [],
        apiScopeIds: [],
      };
      setGrant(param).then(() => {
        actionsRef.current.reload();
      });
      setLimmit(false);
    },
  };

  const tProps = {
    treeData: trees,
    checkable: true,
    checkedKeys: checkedKey,
    style: {
      width: '100%',
    },
    onCheck: handleOnCheck,
  };

  return (
    <>
      <Modal {...limitOpt}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="菜单权限" key="1">
            <Tree {...tProps} />
          </TabPane>
        </Tabs>
      </Modal>
      <GeneralTableLayout<roleColumn, any>
        request={getRoleList as any}
        getActions={actionsRef}
        useTableOptions={{
          formatResult: (res) => ({
            data: res.data as any,
            total: 0,
          }),
        }}
        tableProps={{
          rowSelection: {
            onChange: handleSelectChange,
          },
        }}
        operationButtonListProps={{
          list: [
            {
              text: '新增',
              onClick: () => {
                history.push('/authority/role/add');
              },
              type: 'primary',
              icon: 'PlusOutlined',
            },
            {
              text: '删除',
              danger: true,
              onClick: () => showDeleteConfirm(''),
              icon: 'DeleteOutlined',
            },
            {
              text: '角色配置',
              onClick: () => handleGeTree(),
              icon: 'UserAddOutlined',
            },
          ],
        }}
        searchProps={{
          items: [
            {
              roleName: {
                title: '角色名称',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入角色名称',
                },
              },
              roleAlias: {
                title: '角色别名',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入角色别名',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '角色名称',
            dataIndex: 'roleName',
            width: '40%',
          },
          {
            title: '角色别名',
            dataIndex: 'roleAlias',
            width: '20%',
          },
          {
            title: '排序',
            dataIndex: 'sort',
            width: '20%',
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '修改',
                  onClick: () => {
                    history.push(`/authority/role/add/${row.id}`);
                  },
                },
                { text: '删除', onClick: () => showDeleteConfirm(row.id) },
                {
                  text: '查看',
                  onClick: () => {
                    history.push(`/authority/role/detail/${row.id}`);
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
