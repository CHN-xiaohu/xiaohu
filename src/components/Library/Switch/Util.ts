/* eslint-disable prettier/prettier */
export const returnTypeValue = (value: any, checked: boolean) =>
  typeof value === 'boolean'
    ? checked
    : typeof value === 'string'
    ? String(checked)
    : Number(checked);
