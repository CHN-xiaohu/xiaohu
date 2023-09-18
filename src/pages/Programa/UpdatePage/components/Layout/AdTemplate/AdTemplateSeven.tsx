import type { RowProp } from '../LayoutBaseTemplate';
import PreviewTemplate from '../LayoutBaseTemplate';
import type { ListType } from '..';

export default ({ dataList = [] }: { dataList: ListType }) => {
  const RowData: RowProp[] = [
    {
      cols: [
        {
          item: dataList[0],
          placeholder: 'A(226x200)',
        },
        {
          item: dataList[1],
          placeholder: 'B(226x200)',
        },
        {
          item: dataList[2],
          placeholder: 'C(226x200)',
        },
      ],
    },
  ];
  return <PreviewTemplate rowData={RowData} />;
};
