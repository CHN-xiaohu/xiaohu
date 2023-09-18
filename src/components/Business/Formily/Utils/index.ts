import type { IFormActions, IFormGraph, IFormAsyncActions } from '@formily/antd';
import { isFn, hasOwnProperty, isStr } from '@/utils';

type TFormActions = IFormActions | IFormAsyncActions;

type ISelect = {
  formActions: IFormActions | IFormAsyncActions | IFormGraph;
  matchPath: string;
  matchCondition?: (graph: string, fieldState: IFormGraph[0]) => boolean;
  ignoreCondition?: (graph: string, fieldState: IFormGraph[0]) => boolean;
  callback?: (graph: string, fieldState: IFormGraph[0]) => void;
};

// TODO: 后面可以匹配利用 cool-path 原生的能力支持
export const selectFieldFormFormGraph = ({
  callback,
  matchPath,
  formActions,
  matchCondition,
  ignoreCondition,
}: ISelect) => {
  const formGraphs = hasOwnProperty(formActions, 'getFormGraph')
    ? (formActions as IFormActions).getFormGraph()
    : formActions;

  const formGraphKeys = Object.keys(formGraphs);

  for (let index = 0; index < formGraphKeys.length; index += 1) {
    const graph = String(formGraphKeys[index]);

    if (graph.indexOf(matchPath) === 0) {
      if (isFn(matchCondition) && !matchCondition(graph, formGraphs[graph])) {
        continue;
      }

      if (isFn(ignoreCondition) && ignoreCondition(graph, formGraphs[graph])) {
        continue;
      }

      callback?.(graph, formGraphs[graph]);
    }
  }
};

export const resetFieldValueByFormGraph = ({
  formActions,
  matchPath,
}: {
  formActions: TFormActions;
  matchPath: ISelect['matchPath'];
}) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve) => {
    const formGraphs = await formActions.getFormGraph();

    formActions.hostUpdate(() => {
      selectFieldFormFormGraph({
        formActions: formGraphs,
        matchPath,
        callback: (graph) => {
          formActions.setFieldState(graph, (fieldState) => {
            fieldState.value = undefined;
            fieldState.initialValue = undefined;
            fieldState.visibleCacheValue = undefined;
            // fieldState.errors = [];
            // fieldState.ruleErrors = [];
          });
        },
      });
    });

    resolve();
  });

export const resetFieldValue = ({
  formActions,
  matchPath,
}: {
  formActions: TFormActions;
  matchPath: ISelect['matchPath'] | string[];
}) => {
  const fieldPaths = ([] as string[]).concat(isStr(matchPath) ? [matchPath] : matchPath);

  for (let index = 0; index < fieldPaths.length; index += 1) {
    const fieldPath = fieldPaths[index];

    // todo: formily 在使用通配符的时候，是有 bug 的，会不断的进行监听，然后重置
    formActions.setFieldState(fieldPath, (fieldState) => {
      fieldState.value = undefined;
      fieldState.values = [];
      fieldState.initialValue = undefined;
      fieldState.visibleCacheValue = undefined;
    });
  }
};
