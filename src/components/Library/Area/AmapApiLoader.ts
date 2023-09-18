/* eslint-disable no-undef */
import { useCallback, useRef } from 'react';

import { isObject } from 'lodash';
import { useBoolean } from 'ahooks';

import { useScript } from '@/foundations/hooks';

type IAMAPPlugin = {
  DistrictSearch: AMap.DistrictSearch.Options;
  Geocoder: AMap.Geocoder.Options;
  Marker: AMap.Marker.Options;
  PlaceSearch: AMap.PlaceSearch.Options;
};

type IAMAPPluginClass = {
  DistrictSearch: AMap.DistrictSearch;
  Geocoder: AMap.Geocoder;
  Marker: AMap.Marker;
  PlaceSearch: AMap.PlaceSearch;
};

const DEFAULT_AMP_CONFIG = {
  key: '',
  v: '1.4.15',
  protocol: 'https',
  hostAndPath: 'webapi.amap.com/maps',
  // @see https://lbs.amap.com/api/javascript-api/guide/abc/plugins
  plugin: ['DistrictSearch', 'Geocoder', 'Marker', 'PlaceSearch'],
  callback: 'amapInitComponent',
};

const getRealPluginName = (name: string) => `AMap.${name}`;

type IParams = {
  mapElementId?: string;
  config: Partial<typeof DEFAULT_AMP_CONFIG> & {
    onCreateMapReady?: (m: AMap.Map) => void;
    onLoadPluginsReady?: (m: AMap.Map, pluginInstances: TPluginInstances) => void;
  };
  pluginOptions?: { [k in keyof IAMAPPlugin]: IAMAPPlugin[k] };
};

type TPluginInstances = { [k in keyof IAMAPPluginClass]: IAMAPPluginClass[k] };

declare global {
  interface Window {
    AMAP_PluginInstances: TPluginInstances;
  }
}

// 初始化 高德 jssdk 插件实例
// if (!pluginInstancesRef.current) {
//   pluginInstancesRef.current = {} as TPluginInstances;
// }

/**
 * @ref https://github.com/ElemeFE/vue-amap/blob/dev/src/lib/services/lazy-amap-api-loader.js
 */
export const useAMAP = ({
  mapElementId,
  config = {},
  pluginOptions = {
    DistrictSearch: {
      // 关键字对应的行政区级别，country表示国家
      level: 'country',
      // 显示下级行政区级数，1表示返回下一级行政区
      subdistrict: 1,
      extensions: 'all',
    },
    Geocoder: {},
    Marker: {},
    PlaceSearch: {
      pageSize: 10, // 单页显示结果条数
      pageIndex: 1, // 页码
      city: '010', // 兴趣点城市
      citylimit: true, // 是否强制限制在设置的城市内搜索
      autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    },
  },
}: IParams) => {
  const mapInstanceRef = useRef<AMap.Map>();
  const pluginInstancesRef = useRef({} as TPluginInstances);
  const [isReady, isReadyAction] = useBoolean();

  const realConfig = {
    ...DEFAULT_AMP_CONFIG,
    ...config,
  };

  const createMap = () => {
    if (mapElementId && !mapInstanceRef.current) {
      // eslint-disable-next-line no-undef
      mapInstanceRef.current = new AMap.Map(mapElementId, {
        zoom: 12,
        resizeEnable: true,
      });

      config.onCreateMapReady?.(mapInstanceRef.current);
    }
  };

  useScript(`https://${realConfig.hostAndPath}?v=${realConfig.v}&key=${realConfig.key}`, {
    load: () => {
      // 创建图片 ui
      createMap();

      // 异步同时加载多个插件
      (AMap as any).plugin(
        realConfig.plugin.map((pluginName) => getRealPluginName(pluginName)),
        () => {
          realConfig.plugin.forEach((pluginName) => {
            const pluginInstance = new AMap[pluginName](pluginOptions[pluginName]);

            if (mapInstanceRef.current) {
              mapInstanceRef.current.addControl(pluginInstance);
            }

            pluginInstancesRef.current[pluginName] = pluginInstance;
          });

          setTimeout(() => {
            config.onLoadPluginsReady?.(mapInstanceRef.current!, pluginInstancesRef.current!);

            isReadyAction.setTrue();
          });
        },
      );
    },
  });

  const districtSearchSearch = useCallback(
    (keywords: string) =>
      new Promise<AMap.DistrictSearch.SearchResult>((resolve, reject) => {
        pluginInstancesRef.current.DistrictSearch.search(keywords, (status, result) => {
          if (status === 'complete' && isObject(result)) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      }),
    [],
  );

  const geocoderGetAddress = useCallback(
    (lngLat: AMap.LocationValue) =>
      new Promise<AMap.Geocoder.ReGeocodeResult>((resolve, reject) => {
        pluginInstancesRef.current.Geocoder.getAddress(lngLat, function (status, result: any) {
          if (status === 'complete' && result.regeocode) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      }),
    [],
  );

  const pluginInstancesInitEnd = useCallback(
    () => !!Object.keys(pluginInstancesRef.current).length && !!window.AMap,
    [],
  );

  return {
    isReady,
    pluginInstances: pluginInstancesRef.current,
    mapInstance: mapInstanceRef.current,
    createMap,
    geocoderGetAddress,
    districtSearchSearch,
    pluginInstancesInitEnd,
  };
};
