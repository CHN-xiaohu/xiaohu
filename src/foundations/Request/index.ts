/**
 * request 网络请求工具
 *
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */

import type { RequestOptionsInit } from 'umi-request';

import { BaseRequest } from './Core';

const methods = [
  'get',
  'post',
  'put',
  'delete',
  'delete',
  'patch',
  'head',
  'options',
  'rpc',
] as const;

type TMethods = typeof methods[number];
type TRequest = {
  [k in TMethods]: <T = any>(url: string, options?: RequestOptionsInit) => PromiseResponseResult<T>;
};

const RequestMethod = (method: TMethods) => (url: string, options?: RequestOptionsInit) =>
  BaseRequest[method](url, options);

const Request = {} as TRequest;

methods.forEach((method) => {
  Request[method] = RequestMethod(method as TMethods);
});

export { Request, BaseRequest };
