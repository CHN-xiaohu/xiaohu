/* eslint-disable @typescript-eslint/consistent-type-definitions */
export * from './SchemaForm';
export * from './Utils';
export * from './components/Forms';
export * from './connect';
export * from './Linkages';

declare global {
  /*
  +---------------------------------------------------------------------------------------------------
  | 拓展 Formily 封装的 Schema 类型
  +---------------------------------------------------------------------------------------------------
  */

  interface GlobalFormSchemaComponentType {
    //
  }

  /*
  +---------------------------------------------------------------------------------------------------
  | 拓展 Formily 封装的 rules 类型
  +---------------------------------------------------------------------------------------------------
  */
  interface GlobalFormSchemaRules {
    //
  }

  /*
  +---------------------------------------------------------------------------------------------------
  | 拓展 Formily 封装的 x-linkages 类型
  +---------------------------------------------------------------------------------------------------
  */
  interface GlobalFormSchemaLinkages {
    //
  }
}
