import { useCallback } from 'react';
import { useImmer } from 'use-immer';
import type { IFormAsyncActions } from '@formily/antd';
import { FormStep } from '@formily/antd-components';
import type { TModelNamespace } from '@/pages/Product/index.d';

import type { ButtonListProps } from '@/components/Library/ButtonList';

type Props = {
  formActions: IFormAsyncActions;
  buttonList?: (ButtonListProps['list'][0] & { key: string })[];
  modelNamespace: TModelNamespace;
};

type TButtonListVisibleTexts = Record<string, string>;

export const useStepButtonList = ({ formActions, buttonList, modelNamespace }: Props) => {
  const [state, setState] = useImmer({
    buttonList:
      buttonList ||
      ([
        {
          text: '上一步',
          key: 'prev',
          type: 'default',
          onClick: () => {
            formActions.dispatch!(FormStep.ON_FORM_STEP_PREVIOUS);
          },
        },
        {
          text: '下一步',
          key: 'next',
          type: 'primary',
          onClick: () => {
            formActions.dispatch!(FormStep.ON_FORM_STEP_NEXT);
          },
        },
        {
          text: '提交商品信息',
          key: 'submit',
          type: 'primary',
          onClick: () => formActions.submit(),
        },
      ] as (ButtonListProps['list'][0] & { key: string })[]),
  });

  const setButtonListVisible = useCallback((texts: TButtonListVisibleTexts | string[]) => {
    setState((draft) => {
      const keys = Array.isArray(texts) ? texts : Object.keys(texts);

      draft.buttonList.forEach((item) => {
        item.visible = keys.includes(item.key);

        if (!Array.isArray(texts) && texts[item.key]) {
          item.text = texts[item.key];
        }
      });
    });
  }, []);

  // 根据 form step 的变动，做相应的 button 变动
  const switchStepButtonListByFormStepChange = useCallback(
    ({
      currentStep,
      stepList,
      formatter,
    }: {
      currentStep: number;
      stepList: { title: string }[];
      formatter?: (v: TButtonListVisibleTexts) => TButtonListVisibleTexts;
    }) => {
      const prev = `上一步，${stepList[currentStep - 1]?.title || ''}`;
      const next = (idx: number) => `下一步，${stepList[idx]?.title || ''}`;

      // 编辑时，默认将提交按钮给显示出来
      let buttonListValues = {} as TButtonListVisibleTexts;

      // eslint-disable-next-line default-case
      switch (currentStep) {
        case 0:
          buttonListValues = { next: next(currentStep + 1) };
          break;
        case 1:
          buttonListValues = { next: next(currentStep) };
          break;
        case 2:
          buttonListValues = { prev, submit: '' };
          break;
      }

      if (!Object.keys(buttonListValues).length) {
        return;
      }

      // 回到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      requestAnimationFrame(() => {
        setButtonListVisible(formatter ? formatter(buttonListValues) : buttonListValues);
      });

      window.$fastDispatch((model) => model[modelNamespace].updateState, { currentStep });
    },
    [],
  );

  return {
    stepButtonList: state.buttonList,
    setButtonListVisible,
    switchStepButtonListByFormStepChange,
  };
};
