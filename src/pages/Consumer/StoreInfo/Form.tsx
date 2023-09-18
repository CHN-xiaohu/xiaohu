import type { NormalFormProps } from '@/components/Business/Formily';
import { createLinkageUtils } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createElement, useState, useRef, useEffect } from 'react';
import { Button, Col, Input, message, Row, Space, Spin } from 'antd';
import { useMount, useRequest } from 'ahooks';
import { createAsyncFormActions, FormEffectHooks } from '@formily/antd';
import { useAMAP } from '@/components/Library/Area/AmapApiLoader';
import { getArrayLastItem } from '@/utils';
import { isObject } from 'lodash';
import { useDebounceWatch } from '@/foundations/hooks';

import { getStoreDefaultInfo, insertOrUpdateStoreInfo } from './Api';

const formActions = createAsyncFormActions();

type LocationValue = AMap.LocationValue;

const addressFields = [
  ['provinceName', 'provinceId'],
  ['cityName', 'cityId'],
  ['areaName', 'areaId'],
];

const GaoDeMap = ({
  value,
  goAdress,
  onChange,
}: {
  value: { lnglat?: LocationValue; detailedAddress?: any };
  goAdress: any;
  onChange: any;
}) => {
  const lnglat = value?.lnglat;
  const detailedAddress = value?.detailedAddress;
  const [showPanel, setShowPanel] = useState(false);
  const { pluginInstances, mapInstance: mapInstance2, geocoderGetAddress, isReady } = useAMAP({
    mapElementId: 'map_container',
    config: {
      key: '060f5582a23f52cf6c9dff74978e189f',
      onLoadPluginsReady: (mapInstance) => {
        mapInstance?.on('click', function (e) {
          setShowPanel(false);
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          regeoCode([e.lnglat.R, e.lnglat.Q], true);
        });

        mapInstance.add(pluginInstances.Marker);
      },
    },
  });

  const formatPlace = (
    addressComponent: AMap.Geocoder.ReGeocodeResult['regeocode']['addressComponent'],
  ) => {
    let { city, district } = addressComponent;

    // 这三个直辖市的行政区域划分跟下面的不一样，可以跳过填补处理
    const skipProvinceArr = ['重庆市', '上海市', '北京市', '天津市'];

    if (!skipProvinceArr.includes(addressComponent.province)) {
      if (!addressComponent.city) {
        // 没有城市，比如海南省的直辖县，它们就是没有城市的划分，直接到县，所以这里的处理就是将县区顶上，填补 city 的值，以此递推
        city = addressComponent.district; // 县区 ==> 市
        district = addressComponent.township; // 镇 ==> 县区
      } else if (!addressComponent.district) {
        // 没有县区，比如中山/东莞市，它们就是没有划分县区级别的行政区域，直接到镇/街道，所以这里的处理是将镇顶上，填补 district 的值，以此递推
        district = addressComponent.township; // 镇 ==> 县区
      }
    }

    return [addressComponent.province, city, district];
  };

  const regeoCode = async (lng_lat: LocationValue, isClick: boolean, searchAddress?: string) => {
    pluginInstances.Marker.setPosition(lng_lat);

    try {
      const { regeocode } = await geocoderGetAddress(lng_lat);
      const { formattedAddress, addressComponent } = regeocode;

      const place = formatPlace(addressComponent);
      const threeLevel = getArrayLastItem(place);

      let geocoderAddress = detailedAddress;

      formActions.setFieldState('storeInfo.place', (field) => {
        field.props['x-component-props']!.guiseSyncChangeByValue = place;
      });

      if (isClick) {
        geocoderAddress = getArrayLastItem(formattedAddress.split(threeLevel));
      }

      if (searchAddress && !isClick) {
        geocoderAddress = getArrayLastItem(searchAddress.split(threeLevel));
      }

      onChange({
        lng_lat,
        detailedAddress: geocoderAddress,
      });
    } catch (result) {
      message.error('查询地址失败');
    }
  };

  const handleSearchAdress = async (adress: string, adcode: string) => {
    if (!adress || !adcode) {
      return;
    }
    setShowPanel(true);

    const placeSearch = new window.AMap.PlaceSearch({
      map: mapInstance2, // 展现结果的地图实例
      city: adcode, // 兴趣点城市
      panel: 'panel',
    });

    placeSearch.search(adress, (status, result) => {
      if (status === 'complete' && isObject(result)) {
        const lng_lat = result.poiList.pois[0].location!;
        const searchAddress = result.poiList.pois[0].address;
        regeoCode([lng_lat.R, lng_lat.Q], false, searchAddress);
      } else {
        setTimeout(() => {
          setShowPanel(false);
        }, 1000);
      }
    });

    placeSearch.on('selectChanged', function (e) {
      regeoCode(
        [e.selected.data.location.R, e.selected.data.location.Q],
        false,
        e.selected.data.address,
      );
    });
  };

  useDebounceWatch(
    () => {
      if (!pluginInstances.DistrictSearch || !lnglat) {
        return;
      }
      setShowPanel(false);
      regeoCode(lnglat, false).then(() => {
        mapInstance2?.panTo(lnglat);
      });
    },
    [lnglat, isReady],
    { ms: 60 },
  );

  useEffect(() => {
    setShowPanel(false);
    if (!pluginInstances || !window.AMap || !goAdress?.length) {
      return;
    }
    handleSearchAdress(getArrayLastItem(goAdress)?.name, getArrayLastItem(goAdress)?.adcode);
  }, [goAdress, isReady]);

  return (
    <>
      <Row style={{ marginBottom: '24px' }}>
        <Col span={4} />
        <Col span={4}>
          <Space>
            <Input
              placeholder="请输入详细地址"
              value={detailedAddress}
              style={{ width: '20vw' }}
              onChange={(e) => {
                onChange({
                  ...value,
                  detailedAddress: e.target.value,
                });
              }}
            />
            <Button
              onClick={() => {
                formActions.getFieldState('place', (fieldState) => {
                  const [names, datas] = fieldState.values;
                  if (datas) {
                    handleSearchAdress(detailedAddress, getArrayLastItem(datas).adcode);
                    return;
                  }

                  if (names) {
                    handleSearchAdress(detailedAddress, getArrayLastItem(names)!);
                  }
                });
              }}
            >
              搜索地图
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={4} style={{ height: '500px' }} />
        <Col flex="auto" style={{ height: '500px' }}>
          <div id="map_container" style={{ width: '100%', height: '100%' }}></div>
          <div
            id="panel"
            style={{
              position: 'absolute',
              top: 0,
              width: '300px',
              height: '400px',
              overflow: 'scroll',
              display: showPanel ? 'block' : 'none',
            }}
          ></div>
        </Col>
      </Row>
    </>
  );
};

