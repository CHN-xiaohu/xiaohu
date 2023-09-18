/* eslint-disable no-unused-expressions */

import loadMorePng from '@/assets/images/loadMore.png';
import closeMorePng from '@/assets/images/closeMore.png';

import { useState } from 'react';

import './index.less';

const SpecList = ({ specs, chosens, propers }: any) => {
  const [isShowMore, setIsShowMore] = useState(false);

  const specsList = [] as any;
  specs?.forEach((items: any) => {
    if (
      Object.values(chosens).toString() ===
      items.salePropValIds?.filter((v, i, ar) => i !== ar.length - 1).toString()
    ) {
      specsList.push(items);
    }
  });

  const handleShowMore = () => {
    setIsShowMore(!isShowMore);
  };

  return (
    <div>
      {propers && (
        <div className="spec">
          <div className="title">{propers?.k}</div>
          <div className="listHome">
            <div className={specsList?.length > 6 && !isShowMore ? 'hideList' : ''}>
              {specsList.map((item: any) => {
                return (
                  <div key={item.id} className="list">
                    <div className="listName">
                      {item?.salePropValNames[item?.salePropValNames?.length - 1]}
                    </div>
                    <span>￥{item.suggestSalePrice || '**'}</span>
                  </div>
                );
              })}
            </div>
            {specsList?.length > 6 && (
              <div className="showAll">
                <span onClick={() => handleShowMore()} className="icon">
                  <img src={isShowMore ? closeMorePng : loadMorePng} alt="" />
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecList;
