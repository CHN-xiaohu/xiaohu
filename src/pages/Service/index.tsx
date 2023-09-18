import { useCallback } from 'react';
import { useImmer } from 'use-immer';
import { history } from 'umi';

import type { SwitchOnChangeParams } from '@app_business/Table';
import {
  generateDefaultSelectOptions,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@app_business/Table';

import type { IServicColumns } from './Api';
import { getServices, disableOrEnableServices, getServiceBindMenu } from './Api';
import {
  belongsToMap,
  productTypeMap,
  productTypeMapTransformToSelectOptions,
  belongsToMapTransformToSelectOptions,
} from './Constant';
import { SettingMenu } from './SettingMenu';

export default function Service() {
  const { actionsRef } = useGeneralTableActions<IServicColumns>();

  const [state, setState] = useImmer({
    settingMenuVisible: false,
    serverId: '',
  });

  const goToFormPage = (item?: any) => {
    history.push({
      pathname: `/service/form${(item?.id && `/${item.id}`) || ''}`,
      state: item,
    });
  };

  const openSettingMenu = (id: string) => {
    setState((draft) => {
      draft.settingMenuVisible = true;
      draft.serverId = id;
    });
  };

  const closeSettingMenu = () => {
    setState((draft) => {
      draft.settingMenuVisible = false;
    });
  };

  const handleStateChange = ({ dataSource, value }: SwitchOnChangeParams<IServicColumns>) => {
    const { row, index } = dataSource;

    return disableOrEnableServices({ id: row.id, status: Number(value.status) }).then(() =>
      actionsRef.current.setDataSource((source: any) => {
        source[index] = {
          ...source[index],
          ...value,
        };
      }),
    );
  };

  const handleCheckCanSwitch = useCallback(({ row }) => {
    if (row.productType === 'VIRTUAL_SERVE' || Number(row.status) === 1) {
      return Promise.resolve();
    }

    return getServiceBindMenu(row.id).then((res) => {
      if (!res.data.length) {
        throw new Error('当前服务还没绑定菜单，请先进行绑定');
      }
    });
  }, []);

  return (
    <>
      <GeneralTableLayout<IServicColumns, any>
        request={getServices}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '请输入服务名称',
                },
              },
              belongsTo: {
                title: '项目标识',
                type: 'string',
                default: '',
                enum: generateDefaultSelectOptions(belongsToMapTransformToSelectOptions, ''),
              },
              status: {
                title: '服务状态',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions([
                    { label: '启用', value: 1 },
                    { label: '禁用', value: 0 },
                  ]),
                },
              },
            },
            {
              productType: {
                title: '服务类型',
                type: 'checkableTags',
                col: 10,
                'x-component-props': {
                  options: generateDefaultSelectOptions(productTypeMapTransformToSelectOptions),
                },
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          onClick: () => goToFormPage(),
        }}
        columns={[
          {
            title: '服务名称',
            dataIndex: 'productName',
          },
          {
            title: '项目标识',
            dataIndex: 'belongsTo',
            render: (value) => belongsToMap[value],
          },
          {
            title: '服务类型',
            dataIndex: 'productType',
            render: (value) => productTypeMap[value],
          },
          {
            title: '状态',
            dataIndex: 'status',
            switchProps: {
              modalProps: ({ value }) => ({
                children: (
                  <span>{Number(value) ? '确定禁用该服务吗？' : '确定启用该服务吗？'}</span>
                ),
              }),
              onChange: handleStateChange,
              checkCanSwitch: handleCheckCanSwitch,
            },
          },
          {
            title: '排序',
            dataIndex: 'sort',
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
            width: 178,
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 110,
            buttonListProps: {
              list: ({ row }) => [
                { text: '编辑', onClick: () => goToFormPage(row) },
                ...// 虚拟服务无需显示菜单管理
                (row.productType !== 'VIRTUAL_SERVE'
                  ? [{ text: '菜单管理', onClick: () => openSettingMenu(row.id) }]
                  : []),
              ],
            },
          },
        ]}
      />

      <SettingMenu
        visible={state.settingMenuVisible}
        serverId={state.serverId}
        onClose={closeSettingMenu}
      />
    </>
  );
}
