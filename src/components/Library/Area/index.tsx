import { memo, useCallback, useEffect, useState } from 'react';
import { Cascader, Spin } from 'antd';
import type { CascaderOptionType } from 'antd/es/cascader';
import type { CascaderProps, CascaderValueType } from 'antd/lib/cascader';

import { usePersistFn } from 'ahooks';
import { isEqual } from 'lodash';

import { useAMAP } from './AmapApiLoader';

import { useDebounceWatch, useWatch } from '@/foundations/hooks';
import { isArr, isObj, getArrayLastItem } from '@/utils';

export type IAreaProps = {
  showAreaLevel?: number;
  // 判断是否一定要用adcode，比如搜索时
  isUseCode?: boolean;
  onChange?: (
    v: CascaderValueType,
    options: AMap.DistrictSearch.District[],
    isInput: boolean,
  ) => void;
  guiseSyncChangeByValue?: CascaderProps['value'];
} & Omit<CascaderProps, 'fieldNames' | 'options' | 'loadData' | 'onChange'>;

const generateSubTag = (dataSource: any[]) =>
  dataSource.map((item) => ({ ...item, isLeaf: false }));

type CacheOptions = (AMap.DistrictSearch.District & {
  children?: CacheOptions;
  isLeaf?: boolean;
})[];

// 缓存起来
let cacheOptions = [] as CacheOptions;

const crateNewOptionsByCache = (
  opt: typeof cacheOptions,
  showAreaLevel: number = 3,
  currentLevel: number = 1,
): typeof cacheOptions =>
  opt.map((item) => {
    const canShowChildren = showAreaLevel > currentLevel;

    return {
      isLeaf: !canShowChildren,
      children:
        !canShowChildren || !item.children?.length
          ? undefined
          : crateNewOptionsByCache(item.children, showAreaLevel, currentLevel + 1),
      ...item,
    };
  });

const setOptionLeafToTrue = (opt: CacheOptions[number]) => {
  opt.isLeaf = true;
  opt.children = undefined;
};

const setChildrenIsLeafToTrue = (children: CacheOptions[number]['children'] = []) => {
  const first = children[0];

  // 中山跟东莞是特殊市
  const zhongShanAndDongGuang =
    ['0760', '0769'].includes(first.citycode) &&
    // @ts-ignore
    first.level === 'street';

  // 香港跟澳门是特殊的行政区
  const xiangGuangAndAoMen = ['1852', '1853'].includes(first.citycode);

  if (zhongShanAndDongGuang || xiangGuangAndAoMen) {
    children.forEach((item) => setOptionLeafToTrue(item));
  }
};

