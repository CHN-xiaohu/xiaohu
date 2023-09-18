import * as React from 'react';
import type { IntlShape } from 'umi';
import { Menu, Dropdown, Tooltip } from 'antd';
import type { TableProps } from 'antd/lib/table';

import { icons } from '@/components/Library/Icon';

import { Container } from '../../../Container';

type IProps = {
  className?: string;
  intl: IntlShape;
};

const Main: React.ForwardRefRenderFunction<Dropdown, IProps> = ({ intl }: IProps, ref) => {
  const { state, setState } = Container.useContainer();

  return (
    <Dropdown
      ref={ref}
      overlay={
        <Menu
          selectedKeys={[state.tableSize as string]}
          onClick={({ key }) => {
            setState((draft) => {
              draft.tableSize = key as TableProps<any>['size'];
            });
          }}
          style={{
            width: 80,
          }}
        >
          {['larger', 'middle', 'small'].map((size) => (
            <Menu.Item key={size}>
              {intl.formatMessage({ id: `table.toolBar.density.${size}` })}
            </Menu.Item>
          ))}
        </Menu>
      }
      trigger={['click']}
    >
      <Tooltip title={intl.formatMessage({ id: 'table.toolBar.density' })}>
        <icons.ColumnHeightOutlined />
      </Tooltip>
    </Dropdown>
  );
};

export const Density = React.memo(React.forwardRef(Main));
