import React, { ButtonHTMLAttributes } from 'react';

const defaultClass: string =
  'px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2';

export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  const { className, children, ...restProps } = props;
  const mergeClass = `${defaultClass}${className ? ' ' + className : ''}`;

  return (
    <button className={mergeClass} {...restProps}>
      {children}
    </button>
  );
};