const saveReset = (data: { [x: string]: any; lng: any; lat: any; detailedAddress: any }) => {
  formActions.setFieldState('*.geocoder', (fieldState) => {
    if (data?.lng && data?.lat) {
      fieldState.value = {
        lnglat: [Number(data.lng), Number(data.lat)],
        detailedAddress: data?.detailedAddress,
      };
    } else if (data?.provinceName) {
      fieldState.props['x-component-props']!.goAdress = addressFields.map((item) => ({
        name: data[item[0]],
        adcode: data[item[1]],
      }));
    } else {
      fieldState.props['x-component-props']!.goAdress = [];
      fieldState.value = {};
    }
  });
};

export default function StoreInfo() {
  const messageInit = useRef([] as any);

  const { run, data: datas, refresh, loading } = useRequest(() => getStoreDefaultInfo(), {
    manual: true,
    formatResult: (res) => {
      const { data } = res;
      saveReset(data);
      messageInit.current = data;
      return data;
    },
  });

  useMount(() => {
    run();
  });

  const handleUpdate = async (values: any) => {
    const params = {
      ...datas,
      storeName: values.storeName,
      phone: values.phone,
      linkPhone: values.linkPhone,
      linkName: values.linkName,
      storeImgs: values.storeImgs || '',
      lng: values.geocoder.lng_lat?.[0],
      lat: values.geocoder.lng_lat?.[1],
      storeId: messageInit.current.storeId,
      detailedAddress: values.geocoder.detailedAddress || '',
    } as any;
    formActions.getFieldState('place', (fieldState) => {
      const [, names] = fieldState.values;

      if (names) {
        addressFields.forEach((item, index) => {
          params[item[0]] = names[index]?.name || '';
          params[item[1]] = names[index]?.adcode || '';
        });
      }
    });
    if (!params.provinceName && !params.provinceId) {
      params.lng = '';
      params.lat = '';
      params.detailedAddress = '';
    }
    params.place = undefined;
    return insertOrUpdateStoreInfo(params).then(() => refresh());
  };

  const createRichTextUtils = () => ({
    red(text: any) {
      return createElement('span', { style: { color: 'red', margin: '0 3px' } }, text);
    },
  });

  const props: NormalFormProps = {
    actions: formActions,
    onSubmit: handleUpdate,
    components: {
      GaoDeMap,
    },
    initialValues: datas || messageInit.current,
    labelCol: 4,
    wrapperCol: 10,
    expressionScope: createRichTextUtils(),
    effects: ($) => {
      const linkage = createLinkageUtils();

      $('onFormReset').subscribe(() => {
        formActions.setFieldValue('storeInfo.linkName', messageInit.current.linkName);
        formActions.setFieldValue('storeInfo.storeImgs', messageInit.current.storeImgs);
        if (!messageInit.current.place) {
          formActions.setFieldState('storeInfo.place', (field: { props: Record<string, any> }) => {
            field.props['x-component-props']!.guiseSyncChangeByValue = [];
          });
        }
        saveReset(messageInit.current);
      });

      FormEffectHooks.onFieldInputChange$('storeInfo.place').subscribe((fieldState) => {
        const [, names, isInput] = fieldState.values;
        if (names && isInput) {
          linkage.xComponentProp('*.geocoder', 'goAdress', names);
        }
      });
    },
    schema: {
      storeInfo: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '商家信息',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          storeName: {
            title: '店铺名称',
            type: 'string',
            'x-rules': [
              {
                range: [0, 20],
                message: '店铺名称不能超过20个字符',
              },
              {
                required: true,
                message: '请输入店铺名称',
              },
            ],
          },
          phone: {
            title: '注册手机号',
            type: 'string',
            required: true,
            'x-rules': [
              {
                message: '请输入正确的格式',
                pattern: /^1[3456789]\d{9}$/,
              },
            ],
          },
          linkPhone: {
            title: '联系手机号',
            type: 'string',
            'x-rules': [
              {
                message: '请输入正确的格式',
                pattern: /^1[3456789]\d{9}$/,
              },
            ],
          },
          linkName: {
            title: '联系人',
            type: 'string',
          },
          storeImgs: {
            title: '店铺头像',
            'x-component': 'uploadFile',
            'x-component-props': {
              placeholder: '100*100',
            },
            'x-props': {
              rule: {
                maxImageWidth: 100,
                maxImageHeight: 100,
              },
            },
          },
          place: {
            title: '店铺地址',
            type: 'area',
            'x-component-props': {
              showAreaLevel: 3,
              placeholder: '请选择所在城市',
              isUseCode: false,
            },
          },
          geocoder: {
            type: 'string',
            'x-component': 'GaoDeMap',
            'x-component-props': {
              goAdress: [],
            },
          },
        },
      },
      formButtonList: {
        type: 'object',
        'x-component': 'formButtonGroup',
        properties: {
          buttonGroup: {
            type: 'submitButton',
            'x-component-props': {
              children: '保存',
            },
          },
          cancelButton: {
            type: 'cancelButton',
            'x-component-props': {
              children: '重置',
              style: {
                marginTop: '4px',
              },
            },
          },
        },
      },
    },
  };

  return (
    <Spin spinning={loading}>
      <SchemaForm {...props} />
    </Spin>
  );
}
