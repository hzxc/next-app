import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Image from 'next/image';

interface IconButtonProps {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftSrc?: string;
  rightSrc?: string;
  gap?: string;
  col?: boolean;
  leftSize?: string;
  rightSize?: string;
  exClassName?: 'default' | 'panEx' | 'panMb';
  customStyle?: React.CSSProperties;
}

const defaultInitialProps: IconButtonProps = {
  exClassName: 'default',
  leftIcon: undefined,
  rightIcon: undefined,
  leftSrc: undefined,
  rightSrc: undefined,
  gap: 'gap-1',
  col: false,
  leftSize: '24px',
  rightSize: '24px',
};

type Props = IconButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
const defaultClass: string = 'align-baseline';
const PanExClass: string =
  'align-middle active:translate-y-px align-middle rounded-full p-[6px] text-cyan-500 [&>div>span:first-child]:block [&>div>span:last-child]:hidden shadow-sm shadow-gray-700 active:shadow-none bg-[#eeeaf4] [&>div>span:last-child]:hover:block [&>div>span:first-child]:hover:hidden hover:bg-[#6edbe3]';
const PanMenuButtonClass: string =
  'align-middle rounded-full font-semibold hover:opacity-70 h-8 text-[#280d5f] bg-[#eff4f5]';
export const IconButton: React.FC<Props> = (props) => {
  const {
    className,
    children,
    gap,
    leftIcon,
    rightIcon,
    leftSrc,
    rightSrc,
    leftSize,
    rightSize,
    col,
    exClassName,
    style,
    ...restProps
  } = {
    ...defaultInitialProps,
    ...props,
  };
  const mergeClass = `${exClassName === 'default' ? defaultClass : ''} ${
    exClassName === 'panEx' ? PanExClass : ''
  } ${exClassName === 'panMb' ? PanMenuButtonClass : ''} ${
    className ? ' ' + className : ''
  }`;

  return (
    <button className={mergeClass} {...restProps} style={style ? style : {}}>
      <div
        className={`flex flex-nowrap ${col ? 'flex-col' : ''} ${
          gap ? gap : ''
        } items-center justify-between`}
      >
        {leftSrc ? (
          <span
            className='relative'
            style={{ width: leftSize, height: leftSize }}
          >
            <Image alt='' src={leftSrc} layout='fill' />
          </span>
        ) : undefined}
        {leftIcon ? (
          <span
            className='relative [&>svg]:w-full [&>svg]:h-full'
            style={{ width: leftSize, height: leftSize }}
          >
            {leftIcon}
          </span>
        ) : undefined}
        {children ? <span>{children}</span> : undefined}
        {rightIcon ? (
          <span
            className='relative [&>svg]:w-full [&>svg]:h-full'
            style={{ width: rightSize, height: rightSize }}
          >
            {rightIcon}
          </span>
        ) : undefined}

        {rightSrc ? (
          <span
            className='relative'
            style={{ width: rightSize, height: rightSize }}
          >
            <Image alt='' src={rightSrc} layout='fill' />
          </span>
        ) : undefined}
      </div>
    </button>
  );
};
