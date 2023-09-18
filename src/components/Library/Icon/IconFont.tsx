type BaseIconProps = {
  name: string;
  className?: string;
};

export const IconFont = ({ name, className }: BaseIconProps) => (
  <svg className={className} aria-hidden="true">
    <use xlinkHref={`#${name}`} />
  </svg>
);
