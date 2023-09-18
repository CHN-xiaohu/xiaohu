export const pxToNumber = (value: string | number | null) => {
  if (!value) return 0;

  const match = String(value).match(/^\d*(\.\d*)?/);

  return match ? Number(match[0]) : 0;
};

export const getStringLength = (str: string) =>
  /\u4e00-\u9fa5/.test(str) ? str.length * 2 : str.length;

/**
 * @see https://github.com/ant-design/ant-design/blob/74e0587d5b118b2e76c9885cd17302f47ca34d2c/components/typography/util.tsx#L32
 */
export function styleToString(style: CSSStyleDeclaration) {
  // There are some different behavior between Firefox & Chrome.
  // We have to handle this ourself.
  const styleNames: string[] = Array.prototype.slice.apply(style);
  return styleNames.map((name) => `${name}: ${style.getPropertyValue(name)};`).join('');
}
