import './index.less';

import { Button, Col, Input, Row } from 'antd';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { useDebounceFn } from 'ahooks';

import type { MapBoxProps } from './MapBox';
import { MapBox } from './MapBox';

import type { IAreaProps } from '../Area';
import { AreaByAmap } from '../Area';
import { useWatch } from '@/foundations/hooks';

type ChangeValue = Pick<MapBoxProps, 'lat' | 'lng' | 'administrativeAddress' | 'address'>;
export type AdministrativeAddressChangeValue = AMap.DistrictSearch.District[];

// administrativeAddress 在传入时可以是 string[], 但是回传的时候必须是 AdministrativeAddressChangeValue
// 因为后端需要储存对应的 code
type RealChangeValue = ChangeValue & { administrativeAddress: AdministrativeAddressChangeValue };

export type MapAddressProps = {
  value?: RealChangeValue;
  onChange?: (v?: RealChangeValue) => void;
} & Pick<IAreaProps, 'showAreaLevel' | 'placeholder' | 'isUseCode'> &
  ChangeValue;

const SearchBox = memo(
  ({
    value,
    onChange,
    onPerformSearch,
  }: {
    value?: string;
    onChange: (v?: string) => void;
    onPerformSearch: () => void;
  }) => {
    return (
      <Row style={{ marginTop: 12 }} gutter={16}>
        <Col span={12}>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="请输入详细地址"
          />
        </Col>

        <Col>
          <Button onClick={onPerformSearch}>搜索地图</Button>
        </Col>
      </Row>
    );
  },
);

export const MapAddress = ({
  lat,
  lng,
  administrativeAddress,
  address,
  onChange,
  isUseCode = false,
  showAreaLevel = 3,
  placeholder = '请选择地址信息',
  value,
}: MapAddressProps) => {
  const [innerDetailAddress, setInnerDetailAddress] = useState<undefined | string>();
  const [searchAddress, setSearchAddress] = useState<string | undefined>(undefined);
  const [guiseSyncChangeByValue, setGuiseSyncChangeByValue] = useState<string[] | undefined>();
  const cacheChangeValueRef = useRef<ChangeValue>({});

  const { run: handleSyncChange } = useDebounceFn(
    () => {
      let changeValue = { ...(cacheChangeValueRef.current as RealChangeValue) } as
        | RealChangeValue
        | undefined;

      const changeValueKeys = Object.keys(cacheChangeValueRef.current);

      if (!changeValueKeys.length) {
        changeValue = undefined;
      }

      if (changeValue && !changeValueKeys.filter((k) => Boolean(changeValue?.[k])).length) {
        changeValue = undefined;
      }

      onChange?.(changeValue);
    },
    { wait: 360 },
  );

  const handlePerformSearch = useCallback(() => {
    setSearchAddress(cacheChangeValueRef.current.address);
  }, []);

  const handleSearchChange = useCallback(
    (v?: string, isChange = true) => {
      cacheChangeValueRef.current.address = v || undefined;

      setInnerDetailAddress(v);

      if (isChange) {
        handleSyncChange();
      }
    },
    [handleSyncChange],
  );

  const handleGuiseSyncChangeByValue: MapBoxProps['onChange'] = useCallback(
    ({ place, ...last }) => {
      setGuiseSyncChangeByValue(place);

      cacheChangeValueRef.current = { ...cacheChangeValueRef.current, ...last };
    },
    [],
  );

  const handleMapValueChange: MapBoxProps['onChange'] = useCallback(
    ({ place, ...last }) => {
      handleSearchChange(last.address, false);

      handlePerformSearch();

      handleGuiseSyncChangeByValue({ place, ...last });
    },
    [handleSearchChange, handleGuiseSyncChangeByValue],
  );

  const handleAreaChange: IAreaProps['onChange'] = useCallback((_, options) => {
    if (options?.length) {
      cacheChangeValueRef.current.administrativeAddress = options;
    } else {
      delete cacheChangeValueRef.current.administrativeAddress;
    }

    handleSyncChange();
  }, []);

  useEffect(() => {
    cacheChangeValueRef.current.administrativeAddress = [];

    handleGuiseSyncChangeByValue({
      place: (administrativeAddress || []) as string[],
      lat,
      lng,
    });

    handleSearchChange(address, false);
    handlePerformSearch();
  }, [lat, lng, administrativeAddress, address]);

  useWatch(() => {
    if (value === undefined) {
      cacheChangeValueRef.current = {};

      setInnerDetailAddress(undefined);
      setGuiseSyncChangeByValue([]);
    }
  }, [value]);

  return (
    <div>
      <AreaByAmap
        {...{
          isUseCode,
          placeholder,
          showAreaLevel,
          guiseSyncChangeByValue,
          onChange: handleAreaChange,
        }}
      />

      <SearchBox
        {...{
          value: innerDetailAddress,
          onChange: handleSearchChange,
          onPerformSearch: handlePerformSearch,
        }}
      />

      <MapBox
        {...{
          lat: cacheChangeValueRef.current.lat,
          lng: cacheChangeValueRef.current.lng,
          administrativeAddress: cacheChangeValueRef.current.administrativeAddress,
          onChange: handleMapValueChange,
          address: searchAddress,
        }}
      />
    </div>
  );
};
