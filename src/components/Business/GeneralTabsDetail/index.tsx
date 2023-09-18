import * as React from 'react';
import { Tabs, Collapse, Spin } from 'antd';
import classNames from 'classnames';

import type { TabsProps } from 'antd/es/tabs';

import type { CollapseProps, CollapsePanelProps } from 'antd/lib/collapse';

import type { GeneralTableLayoutProps } from '@/components/Business/Table';
import { GeneralTableLayout } from '@/components/Business/Table';

import styles from './index.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

type ComponentProps<TableType = any> = {
  Collapse: CollapseProps & {
    panels: Record<
      string,
      Omit<CollapsePanelProps, 'header' | 'key'> & {
        title?: string;
        content?: React.ReactNode;
      }
    >;
  };
  Table: GeneralTableLayoutProps<TableType>;
};

export type TGeneralTabsDetailProperties<C extends keyof ComponentProps, TableType> = {
  title?: string;
  component: C;
  props: C extends 'Table' ? ComponentProps<TableType>[C] : ComponentProps[C];
};

export type GeneralTabsDetailProps<TableType = any> = {
  loading?: boolean;
  properties: Record<string, TGeneralTabsDetailProperties<keyof ComponentProps, TableType>>;
} & TabsProps;

export const GeneralTabsDetail = <TableType extends any>(
  props: GeneralTabsDetailProps<TableType>,
) => {
  const { properties, loading, ...lastProps } = props;

  const renderComponent = (item: TGeneralTabsDetailProperties<keyof ComponentProps, any>) => {
    switch (item.component) {
      case 'Collapse':
        // eslint-disable-next-line no-case-declarations
        const { panels, ...lastCollapseProps } = item.props as ComponentProps['Collapse'];

        return (
          <Collapse
            {...{
              bordered: false,
              defaultActiveKey: Object.keys(panels)?.[0],
              className: classNames('tab-detail__collapse', lastCollapseProps.className),
              ...lastCollapseProps,
            }}
          >
            {Object.keys(panels).map((panelKey) => {
              const { title, content, ...panelItemProps } = panels[panelKey];

              return (
                <Panel
                  key={panelKey}
                  {...{
                    ...(panelItemProps || {}),
                    header: title,
                    children: content,
                    className: classNames('tab-detail__collapse-panel', panelItemProps.className),
                  }}
                />
              );
            })}
          </Collapse>
        );

      case 'Table':
        return <GeneralTableLayout {...(item.props as ComponentProps<any>['Table'])} />;
      default:
        return <></>;
    }
  };

  return (
    <Spin spinning={loading}>
      <Tabs
        {...{
          animated: false,
          ...lastProps,
          className: classNames(styles.wrapper, lastProps.className),
        }}
      >
        {Object.keys(properties).map((key) => {
          const item = properties[key];
          return (
            <TabPane tab={item.title} key={key}>
              {renderComponent(item)}
            </TabPane>
          );
        })}
      </Tabs>
    </Spin>
  );
};
