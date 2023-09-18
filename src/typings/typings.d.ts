declare module '*.svg';
declare module '*.tiff';

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.scss' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.sass' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.less' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
