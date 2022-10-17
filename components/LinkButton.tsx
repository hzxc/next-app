import React, { AnchorHTMLAttributes } from 'react';

const defaultClass: string =
  'text-cyan-500 text-base hover:opacity-70 hover:underline';

const defaultProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

export const LinkButton: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (
  props
) => {
  const { className, children, ...restProps } = { ...defaultProps, ...props };
  const mergeClass = `${defaultClass}${className ? ' ' + className : ''}`;

  return (
    <a className={mergeClass} {...restProps}>
      {children}
    </a>
  );
};
