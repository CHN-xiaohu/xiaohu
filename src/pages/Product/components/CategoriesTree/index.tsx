import { memo, useRef, useEffect } from 'react';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import type { ITreeSelectProps } from '../TreeSearchSelect';
import { TreeSearchSelect } from '../TreeSearchSelect';

type CategoriesTreeProps = {
  onTreeSelected?: ITreeSelectProps['onSelect'];
  selectedTreeKeys?: string[];
};

export const CategoriesTree = memo(
  ({ onTreeSelected, selectedTreeKeys = [] }: CategoriesTreeProps) => {
    const { categories } = useStoreState('productCategory');
    const treeSearchSelectRef = useRef<HTMLDivElement>(null);
    const treeSearchSelectOffsetTop = useRef<number>(0);

    useEffect(() => {
      if (treeSearchSelectRef.current) {
        treeSearchSelectOffsetTop.current = treeSearchSelectRef.current.getBoundingClientRect().top;
      }
    }, [treeSearchSelectRef.current]);

    useEffect(() => {
      function listenerScroll() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        if (treeSearchSelectRef.current) {
          const styleObj = {
            position: '',
            top: '',
          };
          if (scrollTop >= treeSearchSelectOffsetTop.current - 24) {
            styleObj.position = 'fixed';
            styleObj.top = '24px';
          }

          requestAnimationFrame(() => {
            treeSearchSelectRef.current!.style.position = styleObj.position;
            treeSearchSelectRef.current!.style.top = styleObj.top;
          });
        }
      }

      document.body.addEventListener('scroll', listenerScroll);

      return () => {
        document.body.removeEventListener('scroll', listenerScroll);
      };
    }, []);

    return (
      <div style={{ width: 320, height: '100%' }}>
        <div ref={treeSearchSelectRef} style={{ width: 320 }}>
          <TreeSearchSelect
            treeData={categories as any[]}
            selectedKeys={selectedTreeKeys}
            onSelect={onTreeSelected}
          />
        </div>
      </div>
    );
  },
);
