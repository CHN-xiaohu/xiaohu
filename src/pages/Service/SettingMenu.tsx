import { memo, useEffect } from 'react';
import { Modal, Tabs, Tree, Empty, Spin, message } from 'antd';
import { useMount } from 'ahooks';

import { useImmer } from 'use-immer';

import { useLoadingWrapper } from '@/foundations/hooks';

import { grantTree } from '@/services/Api/Global';

import { getServiceBindMenu, addServiceMenu } from './Api';

const { TabPane } = Tabs;

const tabMap = {
  menu: '菜单权限',
  dataScope: '数据权限',
  apiScope: '接口权限',
};

type Props = {
  visible: boolean;
  serverId: string;
  onClose: () => void;
};

const DEFAULT_DATASOURCE = {
  menu: [],
  dataScope: [],
  apiScope: [],
};

const Main = ({ visible = false, serverId, onClose }: Props) => {
  const [state, setState] = useImmer({
    dataSource: DEFAULT_DATASOURCE as {
      [k in keyof typeof tabMap]: any[];
    },
    checkedKeys: [] as string[],
  });

  const { isLoading, runRequest } = useLoadingWrapper({ seconds: 0.1 });

  useMount(() => {
    grantTree().then((res) => {
      setState((draft) => {
        draft.dataSource = res.data;
      });
    });
  });

  useEffect(() => {
    if (serverId) {
      runRequest(() =>
        getServiceBindMenu(serverId).then((res) => {
          setState((draft) => {
            draft.checkedKeys = res.data;
          });
        }),
      );
    }
  }, [visible]);

  const handleCheck = (checkedKeys: string[] | any) => {
    setState((draft) => {
      draft.checkedKeys = checkedKeys;
    });
  };

  const handleOk = async () => {
    if (state.checkedKeys.length) {
      await runRequest(() =>
        addServiceMenu(
          serverId,
          state.checkedKeys.map((menuId) => ({
            defProductId: serverId,
            menuId,
          })),
        ),
      ).then(() => {
        setState((draft) => {
          draft.checkedKeys = [];
        });

        onClose();
      });
    } else {
      message.warning('请至少关联一个菜单项');
    }
  };

  return (
    <Modal
      title="菜单管理"
      visible={visible}
      style={{ top: '7.5vh' }}
      okButtonProps={{
        loading: isLoading,
      }}
      cancelButtonProps={{
        disabled: isLoading,
      }}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Spin spinning={isLoading}>
        <Tabs style={{ marginTop: '-20px' }}>
          {Object.keys(tabMap).map((tab) => {
            const currentDataSource = state.dataSource[tab] as any[];

            return (
              <TabPane
                key={tab}
                tab={tabMap[tab]}
                style={{
                  height: '60vh',
                  overflowY: 'auto',
                }}
              >
                {currentDataSource.length ? (
                  <Tree
                    checkable
                    checkedKeys={state.checkedKeys}
                    onCheck={handleCheck}
                    treeData={currentDataSource}
                  />
                ) : (
                  <Empty style={{ marginTop: '18vh' }} description="暂无相关菜单数据" />
                )}
              </TabPane>
            );
          })}
        </Tabs>
      </Spin>
    </Modal>
  );
};

export const SettingMenu = memo(Main);
