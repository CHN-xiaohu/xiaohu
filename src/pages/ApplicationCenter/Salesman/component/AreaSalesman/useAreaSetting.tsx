import { useModalForm } from '@/components/Business/Formily';
import { onCloseModalForm$ } from '@/components/Business/Formily/components/Forms/ModalForm';
import { AreaTreeSelect } from '@/components/Library/Area/TreeSelect';

import { createAsyncFormActions } from '@formily/antd';

import { addAreaSetting } from '../../Api';

type Props = {
  onAddSuccess: () => void;
};

const formActions = createAsyncFormActions();

export const useAreaSetting = ({ onAddSuccess }: Props) => {
  const handleAddressArray = (addressArray: any, useLabelAndValue: boolean) => {
    const addressList = [] as any;
    const fields = [
      ['provinceName', 'provinceId'],
      ['cityName', 'cityId'],
      ['areaName', 'areaId'],
    ];

    addressArray.forEach((items: any) => {
      if (items) {
        const areaInfo = (items as {
          name: string;
          adcode: string;
          label: string;
          value: string;
        }[]).reduce(
          (previous, current, currentIndex) => ({
            ...previous,
            [fields[currentIndex][0]]: useLabelAndValue ? current.name : current.label,
            [fields[currentIndex][1]]: useLabelAndValue ? current.adcode : current.value,
          }),
          {},
        );
        addressList.push(areaInfo);
      }
    });
    return addressList;
  };

  const handleSubmit = (values: any, records: any) => {
    let addressList = [] as any;
    let addressUndefined = true as any;

    formActions.getFieldState('sysSalesmanRegionalAgentInfos', (fieldState) => {
      addressUndefined = !!fieldState.values![0]![0];
      if (fieldState.values![0]![0]) {
        if (fieldState.values![0]![0]![0]?.adcode) {
          addressList = handleAddressArray(fieldState.values[0], true);
        }
      }
    });

    if (
      records?.initSysSalesmanRegionalAgentInfos.length > 0 &&
      addressList?.length < 1 &&
      addressUndefined
    ) {
      addressList = handleAddressArray(records?.initSysSalesmanRegionalAgentInfos, false);
    }

    return addAreaSetting({ sysSalesmanRegionalAgentInfos: addressList, id: values }).then(
      onAddSuccess,
    );
  };

  const { openModalForm, ModalFormElement } = useModalForm({
    onUpdate: handleSubmit,
    actions: formActions,
    components: {
      AreaTreeSelect,
    },
    effects: () => {
      onCloseModalForm$().subscribe(() => {
        formActions.setFieldState('sysSalesmanRegionalAgentInfos', (fieldState) => {
          fieldState.props!['x-component-props']!.defaultValue = undefined;
        });
      });
    },
    isNativeAntdStyle: true,
    title: '区域配置',
    schema: {
      salesmanName: {
        title: '业务员名称',
        type: 'string',
        'x-component-props': {
          placeholder: '这是不能编辑的',
        },
      },
      sysSalesmanRegionalAgentInfos: {
        type: 'string',
        title: '服务区域',
        // 'x-rules': {
        //   required: true,
        // },
        'x-component': 'AreaTreeSelect',
        'x-component-props': {
          placeholder: '请选择服务区域',
          labelInValue: true,
        },
      },
    },
  });

  const handleOpenSettingForm = (initialValues = {} as any) => {
    openModalForm({
      initialValues: {
        ...initialValues,
      },
    }).then(() => {
      formActions.setFieldState('salesmanName', (fieldState) => {
        fieldState.props['x-component-props']!.disabled = initialValues.id;
      });

      // 编辑时的操作
      formActions.setFieldState('sysSalesmanRegionalAgentInfos', (fieldState) => {
        fieldState.props!['x-component-props']!.defaultValue =
          initialValues?.sysSalesmanRegionalAgentInfos || [];

        fieldState.props!['x-component-props']!.disabledKeys = initialValues.id
          ? initialValues?.alreadyAddressList
          : [];
      });
    });
  };

  return {
    openForm: handleOpenSettingForm,
    ModalFormElement,
  };
};
