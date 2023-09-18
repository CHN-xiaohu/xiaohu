import { createFormActions } from '@formily/antd';

import { NormalForm } from '@/components/Business/Formily';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { saveOrUpdateSalesmanExtensionStyle } from '../../Api';
import { useFields } from '../useFields';

import { modelNamespace } from '../../Constants';

const formActions = createFormActions();

type Props = {
  handleCreateAdSuccess: () => void;
  detail: {};
};

const RecruitPosters = ({ handleCreateAdSuccess }: Props) => {
  const { posterList } = useStoreState(modelNamespace as 'salesman');

  const handlePosterSubmit = () => {
    const paramsList = [] as any;
    posterList.forEach((items) => {
      if (items.isChecked) {
        items.backgroundImg = items.backgroundImg ? items.backgroundImg : items.originnalImg;
        paramsList.push(items);
      }
    });
    saveOrUpdateSalesmanExtensionStyle({ styleJson: paramsList }).then(handleCreateAdSuccess);
  };

  return (
    <NormalForm
      {...{
        actions: formActions,
        onSubmit: handlePosterSubmit,
        fields: { ...useFields() },
        labelCol: { span: 1 },
        wrapperCol: { span: 18 },
        schema: {
          basicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              type: 'inner',
              title: '招募海报设置',
            },
            properties: {
              title: {
                type: 'recruitPoster',
                title: '',
              },
            },
          },
          formButtonList: {
            type: 'object',
            'x-component': 'formButtonGroup',
            'x-component-props': {
              sticky: false,
            },
            properties: {
              buttonGroup: {
                type: 'submitButton',
                'x-component-props': {
                  children: '保存',
                },
              },
              cancelButton: {
                type: 'cancelButton',
                'x-component-props': {
                  children: '重置',
                  style: {
                    marginTop: '4px',
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
};

export default RecruitPosters;
