import type { ISchemaFieldComponentProps } from '@formily/antd';

import '../index.less';

export const AchievementBox = (props: ISchemaFieldComponentProps) => {
  const { value } = props;
  return (
    <div className="achievement">
      {value?.map((items: any) => {
        return (
          <div key={items.title} className="item">
            <span className="numColor">{items.nums}</span>
            <span>{items.title}</span>
          </div>
        );
      })}
    </div>
  );
};
