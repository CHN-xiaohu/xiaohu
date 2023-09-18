import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';

import { createAsyncFormActions } from '@formily/antd';

import { useCallback, useRef, useEffect, useMemo } from 'react';

import { useDebounceFn } from 'ahooks';

import { updateDeliveryFields, handleUpdateDeliveryRequest } from './Fields/UpdateDelivery';
import {
  addOrderLogRemarkFields,
  handleAddOrderLogRemarkRequest,
} from './Fields/AddOrderLogRemark';
import { cancelOrderFields, handleCancelOrderRequest } from './Fields/CancelOrder';
import { reimburseFields, handleReimburseRequest } from './Fields/Reimburse';
import { customerPhoneFields, handleCustomerPhoneRequest } from './Fields/CustomerPhone';
import { customerAddressFields, handleCustomerAddressRequest } from './Fields/CustomerAddress';
import { customerNameFields, handleCustomerNameRequest } from './Fields/CustomerName';
import { deliveryFields, handleDeliveryRequest } from './Fields/Delivery';
import { AddOrderNum } from './Fields/AddOrderNum';
import { SupplyCancelTips } from './Fields/SupplyCancelTips';

import { useFields } from './components/FormFields';

import {
  useModalForm,
  changeVisibleFormLayoutItemForLayerForm,
} from '@/components/Business/Formily';

import type { PurchaseOrderColumns } from '../Api';

enum formTypes {
  customerName = 'customerName',
  customerPhone = 'customerPhone',
  customerAddress = 'customerAddress',
  delivery = 'delivery',
  updateDelivery = 'updateDelivery',
  reimburse = 'reimburse',
  cancel = 'cancel',
  updateOrderDetail = 'updateOrderDetail',
  addOrderLogRemark = 'addOrderLogRemark',
}

const formTypesToArray = Object.keys(formTypes);

export type UseOrderDetailStoreProps = {
  //
};

export const formActions = createAsyncFormActions();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useOrderDetailStore(props: UseOrderDetailStoreProps = {}) {
  const [state, setState] = useImmer({
    dataSource: {} as PurchaseOrderColumns,
    reRequestOrderDetail: 0,
    submitSuccess: '',
  });
  const formStepRef = useRef<keyof typeof formTypes>();
  const dataSourceRef = useRef<PurchaseOrderColumns>({} as any);

  const initFields = useFields();

  const fields = useMemo(() => {
    return {
      addOrderNum: AddOrderNum,
      ...initFields,
      ...(window.location.pathname.includes('/orders/supplier')
        ? { supplyCancelTips: SupplyCancelTips }
        : {}),
    };
  }, [initFields]);

  useEffect(() => {
    dataSourceRef.current = state.dataSource;
  }, [state.dataSource]);

  const reRequestOrderDetail = useCallback((externalDraft?: typeof state) => {
    if (externalDraft) {
      externalDraft.reRequestOrderDetail += 1;
    } else {
      setState((draft) => {
        draft.reRequestOrderDetail += 1;
      });
    }
  }, []);

  const { run: handleSubmit } = useDebounceFn(
    (data: any) => {
      const { values, request } = {
        [formTypes.customerName]: handleCustomerNameRequest,
        [formTypes.customerPhone]: handleCustomerPhoneRequest,
        [formTypes.customerAddress]: handleCustomerAddressRequest,
        [formTypes.delivery]: handleDeliveryRequest,
        [formTypes.updateDelivery]: handleUpdateDeliveryRequest,
        [formTypes.reimburse]: handleReimburseRequest,
        [formTypes.cancel]: handleCancelOrderRequest,
        [formTypes.addOrderLogRemark]: handleAddOrderLogRemarkRequest,
      }[formStepRef.current as keyof typeof formTypes](
        { id: dataSourceRef.current.id, ...data },
        dataSourceRef.current,
      );

      return request(values).then(() => {
        setState((draft) => {
          reRequestOrderDetail(draft);

          draft.submitSuccess = `${formStepRef.current}_${draft.reRequestOrderDetail}`;

          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          closeModalForm();
        });
      });
    },
    { wait: 116 },
  );

  const { openModalForm, closeModalForm, ModalFormElement } = useModalForm({
    actions: formActions,
    onSubmit: handleSubmit,
    labelCol: { span: 6 },
    fields,
    isNativeAntdStyle: true,
    schema: {
      ...cancelOrderFields,
      ...addOrderLogRemarkFields,
      ...updateDeliveryFields,
      ...reimburseFields,
      ...customerAddressFields,
      ...customerNameFields,
      ...customerPhoneFields,
      ...deliveryFields,
    },
  });

  const openModal = useCallback(
    ({
      formStep,
      title,
      initialValues = {},
    }: {
      formStep: keyof typeof formTypes;
      title: string;
      initialValues?: any;
    }) => {
      return openModalForm({
        title,
        initialValues,
        // fields: fieldss,
      }).then(() => {
        changeVisibleFormLayoutItemForLayerForm(formActions, formTypesToArray, formStep);

        formStepRef.current = formStep;
      });
    },
    [],
  );

  return {
    state,
    setState,
    openModal,
    reRequestOrderDetail,
    ModalFormElement,
  };
}

export const Container = createContainer(useOrderDetailStore);
