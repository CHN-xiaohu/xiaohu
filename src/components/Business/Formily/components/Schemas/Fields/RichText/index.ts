import { mapStyledProps, connect, registerFormField } from '@formily/antd';

import { dynamic } from 'umi';

// import { BraftEditorWrapper } from '@/components/Library/RichText/BraftEditor';

const CKEditor = dynamic({
  loader: () =>
    import(
      /* webpackChunkName: 'schema-field-richText' */ '@/components/Library/RichText/CKEditor'
    ),
});

declare global {
  interface GlobalFormSchemaComponentType {
    braftEditor: string;
    ckEditor: string;
  }
}

// registerFormField(
//   'braftEditor',
//   connect({
//     getProps: mapStyledProps,
//   })(BraftEditorWrapper),
// )

registerFormField(
  'ckEditor',
  connect({
    getProps: mapStyledProps,
  })(CKEditor),
);

// fix https://github.com/umijs/umi/issues/6766 Module parse failed: Top-Level-Await 报错
export {};
