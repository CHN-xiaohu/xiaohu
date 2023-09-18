import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import type { EventEmitter } from 'ahooks/lib/useEventEmitter';

import type { RouteChildrenProps } from '@/typings/basis';

import { MoneyText } from '@/components/Library/MoneyText';

import { useCallback } from 'react';

import { ChooseProduct } from './ChooseProductModal';

import { useLiveGoodModalForm } from './ChooseProductModal/Form';

import { priceTypeInvertMap, productAuditStatus, productAuditStatusInvertMap } from '../constants';
import type { LiveProductColumns } from '../api';
import { liveProductAudit, resetLiveProductAudit } from '../api';
import { deleteLiveProduct } from '../api';
import { getLiveProducts } from '../api';

export type ProductManagerProps = {
  // 商品状态
  auditStatus: keyof typeof productAuditStatus;
  // 事件总线
  upperAndLowerShelves$: EventEmitter<number[]>;
} & Partial<RouteChildrenProps>;

export function Product({ auditStatus, upperAndLowerShelves$ }: ProductManagerProps) {
  const { actionsRef } = useGeneralTableActions<LiveProductColumns>();
  const { openLiveProductForm, ModalFormElement } = useLiveGoodModalForm(() =>
    actionsRef.current.reload(),
  );

  const underReview = auditStatus === productAuditStatusInvertMap.审核中;

  const canSubmitReview = [
    productAuditStatusInvertMap.未审核,
    productAuditStatusInvertMap.审核失败,
  ].includes(auditStatus as any);

  upperAndLowerShelves$.useSubscription((t) => {
    if (t.includes(auditStatus)) {
      actionsRef.current.reload();
    }
  });

  const handleOpenLiveProductForm = useCallback(
    (row: LiveProductColumns) => {
      const values = {
        ...row,
        priceRange:
          row.priceType === priceTypeInvertMap.一口价
            ? undefined
            : row.priceType === priceTypeInvertMap.价格区间
            ? [row.price, row.price2]
            : [row.price2, row.price],
      };

      if (values.price2 === 0) {
        values.price2 = (undefined as unknown) as number;
      }

      openLiveProductForm(values);
    },
    [openLiveProductForm],
  );

  const wrapperRequestThenReload = (result: typeof Promise.prototype) => {
    result.then(() => {
      actionsRef.current.reload();
    });
  };

  return (
    <>
      {ModalFormElement}

      <GeneralTableLayout<LiveProductColumns>
        request={(params) => getLiveProducts({ ...params, auditStatus })}
        getActions={actionsRef}
        defaultAddOperationButtonListProps={{
          text: '选择商品',
          render: (props) => (
            <ChooseProduct
              key="ChooseProduct"
              children={props.children}
              onSuccess={() => {
                if (auditStatus === productAuditStatusInvertMap.审核中) {
                  actionsRef.current.reload();
                }
              }}
            />
          ),
        }}
        tableProps={{
          bordered: false,
          rowKey: 'goodsId',
        }}
        columns={[
          {
            title: '首图封面',
            width: 132,
            dataIndex: 'coverImgUrl',
            image: {
              style: {
                width: 100,
                height: 100,
              },
            },
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            ellipsisProps: true,
          },
          {
            title: '商品价格',
            align: 'right',
            render: (_, row) =>
              ({
                [priceTypeInvertMap.一口价]: <MoneyText>{row.price}</MoneyText>,
                [priceTypeInvertMap.价格区间]: (
                  <span>
                    <MoneyText>{row.price}</MoneyText> ~ <MoneyText>{row.price2}</MoneyText>
                  </span>
                ),
                [priceTypeInvertMap.显示折扣价]: (
                  <span>
                    {[
                      ['市场价', row.price],
                      ['现价', row.price2],
                    ].map((item) => (
                      <p key={item[0]}>
                        <span
                          style={{
                            width: 45,
                            textAlign: 'right',
                            marginRight: 6,
                            display: 'inline-block',
                          }}
                        >
                          {item[0]}
                        </span>
                        <MoneyText>{item[1]}</MoneyText>
                      </p>
                    ))}
                  </span>
                ),
              }[row.priceType]),
          },
          {
            title: '商品链接',
            dataIndex: 'url',
            width: 200,
          },
          {
            title: '上架状态',
            dataIndex: 'auditStatus',
            width: 100,
            render: (t) => productAuditStatus[t],
          },
          {
            title: '操作',
            dataIndex: 'id',
            align: 'right',
            width: 220,
            buttonListProps: {
              align: 'right',
              list: ({ row }) => {
                return [
                  {
                    text: '提交审核',
                    visible: canSubmitReview,
                    modalProps: {
                      title: '确定提交审核吗？',
                      onOk: () =>
                        liveProductAudit(row.goodsId).then(() => {
                          upperAndLowerShelves$.emit([
                            productAuditStatusInvertMap.审核失败,
                            productAuditStatusInvertMap.审核中,
                            productAuditStatusInvertMap.未审核,
                          ]);
                        }),
                    },
                  },
                  {
                    text: '撤回审核',
                    visible: underReview,
                    modalProps: {
                      title: '确定撤回审核吗？',
                      onOk: () =>
                        resetLiveProductAudit({
                          goodsId: row.goodsId,
                          auditId: row.auditId,
                        }).then(() => {
                          upperAndLowerShelves$.emit([
                            productAuditStatusInvertMap.未审核,
                            productAuditStatusInvertMap.审核中,
                          ]);
                        }),
                    },
                  },
                  {
                    text: '修改价格',
                    visible: row.auditStatus === productAuditStatusInvertMap.审核通过,
                    onClick: () => handleOpenLiveProductForm(row),
                  },
                  {
                    text: '编辑',
                    visible: canSubmitReview,
                    onClick: () => handleOpenLiveProductForm(row),
                  },
                  {
                    text: '删除',
                    // 非审核中，都可以删除
                    visible: !underReview,
                    modalProps: {
                      title: '确定删除该商品吗？',
                      onOk: () => wrapperRequestThenReload(deleteLiveProduct(row.goodsId)),
                    },
                  },
                ];
              },
            },
          },
        ]}
      />
    </>
  );
}
