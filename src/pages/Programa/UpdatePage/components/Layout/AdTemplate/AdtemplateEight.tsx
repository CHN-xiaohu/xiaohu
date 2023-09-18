import type { RowProp } from '../LayoutBaseTemplate';
import PreviewTemplate from '../LayoutBaseTemplate';
import type { ListType } from '..';

export default ({ dataList = [] }: { dataList: ListType }) => {
  const RowData: RowProp[] = [
    {
      cols: [
        {
          item: dataList[0],
          placeholder: 'A(680x192)',
        },
      ],
    },
  ];
  return <PreviewTemplate rowData={RowData} />;
};
