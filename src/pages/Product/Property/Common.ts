import { getLength } from '@/utils';
import type { TXLinkages } from '@/components/Business/Formily';

export const nameSchema = (fieldName: string, maxLen: number) => ({
  title: fieldName,
  type: 'string',
  'x-component-props': {
    placeholder: `请输入${fieldName}`,
    suffix: `0/${maxLen}`,
  },
  'x-rules': [
    { required: true, message: `请输入${fieldName}` },
    { notEmpty: `${fieldName}不能为单纯的空字符` },
    { max: maxLen, message: `长度不能大于 ${maxLen} 个字符` },
  ],
  'x-linkages': [
    {
      type: 'value:effect',
      effect: ({ setFieldState }) => {
        setFieldState('name', (fieldState) => {
          (fieldState as any).props['x-component-props'].suffix = `${getLength(
            fieldState.value,
          )}/${maxLen}`;
        });
      },
    } as TXLinkages[0],
  ],
});
