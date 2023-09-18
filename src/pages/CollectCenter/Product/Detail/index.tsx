import { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'antd';
import { history } from 'umi';
import { useRequest } from 'ahooks';

import styles from './index.less';
import ImageGallerys from './component/imageGallery';
import PropertyList from './component/propertyList';
import SpecList from './component/specList';
import { handleNumber, ModalFoot, RenderBtn } from './component/RenderAssembly';
import DetailMessage from './component/detailMessage';

import { SearchCard } from '../../List/component/SearchCard';
import type { cellectColumn } from '../Api';
import { applyForDistributor } from '../Api';
import { getSelectDistributorReviewStatus } from '../Api';
import { getCollectDetail, addDistribute } from '../Api';

export default function CollectCenterProductDetail({
  match: {
    params: { id },
  },
}: any) {
  const [selectedObject, setSelectObject] = useState({} as any);
  const [detailMessage, setDetailMessage] = useState({} as cellectColumn);
  const [isOpenAttribute, setOpenAttribute] = useState(false);
  const [isOpenDistributor, setOpenDistributor] = useState(false);
  const [isAdd, setIsAdd] = useState(1);
  const [isGoSupply, setIsGoSupply] = useState(false);
  const {
    productInfo,
    images = [],
    salePropKeyNames = [],
    salePropKeyIds = [],
    products = [],
    paramPropKeyNames = [],
    paramValIds = [],
    paramVals = [],
    introductions = [],
    distributionId,
    view,
  }: cellectColumn = detailMessage;

  const handleGetCollectDetail = () => {
    getCollectDetail(id).then((res) => {
      const { data } = res;
      setDetailMessage(data);
      const reSalesPropKeyIds = data.salePropKeyIds?.filter(
        (v: any, i: number, ar: string | any[]) => i !== ar.length - 1,
      );
      const reProducts = data.products[0].salePropValIds?.filter(
        (v: any, i: number, ar: string | any[]) => i !== ar.length - 1,
      );
      reSalesPropKeyIds.forEach((item: any, index: number) => {
        selectedObject[item] = reProducts[index];
      });
      setSelectObject({ ...selectedObject });
    });
  };

  const { data: reviewStatus, run } = useRequest(
    () => getSelectDistributorReviewStatus({ supplyId: productInfo?.supplyId }),
    {
      formatResult: (res) => res.data,
      throttleInterval: 500,
      ready: !!productInfo?.supplyId,
    },
  );

  useEffect(() => {
    handleGetCollectDetail();
  }, []);

  const handleChangeChosen = (item: any) => {
    selectedObject[item.parentLabelId] = item.id;
    setSelectObject({ ...selectedObject });
  };

  const handleParams = () =>
    paramPropKeyNames.map((item: any, index: number) => ({
      id: paramValIds[index],
      title: item,
      value: paramVals[index],
    }));

  const handlePropKeyName = () =>
    salePropKeyNames.map((n: any, idx: number) => ({
      k: n,
      k_id: salePropKeyIds[idx],
      v: products.reduce(
        (prve: any, next: any) => {
          if (!prve.ids.includes(next.salePropValIds[idx])) {
            prve.ids.push(next.salePropValIds[idx]);
            prve.cTreeVs.push({
              id: next.salePropValIds[idx],
              name: next.salePropValNames[idx],
            });
          }

          return prve;
        },
        { ids: [] as string[], cTreeVs: [] as { id: string; name: string }[] },
      ).cTreeVs,
    }));

  const propers = handlePropKeyName()?.filter((v, i, ar) => i !== ar.length - 1);

  const handleSetValue = (value: number) => {
    setIsAdd(value);
    setOpenAttribute(true);
  };

  const handleSumbit = () => {
    addDistribute({ productState: isAdd, fromProductInfoId: productInfo?.id }).then(() => {
      setOpenAttribute(false);
      setTimeout(() => {
        handleGetCollectDetail();
        setIsGoSupply(true);
      }, 500);
    });
  };

  const handleApplication = () => {
    applyForDistributor({
      reApply: reviewStatus?.auditStatus !== 3,
      supplyId: productInfo?.supplyId,
      supplyCode: productInfo?.supplyCode,
    }).then(() => {
      setOpenDistributor(false);
      setTimeout(() => {
        run();
        handleGetCollectDetail();
      }, 500);
    });
  };

  const handleShowDetail = () => {
    window.open(`/product/distribution/view/${distributionId}`);
  };

  const handleGoSupply = (isList: boolean) => {
    setIsGoSupply(false);
    const goUrl = isList ? '/product/distribution' : `/product/distribution/view/${distributionId}`;
    window.open(goUrl);
  };

  const handleGoList = (value: any) => {
    history.push({
      pathname: '/collection/collectCenter',
      state: { value },
    });
  };

  return (
    <div className={styles.collectProduct}>
      <Modal
        title="提示"
        visible={isOpenAttribute}
        onCancel={() => setOpenAttribute(false)}
        width={300}
        footer={
          <ModalFoot handleDetermine={handleSumbit} handleCancel={() => setOpenAttribute(false)} />
        }
      >
        确认分销该商品吗？
      </Modal>

      <Modal
        title="提示"
        visible={isOpenDistributor}
        onCancel={() => setOpenDistributor(false)}
        width={300}
        footer={
          <ModalFoot
            handleDetermine={handleApplication}
            handleCancel={() => setOpenDistributor(false)}
          />
        }
      >
        确认申请成为分销商？
      </Modal>

      <Modal title="提示" visible={isGoSupply} onCancel={() => setIsGoSupply(false)} footer={false}>
        <div className={styles.supplyModal}>
          <div>
            分销成功，请前往
            <span
              onClick={() => {
                handleGoSupply(true);
              }}
              className={styles.hrefLink}
            >
              商品管理/分销商品
            </span>
            ， 管理商品信息
          </div>
          <Button
            type="primary"
            onClick={() => {
              handleGoSupply(false);
            }}
            className={styles.butPadding}
          >
            查看商品
          </Button>
        </div>
      </Modal>

      <SearchCard onSearch={handleGoList} />

      <div className={styles.title}>首页＞{productInfo?.name}</div>
      <Card>
        <div className={styles.topItem}>
          <ImageGallerys imageList={images || []} />

          <div className={styles.rightItem}>
            <div className={styles.title}>{productInfo?.name}</div>
            <div className={styles.supplyName}>供应商：{productInfo?.supplyName}</div>
            <div className={styles.priceDiv}>
              <div className={styles.middlePrice}>
                利润率：
                <span className={styles.percent}>
                  {handleNumber(productInfo?.minProfitMargin, productInfo?.maxProfitMargin, false)}
                </span>
              </div>
              <div className={styles.middlePrice}>
                供货价：
                <span className={styles.sellPrice}>
                  {handleNumber(productInfo?.minSupplyPrice, productInfo?.maxSupplyPrice, true)}
                </span>
              </div>
              <div className={styles.middlePrice}>
                零售价：
                <span className={styles.sellPrice}>
                  {handleNumber(
                    productInfo?.minSuggestSalePrice,
                    productInfo?.maxSuggestSalePrice,
                    true,
                  )}
                </span>
              </div>
            </div>

            <PropertyList
              properList={propers}
              handleChangeChosen={handleChangeChosen}
              selectedObject={selectedObject}
            />

            <div>
              <SpecList
                specs={products}
                chosens={selectedObject || {}}
                propers={handlePropKeyName()?.pop()}
              />
              {!view?.isSelf && (
                <div className={styles.submitChoose}>
                  <RenderBtn
                    view={view}
                    reviewStatus={reviewStatus}
                    distributionId={detailMessage?.distributionId}
                    handleShowDetail={handleShowDetail}
                    handleSetValue={handleSetValue}
                    setOpenDistributor={setOpenDistributor}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DetailMessage
          paramsDataSource={handleParams() || []}
          introductions={introductions || []}
        />
      </Card>
    </div>
  );
}
