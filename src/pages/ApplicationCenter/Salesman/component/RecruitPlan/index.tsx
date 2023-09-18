import { useState, useCallback, useEffect } from 'react';

import { Card, Radio } from 'antd';
import { useImmer } from 'use-immer';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import SalesmanRecruit from './SalesmanRecruit';

import RecruitShare from './RecruitShare';
import RecruitPosters from './RecruitPosters';

import { getRecruitSalesmanRule, getSalesmanExtension } from '../../Api';

import { modelNamespace } from '../../Constants';

export default function RecuitPlan() {
  const [roleType, setRoleType] = useState('salesman');

  const [state, setState] = useImmer({
    recruitSalesmanRule: {},
    recruitShare: {},
    recruitPoster: [],
  });

  const { posterList } = useStoreState(modelNamespace as 'salesman');

  const handleGetRecruitSalesmanRule = () => {
    getRecruitSalesmanRule().then((res) => {
      const { data } = res;
      data?.content?.forEach((salesItem: any, index: number) => {
        salesItem.id = `${index + 1}`;
      });
      setState((draft) => {
        draft.recruitSalesmanRule = { ...data };
      });
    });
  };

  const handleGetSalesmanExtension = () => {
    getSalesmanExtension().then((res) => {
      const { data } = res;
      posterList.forEach((items) => {
        data.styleJson.forEach((styleItem: any) => {
          if (items.style === styleItem.style) {
            items.isChecked = true;
            items.backgroundImg = styleItem.backgroundImg;
          }
        });
      });
      setState((draft) => {
        draft.recruitShare = { ...data };
        draft.recruitPoster = data.styleJson;
      });
      window.$fastDispatch((model) => model[modelNamespace].updateState, {
        posterList,
      });
    });
  };

  const handleCreateAdSuccess = useCallback(() => handleGetRecruitSalesmanRule(), []);

  const handleAgentSuccess = useCallback(() => handleGetSalesmanExtension(), []);

  useEffect(() => {
    console.log('roleType', roleType);
    if (roleType === 'salesman') {
      handleGetRecruitSalesmanRule();
    } else if (roleType === 'agent') {
      handleGetSalesmanExtension();
    }
  }, []);

  const handleChangeRole = (e: any) => {
    setRoleType(e.target.value);
    if (e.target.value === 'salesman') {
      handleGetRecruitSalesmanRule();
    } else if (e.target.value === 'agent') {
      handleGetSalesmanExtension();
    }
  };

  const borderStyle = {
    border: 'solid 1px #f0f0f0',
    padding: '20px',
    marginBottom: '20px',
  };

  return (
    <Card>
      <Radio.Group
        onChange={(e) => handleChangeRole(e)}
        style={{ marginBottom: '20px' }}
        defaultValue="salesman"
      >
        <Radio.Button value="salesman">业务员招募</Radio.Button>
        <Radio.Button value="agent">经销商推广</Radio.Button>
      </Radio.Group>
      {roleType === 'salesman' && (
        <SalesmanRecruit
          handleCreateAdSuccess={() => handleCreateAdSuccess()}
          detail={state.recruitSalesmanRule}
        />
      )}
      {roleType === 'agent' && (
        <div style={borderStyle}>
          <RecruitShare
            handleCreateAdSuccess={() => handleAgentSuccess()}
            detail={state.recruitShare}
          />
        </div>
      )}

      {roleType === 'agent' && (
        <div style={borderStyle}>
          <RecruitPosters
            handleCreateAdSuccess={() => handleAgentSuccess()}
            detail={state.recruitPoster}
          />
        </div>
      )}
    </Card>
  );
}
