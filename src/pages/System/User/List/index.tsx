import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';

import { useState } from 'react';
import { history } from 'umi';
import { Modal, Tree, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';

import type { userColumns } from '../Api';
import { getUserList, removeUser, getRoleTree, limitRole, resetPassword } from '../Api';

const { confirm } = Modal;

export default function SystemUserList() {
  const { actionsRef } = useGeneralTableActions<userColumns>();
  const [selectedProductRowKeys, setSelectedProductRowKeys] = useState([] as any);
  const [isLimmit, setLimmit] = useState(false);
  const [trees, setTree] = useState([] as any);
  const [checkedKey, setCheckedKeys] = useState([] as any);

  useMount(() => {
    getRoleTree().then((res) => {
      setTree(res.data);
    });
  });

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
        removeUser({ ids }).then(() => {
          actionsRef.current.reload();
        });
      },
      onCancel() {
        console.log('onCancel');
      },
    });
  };

  const handleResetPassword = () => {
    if (selectedProductRowKeys.length > 0) {
      let ids = '';
      selectedProductRowKeys.forEach((items: any) => {
        ids += `${items},`;
      });
      ids = ids.substring(0, ids.lastIndexOf(','));
      confirm({
        title: '重置密码确认',
        icon: <QuestionCircleOutlined />,
        content: '确定将选择账号密码重置为123456',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          resetPassword({ userIds: ids }).then(() => {
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

  const handleGeTree = () => {
    if (selectedProductRowKeys.length > 0) {
      setLimmit(true);
    } else {
      message.warning('请先选择一条数据！');
    }
  };

  const handleSelectChange = (keys: any[]) => {
    setSelectedProductRowKeys(keys);
  };

  const handleGoAdd = () => {
    history.push('/system/user/add');
  };

  const handleOnCheck = (checkedKeys: any) => {
    setCheckedKeys(checkedKeys);
  };

  const limitOpt = {
    title: '权限配置',
    visible: isLimmit,
    width: 500,
    onCancel() {
      setLimmit(false);
    },
    onOk() {
      let userIds = '';
      let roleIds = '';
      selectedProductRowKeys.forEach((items: any) => {
        userIds += `${items},`;
      });
      checkedKey.forEach((items: any) => {
        roleIds += `${items},`;
      });
      userIds = userIds.substring(0, userIds.lastIndexOf(','));
      roleIds = roleIds.substring(0, roleIds.lastIndexOf(','));
      limitRole({ userIds, roleIds }).then(() => {
        actionsRef.current.reload();
      });
      setLimmit(false);
    },
  };

  const tProps = {
    treeData: trees,
    checkable: true,
    style: {
      width: '100%',
    },
    onCheck: handleOnCheck,
  };

  return (
    <>
      <Modal {...limitOpt}>
        <Tree {...tProps} />
      </Modal>
      <GeneralTableLayout<userColumns, any>
        request={getUserList as any}
        getActions={actionsRef}
        tableProps={{
          rowSelection: {
            onChange: handleSelectChange,
          },
        }}
        operationButtonListProps={{
          maxCount: 4,
          list: [
            {
              text: '新增',
              onClick: () => handleGoAdd(),
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
            {
              text: '密码重置',
              onClick: () => handleResetPassword(),
              icon: 'RetweetOutlined',
            },
          ],
        }}
        searchProps={{
          items: [
            {
              account: {
                title: '用户账号',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入账号',
                },
              },
              realName: {
                title: '用户姓名',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入姓名',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '登录账号',
            dataIndex: 'account',
            width: '20%',
          },
          {
            title: '用户昵称',
            dataIndex: 'name',
            width: '15%',
          },
          {
            title: '用户姓名',
            dataIndex: 'realName',
          },
          {
            title: '所属角色',
            dataIndex: 'roleName',
          },
          {
            title: '所属机构',
            dataIndex: 'deptName',
          },
          {
            title: '手机号码',
            dataIndex: 'phone',
          },
          {
            title: '电子邮箱',
            dataIndex: 'email',
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: (value) => <span>{Number(value) === 1 ? '正常' : '禁用'}</span>,
          },
          {
            title: '操作',
            dataIndex: 'id',
            buttonListProps: {
              list: ({ row }) => [
                {
                  text: '修改',
                  onClick: () => {
                    history.push(`/system/user/edit/${row.id}`);
                  },
                },
                { text: '删除', onClick: () => showDeleteConfirm(row.id) },
                {
                  text: '查看',
                  onClick: () => {
                    history.push(`/system/user/detail/${row.id}`);
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
