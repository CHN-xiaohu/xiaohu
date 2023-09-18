import { memo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { DragObjectWithType } from 'react-dnd/dist/types/hooks/types';

const type = 'DraggableUploadList';

type Props = {
  originNode: React.ReactNode;
  moveRow: (d: number, h: number) => void;
  index: number;
};

export const DraggableUploadListItem = memo(({ originNode, moveRow, index }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, dropClassName }, drop] = useDrop<
    { index: number } & DragObjectWithType,
    any,
    { isOver: boolean; dropClassName: string } | AnyObject
  >(
    () => ({
      type,
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }

        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item) => {
        moveRow(item.index, index);

        return undefined;
      },
    }),
    [index],
  );

  const [, drag] = useDrag(
    () => ({
      type,
      item: { type, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index],
  );

  drop(drag(ref));

  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move' }}
    >
      {originNode}
    </div>
  );
});
