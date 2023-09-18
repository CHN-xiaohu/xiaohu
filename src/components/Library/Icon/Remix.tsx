type BaseIconProps = {
  prefix?: string;
  name: string;
  sizeClass?: string;
};

export const RemixIcon = ({ name, prefix = 'remixicon-', sizeClass = '' }: BaseIconProps) => (
  <i className={`${prefix}${name} ${sizeClass}`} />
);
