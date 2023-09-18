/**
 * @ref https://github.com/ant-design/ant-design-pro-layout/blob/master/src/typings.ts
 */
export type RouteItem = {
  authority?: string[] | string;
  children?: RouteItem[];
  hideChildrenInMenu?: boolean;
  hideInMenu?: boolean;
  icon?: string;
  locale?: string;
  name?: string;
  title?: string;
  edit_title?: string;
  redirectUrl?: string;
  // 显示完整的面包屑
  showFullBreadcrumb?: boolean;
  // 是否显示链接
  notShowLink?: boolean;
  hideBreadcrumb?: boolean;
  // 虚拟的上级路由路径，用于绑定上下级关系
  virtualParentRoutePath?: string;
  path: string;

  component?: string;
  exact?: boolean;
  path?: string;
  routes?: IRoute[];
  wrappers?: string[];
  title?: string;
  __toMerge?: boolean;
  __isDynamic?: boolean;

  [key: string]: any;
};

export type Route = {
  routes?: Route[];
} & RouteItem;

export type ValidationRule = {
  /** validation error message */
  message?: string;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'array'
    | 'object'
    | 'enum'
    | 'date'
    | 'url'
    | 'hex'
    | 'email';
  /** indicates whether field is required */
  required?: boolean;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** validate the exact length of a field */
  len?: number;
  /** validate the min length of a field */
  min?: number;
  /** validate the max length of a field */
  max?: number;
  /** validate the value from a list of possible values */
  enum?: string | string[];
  /** validate from a regular expression */
  pattern?: RegExp;
  /** transform a value before validation */
  transform?: (value: any) => any;
  /** custom validate function (Note: callback must be called) */
  validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;
};

export type ValidationRules = Record<string, ValidationRule | ValidationRule[]>;

export type ValidatorLang = 'cn' | 'en';

export type ValidateCallback = (errors: any[], fields: any[]) => void;

export type ValidateOptions = {
  first?: boolean;
  firstFields?: boolean | string[];
};

export type AsyncValidator = {
  validate: ((source: object, callbak?: ValidateCallback) => Promise<any>) &
    ((source: object, options: ValidateOptions, callbak?: ValidateCallback) => Promise<any> | any);
};
