import { useEffect, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd/lib/select';
import { getTabsList } from '@/pages/CloudDesign/Project/Api';
import { useLabelForm } from '@/pages/Programa/UpdatePage/components/Form/LabelForm';

export interface SelectByLoadMoreProps extends Omit<SelectProps<any>, 'onChange'> {}

type IProps = {
  value: any;
  onChange: (value: any) => void;
};
const TagForm = ({ onChange, ...props }: IProps) => {
  const [tagList, setTagList] = useState([] as any);
  const [tagValueList, setTagValue] = useState([] as any);

  useEffect(() => {
    getTabsList().then((res) => {
      setTagList(res.data);
    });
  }, []);

  const {
    openForm: openLabelForm,
    ModalFormElement: LabelModalFormElement,
    chooseTagValue,
  } = useLabelForm({
    tags: tagList,
  });

  useEffect(() => {
    const item = {
      id: chooseTagValue![0]?.id,
      name: chooseTagValue![0]?.name,
    };
    onChange(item);
    if (chooseTagValue.length < 1) {
      setTagValue([props.value]);
    } else {
      setTagValue(chooseTagValue);
    }
  }, [chooseTagValue]);

  const handleOpenModal = () => {
    const tagValues = tagValueList![0]?.id?.split(',');

    const valueObt = {} as any;
    if (tagValues !== undefined) {
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

  return (
    <>
      {LabelModalFormElement}
      <Select placeholder="请输入" value={tagValueList![0]?.id} onClick={handleOpenModal}>
        {tagValueList?.length > 0 &&
          tagValueList?.map((item: any) => (
            <Select.Option key={item?.id} value={item?.id}>
              {item?.name}
            </Select.Option>
          ))}
      </Select>
    </>
  );
};

export default TagForm;
