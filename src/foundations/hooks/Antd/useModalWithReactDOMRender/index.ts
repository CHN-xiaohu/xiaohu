import type { ModalProps } from 'antd/lib/modal';
import { createReactDomContainer } from '@/utils';

import { HookModal } from './HookModal';

import { useMakeVisibleHooksWithReactDOMRender } from '../useMakeVisibleHooksWithReactDOMRender';

type Props = {
  content?: React.ReactNode;
} & Omit<ModalProps, 'visible'>;

// 当前只允许开启一个资源管理面板
const ContainerNode = createReactDomContainer('useModalHook');
export const useModalHook = () =>
  useMakeVisibleHooksWithReactDOMRender<Props>(ContainerNode, HookModal);

export * from '../useModel';
