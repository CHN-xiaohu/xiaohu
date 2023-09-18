import * as React from 'react';
import { Input, Checkbox, message } from 'antd';

import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import type { ProductColumns } from '@/pages/Product/Api';

import { useDebounceWatch, useWatch } from '@/foundations/hooks';

import { strRandom } from '@/utils';

import styles from './index.less';

type Props = {
  name: string;
  value: string[];
  options: any[];
  defaultValue: string[];
  dataSource: any;
  onChange?: (value: CheckboxValueType[]) => void;
  onCheckAttributeChange?: (dataSource: any, value: ProductColumns['introductions']) => void;
};

const Main: React.FC<Props> = ({
  value,
  name,
  dataSource = {},
  defaultValue,
  options = [],
  onChange,
  onCheckAttributeChange,
}) => {
  const [innerOptions, setInnerOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [defaultCheckValue, setDefaultCheckValue] = React.useState<any[]>(
    value || defaultValue || [],
  );

  const completeOptions = React.useMemo(() => options.concat(innerOptions), [
    options,
    innerOptions,
  ]);

  const handleAttributeChange = React.useCallback((checkedValues: CheckboxValueType[]) => {
    setDefaultCheckValue(checkedValues);

    onChange?.(checkedValues);
  }, []);

  useDebounceWatch(
    () => {
      requestAnimationFrame(() => {
        const labelInValues = completeOptions.filter((opt) =>
          defaultCheckValue.includes(opt.value),
        );

        onCheckAttributeChange?.(dataSource, labelInValues);
      });
    },
    [defaultCheckValue],
    { ms: 600, isAreEqual: true },
  );

  useWatch(
    () => {
      handleAttributeChange([...new Set(defaultValue || [])]);
    },
    [defaultValue],
    { isAreEqual: true },
  );

  const clearInputValue = React.useCallback(() => {
    const el = document.getElementById(`attribute${dataSource.id}`);
    if (el) {
      // eslint-disable-next-line no-unused-expressions
      (el.parentNode?.lastElementChild?.children[0] as HTMLElement)?.click();
    }
  }, [dataSource.id]);

  const handleAddAttribute = React.useCallback(
    (attributeValue: string) => {
      if (!attributeValue) {
        return;
      }

      if (completeOptions.some((item) => item.label === attributeValue)) {
        message.error(`该属性名称已存在，请更换: ${attributeValue}`);

        return;
      }

      setInnerOptions((opt) => [
        ...opt,
        {
          value: `inner_${strRandom(8)}`,
          label: attributeValue,
          parent_id: dataSource.id,
          parent_name: dataSource.name,
        },
      ]);

      clearInputValue();
    },
    [dataSource, completeOptions],
  );

  const renderCustomSpecificationItemInput = (
    <div className={styles.attributeItemInput}>
      <Input.Search
        placeholder="请输入新增的规格属性名"
        enterButton="增加"
        id={`attribute${dataSource.id}`}
        style={{
          width: 280,
        }}
        allowClear
        onSearch={handleAddAttribute}
      />
    </div>
  );

  return (
    <div className={styles.itemWrapper}>
      <div className={styles.attributeItemName}>选择标准{name}可增加搜索/导购机会</div>

      {/* 只有允许自定义增加规格属性的才显示 */}
      {Number(dataSource.custom) === 1 && renderCustomSpecificationItemInput}

      {!!completeOptions.length && (
        <div className={styles.attributeItemValues}>
          <Checkbox.Group
            value={defaultCheckValue}
            options={completeOptions}
            onChange={handleAttributeChange}
          />
        </div>
      )}
    </div>
  );
};

export const Specification = React.memo(Main);
