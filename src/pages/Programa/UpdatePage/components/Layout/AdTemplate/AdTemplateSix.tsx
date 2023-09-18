import type { RowProp } from '../LayoutBaseTemplate';
import PreviewTemplate from '../LayoutBaseTemplate';
import type { ListType } from '..';

export default ({ dataList = [] }: { dataList: ListType }) => {
  const RowData: RowProp[] = [
    {
      cols: [
        {
          item: dataList[0],
          placeholder: 'A(350x170)',
        },
        {
          item: dataList[1],
          placeholder: 'B(350x170)',
        },
      ],
    },
  ];
  return <PreviewTemplate rowData={RowData} />;
};
