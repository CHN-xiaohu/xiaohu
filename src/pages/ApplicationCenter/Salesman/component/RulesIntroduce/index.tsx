import { useEffect } from 'react';
import { useImmer } from 'use-immer';

import SalesmanRule from './SalesmanRule';
import InviteRule from './InviteRule';
import OrderRule from './OrderRule';

import { getSalesmanRulesexPlain } from '../../Api';

export default function RulesIntroduce() {
  const [state, setState] = useImmer({
    rulesInitialValues: {},
    inviteInitialValues: {},
    orderInitialValues: {},
  });

  const handleGetSalesmanRulesexPlain = () => {
    getSalesmanRulesexPlain().then((res) => {
      res.data.forEach((items: any) => {
        items?.content.forEach((allItem: any, index: number) => {
          allItem.id = `${index + 1}`;
        });
        if (items.type === 'SALESMAN_RULE') {
          setState((draft) => {
            draft.rulesInitialValues = { ...items };
          });
        } else if (items.type === 'INVITATION_SALESMAN_RULE') {
          setState((draft) => {
            draft.inviteInitialValues = items;
          });
        } else if (items.type === 'ORDER_SALESMAN_RULE') {
          setState((draft) => {
            draft.orderInitialValues = items;
          });
        }
      });
    });
  };

  useEffect(() => {
    handleGetSalesmanRulesexPlain();
  }, []);

  const borderStyle = {
    // border: "solid 1px #f0f0f0",
    padding: '20px',
    marginBottom: '20px',
  };

  return (
    <>
      <div style={borderStyle}>
        <SalesmanRule
          handleCreateAdSuccess={() => handleGetSalesmanRulesexPlain()}
          detail={state.rulesInitialValues}
        />
      </div>
      <div style={borderStyle}>
        <InviteRule
          handleCreateAdSuccess={() => handleGetSalesmanRulesexPlain()}
          detail={state.inviteInitialValues}
        />
      </div>
      <div style={borderStyle}>
        <OrderRule
          handleCreateAdSuccess={() => handleGetSalesmanRulesexPlain()}
          detail={state.orderInitialValues}
        />
      </div>
    </>
  );
}
