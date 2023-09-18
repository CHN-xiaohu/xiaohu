import type { RowProp } from '../LayoutBaseTemplate';
import PreviewTemplate from '../LayoutBaseTemplate';
import type { ListType } from '..';

export default ({
  dataList = [],
  width,
  height,
}: {
  dataList: ListType;
  width: number;
  height: number;
}) => {
  const RowData: RowProp[] = [
    {
      cols: [
        {
          item: dataList[0],
          placeholder: `A(${width}x${height})`,
        },
      ],
    },
  ];
  return <PreviewTemplate rowData={RowData} />;
};
