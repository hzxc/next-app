import React, { ButtonHTMLAttributes } from 'react';

const defaultClass: string =
  'px-4 py-1 text-white	bg-[#1fc7d4] font-base font-semibold rounded-2xl pan-button-shadow hover:opacity-60 active:translate-y-px active:shadow-none disabled:bg-[e9eaeb]';

export const PanButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  const { className, children, ...restProps } = props;
  const mergeClass = `${defaultClass}${className ? ' ' + className : ''}`;
  return (
    <button
      style={{ boxShadow: 'rgb(14 14 44 / 40%) 0 -1px 0 0 inset' }}
      className={mergeClass}
      {...restProps}
    >
      {children}
    </button>
  );
};
