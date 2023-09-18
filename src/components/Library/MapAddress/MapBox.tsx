import { memo, useCallback, useRef } from 'react';
import { useBoolean, useDebounceFn, usePersistFn } from 'ahooks';

import { isObj, isStr } from '@spark-build/web-utils/lib/type';

import { message, Spin } from 'antd';

import { formatPlaceInfo } from './util';

import { getArrayLastItem } from '@/utils';

import { useAMAP } from '../Area/AmapApiLoader';
import { useWatch } from '@/foundations/hooks';

type ChangeValue = Partial<
  Pick<MapBoxProps, 'lat' | 'lng' | 'address'> & {
    place: string[];
  }
>;

export type MapBoxProps = {
  mapElementId?: string;
  searchPanelElementId?: string;
  lat?: number;
  lng?: number;
  administrativeAddress?: (AMap.DistrictSearch.District | string)[];
  address?: string;
  onChange?: (v: ChangeValue) => void;
};

export const MapBox = memo(
  ({
    mapElementId = 'map_container',
    searchPanelElementId = 'map_search_panel',
    onChange,
    // lat,
    // lng,
    administrativeAddress,
    address,
  }: MapBoxProps) => {
    const [showPanel, showPanelAction] = useBoolean();

    const placeSearchInstanceRef = useRef<AMap.PlaceSearch | null>(null);
    const isAddressWatchChangeRef = useRef(false);

    // 因为该组件可能会用于 ModalForm，这是一种特殊的值同步的情况，比受控组件还多了两步（重复重置跟重复受控）
    // 所以这里应该再加一个缓存值，用于比对是否一致，减少开销

    const cacheChangeValueRef = useRef<ChangeValue>({});

    const isReset =
      (administrativeAddress === undefined || !administrativeAddress?.length) &&
      address === undefined;

    const { pluginInstances, isReady, geocoderGetAddress, pluginInstancesInitEnd } = useAMAP({
      mapElementId,
      config: {
        key: '060f5582a23f52cf6c9dff74978e189f',
        onLoadPluginsReady: (mapInst) => {
          mapInst?.on('click', function (e) {
            showPanelAction.setFalse();

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            findPlaceByLocationValue({ lngAndLat: [e.lnglat.R, e.lnglat.Q], isClick: true });
          });

          mapInst.add(pluginInstances.Marker);

          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          initPlaceSearchInstance(mapInst);
        },
      },
    });

    const resetIsAddressWatchChangeRef = useCallback(() => {
      isAddressWatchChangeRef.current = false;
    }, []);

    const findPlaceByLocationValue = usePersistFn(
      async ({
        lngAndLat,
        isClick = false,
        searchAddress,
      }: {
        lngAndLat: [number, number];
        isClick?: boolean;
        searchAddress?: string;
      }) => {
        pluginInstances.Marker.setPosition(lngAndLat);

        try {
          const { regeocode } = await geocoderGetAddress(lngAndLat);
          const { formattedAddress, addressComponent } = regeocode;

          const place = formatPlaceInfo(addressComponent);
          const threeLevel = getArrayLastItem(place) as string;

          let geocoderAddress = address;

          if (isClick) {
            geocoderAddress = getArrayLastItem(formattedAddress.split(threeLevel));
          }

          if (searchAddress && !isClick) {
            geocoderAddress = getArrayLastItem(searchAddress.split(threeLevel));
          }

          cacheChangeValueRef.current = {
            lng: lngAndLat[0],
            lat: lngAndLat[1],
            address: geocoderAddress,
            place,
          };

          onChange?.(cacheChangeValueRef.current);
        } catch (result) {
          message.error('查询地址失败');
        }
      },
    );

    const initPlaceSearchInstance = useCallback(
      (mapInst) => {
        if (!AMap?.PlaceSearch) {
          return;
        }

        placeSearchInstanceRef.current = new AMap.PlaceSearch({
          map: mapInst, // 展现结果的地图实例
          city: '', // 兴趣点城市
          panel: searchPanelElementId,
        });

        placeSearchInstanceRef.current?.on('selectChanged', function (e) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          findPlaceByLocationValue({
            lngAndLat: [e.selected.data.location.R, e.selected.data.location.Q],
            searchAddress: e.selected.data.address,
          });
        });
      },
      [findPlaceByLocationValue],
    );

    const { run: handleSearchAddress } = useDebounceFn(
      async ({
        searchValue,
        code,
        findPlaceByLocationValueCallBack,
      }: {
        searchValue?: string;
        code?: string;
        findPlaceByLocationValueCallBack?: () => void;
      }) => {
        if (!searchValue || !isReady) {
          return;
        }

        code && placeSearchInstanceRef.current?.setCity(code);

        placeSearchInstanceRef.current?.search(searchValue, (status, result) => {
          if (status === 'complete' && isObj(result)) {
            const lngLat = result.poiList.pois[0].location!;
            // const searchAddress = result.poiList.pois[0].address;

            findPlaceByLocationValue({
              lngAndLat: [lngLat.getLng(), lngLat.getLat()],
              // searchAddress,
            }).then(findPlaceByLocationValueCallBack);
          }
        });
      },
      { wait: 116 },
    );

    // todo: administrativeAddressInfo 跟 lat, lng 的初次同步可以压缩优化为一次

    useWatch(() => {
      if (isReset) {
        showPanelAction.setFalse();

        // 实现更好的重置行为
        // @see https://lbs.amap.com/api/javascript-api/guide/services/geolocation
      }
    }, [isReset]);

    useWatch(() => {
      if (
        !window.AMap?.PlaceSearch ||
        isReset ||
        !address ||
        (address && cacheChangeValueRef.current.address === address)
      ) {
        return;
      }

      const current = getArrayLastItem(administrativeAddress || []);
      const { name, adcode = '' } = isStr(current) ? { name: current } : current || {};

      showPanelAction.setTrue();

      handleSearchAddress({
        searchValue: address,
        code: adcode || name,
        findPlaceByLocationValueCallBack: () => {
          isAddressWatchChangeRef.current = true;
        },
      });
    }, [address, isReady]);

    // 根据经纬度同步
    // useWatch(
    //   () => {
    //     if (!pluginInstances.DistrictSearch || !lat || !lng) {
    //       return;
    //     }
    //     console.log(999);
    //     showPanelAction.setFalse();

    //     const lngAndLat = [lng, lat] as [number, number];

    //     findPlaceByLocationValue({
    //       lngAndLat,
    //       isClick: false,
    //     }).then(() => {
    //       mapInstance?.panTo(lngAndLat);
    //     });
    //   },
    //   [lat, lng, isReady],
    //   { isAreEqual: true },
    // );

    // 根据行政编码同步地图的
    useWatch(
      () => {
        // 如果是搜索地址的变动，那么就不进行同步了，不然会导致经纬度不一致
        if (isAddressWatchChangeRef.current) {
          resetIsAddressWatchChangeRef();
          return;
        }

        if (!pluginInstancesInitEnd() || !administrativeAddress?.length || isReset) {
          return;
        }

        showPanelAction.setFalse();

        const current = getArrayLastItem(administrativeAddress);
        const { name, adcode = '' } = isStr(current) ? { name: current } : current || {};

        handleSearchAddress({
          searchValue: name,
          code: adcode,
        });
      },
      [administrativeAddress, isReady],
      { isAreEqual: true },
    );

    return (
      <Spin spinning={!isReady}>
        <div className="map-box">
          <div id={mapElementId} />

          <div
            id={searchPanelElementId}
            className="map-search-panel"
            style={{
              display: showPanel ? 'block' : 'none',
            }}
          />
        </div>
      </Spin>
    );
  },
);
