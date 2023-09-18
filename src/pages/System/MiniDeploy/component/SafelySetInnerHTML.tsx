import type { ReactHTML } from 'react';
import React from 'react';

interface ISafelySetInnerHTMLProps extends React.HTMLAttributes<any> {
  type?: keyof ReactHTML;
  html: string;
}

export const SafelySetInnerHTML = ({ type = 'span', html, ...last }: ISafelySetInnerHTMLProps) =>
  React.createElement(type, {
    dangerouslySetInnerHTML: {
      __html: html,
    },
    ...last,
  });
