import { Checkbox, Row, Col } from 'antd';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import '../../index.less';
import { modelNamespace } from '../../Constants';

import { useAddRecruitPoster } from '../RecruitPlan/useAddRecruitPosterImg';

export const RecruitPoster = () => {
  const { posterList } = useStoreState(modelNamespace as 'salesman');

  const { openForm, ModalFormElement } = useAddRecruitPoster({
    posterList,
  });

  const handleChangeList = (e: any) => {
    posterList.forEach((items: any) => {
      if (e.target.value === items.title) {
        items.isChecked = !items.isChecked;
      }
    });
    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      posterList,
    });
  };

  const handleDeleteImg = (type: any) => {
    posterList.forEach((items: any) => {
      if (type === items.title) {
        items.backgroundImg = '';
      }
    });
    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      posterList,
    });
  };

  return (
    <div className="recruitPoster">
      {ModalFormElement}
      <div className="imgShow">
        {posterList?.map((items) => {
          return (
            <div key={items.qrCodeHeight} className="posterItem">
              <img src={items.backgroundImg ? items.backgroundImg : items.originnalImg} alt="" />
              {items.backgroundImg && (
                <div onClick={() => handleDeleteImg(items.title)} className="delDiv">
                  删除
                </div>
              )}
            </div>
          );
        })}
        {posterList.length < 0 && (
          <div className="posterItem">
            <div className="delDiv" />
          </div>
        )}
      </div>
      <Row>
        {posterList?.map((items) => {
          return (
            <Col key={items.qrCodeHeight} span={6}>
              <div className="checkboxItem">
                <Checkbox onChange={handleChangeList} value={items.title} checked={items.isChecked}>
                  {items.title}
                </Checkbox>
                <div onClick={() => openForm({ ...items })} className="labelColor">
                  自定义背景图
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
