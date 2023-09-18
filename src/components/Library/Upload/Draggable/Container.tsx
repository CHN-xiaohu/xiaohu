import { memo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const DraggableContainer = memo(({ children }: React.PropsWithChildren<AnyObject>) => (
  <DndProvider backend={HTML5Backend}>{children}</DndProvider>
));