const Main = ({
  showAreaLevel = 4,
  defaultValue = [],
  value,
  isUseCode = true,
  onChange,
  guiseSyncChangeByValue,
  ...lastProps
}: IAreaProps) => {
  const [options, setOptions] = useState(() => crateNewOptionsByCache(cacheOptions, showAreaLevel));

  const [ready, setReady] = useState(false);
  const [internalValue, setInternalValue] = useState<CascaderValueType>([]);

  const { pluginInstances, isReady } = useAMAP({
    config: { key: '060f5582a23f52cf6c9dff74978e189f' },
  });

  const handleSetOptions = useCallback((values: AMap.DistrictSearch.District[]) => {
    setOptions(values);
    cacheOptions = values;
  }, []);

  const requestSearchAddress = useCallback(
    (keywords: string) =>
      new Promise<AMap.DistrictSearch.District[]>((resolve, reject) => {
        pluginInstances.DistrictSearch.search(keywords, (status, result) => {
          if (status === 'complete' && isObj(result)) {
            resolve(result.districtList?.[0]?.districtList || []);
          } else {
            reject(result);
          }
        });
      }),
    [pluginInstances],
  );

  const initProvincialAddressInfo = useCallback(
    () =>
      requestSearchAddress('中国').then((res) => {
        const optionsResult = generateSubTag(res);

        // 台湾省没有任何下级
        optionsResult.forEach((item) => {
          if (item.citycode === '1886') {
            setOptionLeafToTrue(item);
          }
        });

        handleSetOptions(optionsResult);

        return optionsResult;
      }),
    [requestSearchAddress, handleSetOptions, pluginInstances.DistrictSearch],
  );

  const canShowAreaChildren = (currentLen: number) => currentLen < showAreaLevel - 1;

  const loadData = usePersistFn((selectedOptions?: CascaderOptionType[]) => {
    if (!isArr(selectedOptions) || !canShowAreaChildren(selectedOptions.length - 1)) {
      return Promise.resolve();
    }

    const targetOption = selectedOptions[selectedOptions.length - 1];

    if (targetOption.children?.length || targetOption.isLeaf) {
      return Promise.resolve();
    }

    pluginInstances.DistrictSearch.setLevel(targetOption.level);

    // 开启对应项 loading
    targetOption.loading = true;

    return requestSearchAddress(targetOption.adcode).then((res) => {
      targetOption.loading = false;

      if (res.length) {
        targetOption.children = canShowAreaChildren(selectedOptions.length)
          ? generateSubTag(res)
          : res;

        setChildrenIsLeafToTrue(targetOption.children);
      } else {
        setOptionLeafToTrue(targetOption);
      }

      handleSetOptions([...options]);

      return options;
    });
  });

  const findOptionItem = (option: typeof cacheOptions, itemValue: any) =>
    option.find((item) => (isUseCode ? item.adcode === itemValue : item.name === itemValue));

  const tryFindCityOptions = async (
    columnOptions: CacheOptions,
    values: any[],
    currentValueIndex: number,
  ) => {
    // 这种情况是利用高德的地理坐标逆编码时，遇到重庆/上海这类特殊行政区域时，返回的省市县地址数据跟 DistrictSearch.search
    // 查找的数据不一致，主要时 city 缺失，所以这里将尝试修正数据
    const nextcolumnOption = columnOptions[currentValueIndex - 1].children;
    const nextChildrenValue = values[currentValueIndex + 1];

    if (currentValueIndex !== values.length - 1 && nextcolumnOption?.length) {
      // 还不是最后一项，那么就代表这一项数据缺失了，那么就尝试寻找下级的数据，然后找补
      for (let i = 0, len = nextcolumnOption.length; i < len; i += 1) {
        const currentColumnOptions = [...columnOptions, nextcolumnOption[i]];
        // eslint-disable-next-line no-await-in-loop
        await loadData(currentColumnOptions);

        const findChildrenValueItem = findOptionItem(
          currentColumnOptions[currentValueIndex]?.children || [],
          nextChildrenValue,
        );

        if (findChildrenValueItem) {
          return currentColumnOptions;
        }
      }
    }

    return undefined;
  };

  const handleDefaultValues = async (values: any[]) => {
    if (values.length) {
      let columnOptions = [];

      for (let i = 0; i < values.length; i += 1) {
        const currentValue = values[i];
        const currentOption = (
          !columnOptions.length ? options : getArrayLastItem(columnOptions)?.children || []
        ) as typeof cacheOptions;

        const current = findOptionItem(currentOption, currentValue);

        if (current) {
          columnOptions.push(current);
          // eslint-disable-next-line no-await-in-loop
          await loadData(columnOptions);
        } else if (!currentValue) {
          // 这种情况是利用高德的地理坐标逆编码时，遇到重庆/上海这类特殊行政区域时，返回的省市县地址数据跟 DistrictSearch.search
          // 查找的数据不一致，主要时 city 缺失，所以这里将尝试修正数据
          // @ts-ignore
          // eslint-disable-next-line no-await-in-loop
          const findAllOptopnsByCurrentcolumnOptions = await tryFindCityOptions(
            columnOptions,
            values,
            i,
          );

          if (findAllOptopnsByCurrentcolumnOptions) {
            columnOptions = findAllOptopnsByCurrentcolumnOptions;
            values[i] = getArrayLastItem(findAllOptopnsByCurrentcolumnOptions)?.name;
          }
        }
      }

      return columnOptions;
    }

    return [];
  };

  const init = async () => {
    if (pluginInstances.DistrictSearch && isReady) {
      if (!options.length) {
        await initProvincialAddressInfo();
      }

      setReady(true);
    }
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useDebounceWatch(
    () => {
      if (!ready || guiseSyncChangeByValue) {
        return;
      }

      const realValue = value || defaultValue;

      if (isEqual(realValue, internalValue)) {
        return;
      }

      setInternalValue(realValue);
      handleDefaultValues(realValue);
    },
    [value, ready],
    { ms: 60, immediate: true },
  );

  const handleChange = useCallback(
    (selectedValue: CascaderValueType, selectedOptions?: CascaderOptionType[], isInput = true) => {
      setInternalValue(selectedValue);
      onChange?.(selectedValue, selectedOptions as AMap.DistrictSearch.District[], isInput);
    },
    [onChange],
  );

  useWatch(() => {
    if (guiseSyncChangeByValue && ready) {
      handleDefaultValues(guiseSyncChangeByValue).then((opts) => {
        handleChange(guiseSyncChangeByValue, opts, false);
      });
    }
  }, [guiseSyncChangeByValue, ready]);

  return (
    <Spin spinning={!ready}>
      <Cascader
        {...{
          ...lastProps,
          options,
          loadData,
          value: internalValue,
          fieldNames: isUseCode
            ? { label: 'name', value: 'adcode' }
            : { label: 'name', value: 'name' },
          onChange: handleChange,
        }}
      />
    </Spin>
  );
};

export const AreaByAmap = memo(Main);
export default AreaByAmap;
