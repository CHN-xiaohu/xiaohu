// @ts-nocheck
import { IRoute } from '@umijs/core';
import { AnyAction } from 'redux';
import React from 'react';
import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import { match } from 'react-router-dom';
import { Location, LocationState, History } from 'history';

export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/models/App';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/models/Settings';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/models/User';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/ApplicationCenter/Salesman/models/Salesman';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/Merchant/models/Merchant';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/models/coupon';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DisplayCategory/models/DisplayCategory';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgram/Topic/models/topic';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/News/models/News';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/PcColumn/models/PcColumn';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Category';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Distribution';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Product';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Supply';
export * from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Programa/models/programa';

export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

export type ImmerReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => void;

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap,
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch<P = any, C = (payload: P) => void> = (action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export type Subscription = (api: SubscriptionAPI, done: Function) => void | Function;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    [key: string]: any;
  };
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
  location: Location<S> & { query: T };
  history: History;
  route: IRoute;
}

export type RequiredConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
  > = Required<ConnectProps<P, S, T>>

/**
 * @type T: React props
 * @type U: match props types
 */
export type ConnectRC<
  T = {},
  U = {},
  S = {},
  Q = {}
> = React.ForwardRefRenderFunction<any, T & RequiredConnectProps<U, S, Q>>;

