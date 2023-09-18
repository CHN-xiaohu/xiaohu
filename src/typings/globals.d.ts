/*
+---------------------------------------------------------------------------------------------------
| dva 相关
+---------------------------------------------------------------------------------------------------
*/

type FullModelStates = GlobalModelState & PageModelState;

type ModelEffectsAndReducers = GlobalModelEffects &
  GlobalModelReducers &
  PageModelEffects &
  PageModelReducers;

type EffectsAndReducerAction = (module: ModelEffectsAndReducers) => string;

type DvaAnyAction<T = any> = {
  type: T;
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
};

type DvaEffectsCommandMap = {
  put: (params: { type: string; payload?: any }) => any;
  call: <V = any>(fn: Function, params?: any) => V;
  select: <V = any>(fn: (state: FullModelStates) => V) => V;
  take: Function;
  cancel: Function;
  [key: string]: any;
};

/*
+---------------------------------------------------------------------------------------------------
| 拓展 Window 全局对象
+---------------------------------------------------------------------------------------------------
*/
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Window {
  $fastDispatch: <P>(action: string | EffectsAndReducerAction, payload?: P) => Promise<any>;
  $wrapperPromise: <T = any, ERR = any>(
    promise: Promise<T>,
  ) => Promise<{ result: T; error: ERR | null }>;
  $modelEffectsAndReducers: ModelEffectsAndReducers;

  $appBaseResourceUrl: string;

  injectionGlobalDataSource: {
    name: string;
    logo: string;
    info: string;
    code?: string;
  };
}

/*
+---------------------------------------------------------------------------------------------------
| 工具辅助
+---------------------------------------------------------------------------------------------------
*/
type ExtendInterface<T> = {
  [P in keyof T]: T[P];
};

/**
 * 将传入的 effects 对象的 key 给抽取出来, 组成：
 * @example {
 *   login: string,
 *   getUserInfo: string,
 * }
 */
type GetAssignMethods<T> = {
  [K in keyof T]: string;
};

type GeneralUnionType = string | number | boolean;

/*
+---------------------------------------------------------------------------------------------------
| Api 相关
+---------------------------------------------------------------------------------------------------
*/
type ResponseResult<D = any> = {
  code: number;
  data: D;
  msg: string;
  time: string;
  total?: number;
};

type PromiseResponseResult<D = any, R = ResponseResult<D>> = Promise<R>;

type PromiseResponsePaginateResult<
  D = any,
  R = ResponseResult & { total: number }
> = PromiseResponseResult<D, R>;

type AnyObject<T = any> = Record<string, T>;

type StringOrNumber = string | number;

type LabeledValue<
  V extends StringOrNumber | undefined = StringOrNumber | undefined,
  L extends StringOrNumber = StringOrNumber
> = {
  key?: StringOrNumber;
  label: L;
  value: V;
};

// https://stackoverflow.com/questions/49285864/is-there-a-valueof-similar-to-keyof-in-typescript
type ValueOf<T> = T[keyof T];
