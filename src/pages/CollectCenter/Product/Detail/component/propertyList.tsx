import { Button } from 'antd';

import './index.less';

const PropertyList = ({ properList, handleChangeChosen, selectedObject }: any) => {
  return (
    <div className="propertyHome">
      {properList.map((item: any) => {
        return (
          <div key={item.k} className="property">
            <div className="title">{item.k}</div>
            <div className="list">
              {item.v.map((perItem: any) => {
                const currentSelected = selectedObject[item.k_id];
                // 只能单选，所以是 ===
                const activeClass =
                  currentSelected && currentSelected === perItem.id
                    ? 'itemButtonChosen'
                    : 'itemButton';
                const clickParams = { ...perItem, parentLabelId: item.k_id, currentSelected };
                return (
                  <Button
                    key={perItem.id}
                    onClick={() => handleChangeChosen(clickParams)}
                    className={activeClass}
                  >
                    {perItem.name}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyList;
