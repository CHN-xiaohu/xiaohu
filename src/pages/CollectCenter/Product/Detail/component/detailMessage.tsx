/* eslint-disable react/no-array-index-key */
// import emptyIng from '@/assets/images/empty.png';

import './index.less';

const DetailMessage = ({ paramsDataSource, introductions }: any) => {
  return (
    <div className="detail">
      <div className="title">商品详情</div>
      {paramsDataSource?.length > 0 && (
        <div className="textsBorder">
          <div className="texts">
            {paramsDataSource?.map((items: any, index: number) => {
              return (
                <div key={index} className="perItem">
                  {items.title}：{items.value}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="introduce">
        <span className="decribe">
          {!introductions[0]?.content?.includes('http') ? introductions[0]?.content : ''}
        </span>
        {introductions.map((item: any, index: number) => {
          return <img key={index} src={item.content} alt="" />;
        })}
      </div>
      {/* {
        introductions?.length < 1 && <div className="emptyImgs">
        <img src={emptyIng} alt='' />
      </div>
      } */}
    </div>
  );
};

export default DetailMessage;
