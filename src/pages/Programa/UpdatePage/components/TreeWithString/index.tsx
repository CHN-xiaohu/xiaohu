import { generateCategoriesParentTree } from '@/pages/Programa/Utils';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import * as api from '@/pages/Programa/Api';
import { getRecommendProject, getTabsList } from '@/pages/CloudDesign/Project/Api';

import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import { Input, Cascader, Select } from 'antd';
import { useDebounceEffect } from 'ahooks';
import { getBizGroupSelectorList } from '@/pages/Product/Api/groups';
import { getByBusinessCode } from '@/pages/Adv/Api';

import { useLabelForm } from '../Form/LabelForm';

type IProps = {
  value: any;
  type: 'tree' | 'string' | 'select' | 'modal';
  actionType: string;
  onChange: (value: any) => void;
  [key: string]: any;
  treeData: {
    label: string;
    value: string;
  }[];
};

const TreeWithString = ({
  value,
  type = 'string',
  style,
  onChange,
  treeData,
  actionType,
  ...otherProps
}: IProps) => {
  const handleTreeChange = useCallback(
    (e: any) => {
      const newValue = e.length ? e[e.length - 1] : null;
      onChange?.(newValue);
    },
    [onChange],
  );

  const { originCategoryList } = useStoreState('programa');

  const [cascaderValue, setValue] = useState([]);

  const [currentType, setType] = useState('string');

  const [currentProductsList, setCurrentProductsList] = useState([] as any);

  const [tagList, setTagList] = useState([] as any);

  const [currentSearch, setCurrentSearch] = useState('');

  const [tagValueList, setTagValue] = useState([] as any);

  useEffect(() => {
    if (currentType === 'tree' || currentType === 'select' || currentType === 'modal') {
      onChange('');
    }
    setType(type);
  }, [type]);

  const {
    openForm: openLabelForm,
    ModalFormElement: LabelModalFormElement,
    chooseTagValue,
  } = useLabelForm({
    tags: tagList,
  });

  useEffect(() => {
    if (!value) {
      setValue(value as any);
    }
    if (value && typeof value === 'string' && type === 'tree') {
      const data = generateCategoriesParentTree(originCategoryList, value);
      setValue(data as any);
    }
    if (type === 'modal') {
      if (chooseTagValue.length < 1) {
        setTagValue([value]);
      } else {
        setTagValue(chooseTagValue);
      }
      getTabsList().then((res) => {
        setTagList(res.data);
      });
    }
  }, [type, value, originCategoryList]);

  useDebounceEffect(
    async () => {
      if (actionType === 'GROUP_PURCHASE_PAGE') {
        const { data } = await api.getGroupPurchase({ selectField: currentSearch, status: 3 });
        const groupList = data.records.map((item: any) => ({
          id: `${item.id},${item.activityName}`,
          name: item.activityName,
        }));
        const firstProducts = currentSearch ? groupList : [data.records[0]];
        setCurrentProductsList(firstProducts);
      } else if (actionType === 'DESIGN_DETAIL') {
        const { data } = await getRecommendProject({ keyword: currentSearch });
        const projectList = data.records?.map((item: any) => ({
          id: `${item?.designId},${item?.name}`,
          name: item?.name,
        }));
        const firstProject = currentSearch ? projectList : [data.records[0]];
        setCurrentProductsList(firstProject);
      } else if (actionType === 'ACTION_PAGE') {
        const { data } = await getByBusinessCode({
          searchName: currentSearch,
          businessCode: 'GET_CUSTOMER',
        });
        const activityFormList = data?.map((item: any) => ({
          id: `${item?.dataId},${item?.name}`,
          name: item?.name,
        }));
        const activityFormProject = currentSearch ? activityFormList : [data[0]];
        setCurrentProductsList(activityFormProject);
      } else if (actionType === 'PRODUCT_GROUP') {
        const { data } = await getBizGroupSelectorList({ selectField: currentSearch });
        const commodityGroupList = data?.map((item: any) => ({
          id: `${item?.id},${item?.name}`,
          name: item?.name,
        }));
        const commodityGroupProject = currentSearch ? commodityGroupList : [data[0]];
        setCurrentProductsList(commodityGroupProject);
      } else if (actionType === 'SCHEME_TAG_SEARCH') {
        if (value === undefined) {
          setTagValue([]);
        }
      } else {
        const { data } = await api.getProduct({ name: currentSearch });
        const firstProducts = currentSearch ? data.records : [data.records[0]];
        setCurrentProductsList(firstProducts);
      }
    },
    [currentSearch],
    {
      wait: 300,
    },
  );

  const handleSelectChange = (id: string, reactElement: React.ReactElement<any, string>) => {
    const item = {
      id: reactElement.props.value,
      name: reactElement.props.children,
    };

    onChange(item);
  };

  // 由于是商品列表分页的，请求给合并下默认选中项和列表，不然编辑时修改内容会显示不了 name
  useEffect(() => {
    if (type === 'select') {
      let newList = [];
      if (!currentSearch) {
        const hasTarget = currentProductsList.find((e: any) => e?.id === value?.id);
        newList =
          !hasTarget && value && currentProductsList.length
            ? [value, ...currentProductsList]
            : currentProductsList;
      } else {
        newList = currentProductsList;
      }
      setCurrentProductsList(newList);
    }
  }, [value, currentProductsList, type]);

  // 选择标签
  useEffect(() => {
    if (type === 'modal' && chooseTagValue.length > 0) {
      const item = {
        id: chooseTagValue![0]?.id,
        name: chooseTagValue![0]?.name,
      };
      onChange(item);
    }
  }, [chooseTagValue]);

  const handleGetFocus = () => {
    setCurrentProductsList(value ? [value] : []);
  };

  const handleOpenModal = () => {
    const tagValues = tagValueList![0]?.id?.split(',');

    const valueObt = {} as any;
    if (tagValues !== undefined && value !== undefined && value !== '') {
      tagList.forEach((tag: any) => {
        tagValues?.forEach((items) => {
          if (tag.tags.map((ii: { id: any }) => ii.id)?.includes(items)) {
            valueObt[`${tag.tagCategoryName}`] = items;
          }
        });
      });
    }

    openLabelForm({ ...valueObt });
  };

  const renderInput: React.ReactElement = (
    <Input
      style={style || { minWidth: '175px', maxWidth: '175px' }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      {...otherProps}
      value={value}
    />
  );

  const renderTree: React.ReactElement = (
    <Cascader
      showSearch
      allowClear={false}
      style={style || { minWidth: '175px', maxWidth: '175px' }}
      onChange={handleTreeChange}
      options={treeData}
      value={cascaderValue}
    />
  );
  const renderSelect: React.ReactElement = (
    <Select
      filterOption={false}
      showSearch
      onSearch={(e: string) => setCurrentSearch(e)}
      allowClear={false}
      placeholder="请输入"
      style={style || { minWidth: '175px', maxWidth: '175px' }}
      onChange={handleSelectChange as any}
      value={value?.id}
      onFocus={handleGetFocus}
    >
      {currentProductsList.map((item: any) => (
        <Select.Option key={item?.id} value={item?.id}>
          {item?.name}
        </Select.Option>
      ))}
    </Select>
  );

  const renderModal: React.ReactElement = (
    <Select
      placeholder="请输入"
      style={style || { minWidth: '175px', maxWidth: '175px' }}
      onChange={handleSelectChange as any}
      value={value !== undefined && value !== '' ? tagValueList![0]?.id : undefined}
      onClick={handleOpenModal}
    >
      {value !== undefined &&
        value !== '' &&
        tagValueList?.length > 0 &&
        tagValueList?.map((item: any) => (
          <Select.Option key={item?.id} value={item?.id}>
            {item?.name}
          </Select.Option>
        ))}
    </Select>
  );

  const renderItem = (): React.ReactElement | null => {
    switch (type) {
      case 'select':
        return renderSelect;
      case 'string':
        return renderInput;
      case 'tree':
        return renderTree;
      case 'modal':
        return renderModal;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {LabelModalFormElement}
      {renderItem()}
    </div>
  );
};

export default TreeWithString;
