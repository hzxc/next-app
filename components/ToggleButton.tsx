import React, { ButtonHTMLAttributes, ReactElement, useEffect, useRef, useState } from 'react';

import { RiCheckboxBlankCircleFill } from 'react-icons/Ri';
interface ToggleButtonProps {
  leftEl?: ReactElement;
  rightEl?: ReactElement;
  checked: boolean;
  spread?: 0 | '-1px' | '-2px' | '1px' | '2px' | '3px';
  shadowColor?: string;
  checkedShadowColor?: string;
  outlineColor?: string;
  checkedOutlineColor?: string;
}

const defaultInitialProps: ToggleButtonProps = {
  leftEl: <RiCheckboxBlankCircleFill opacity={0} />,
  rightEl: <RiCheckboxBlankCircleFill opacity={0} />,
  checked: false,
  spread: '2px',
  shadowColor: 'white',
  checkedShadowColor: 'white',
};

type Props = ToggleButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
const defaultClass: string = `align-middle rounded-full border transition-shadow duration-200`;

export const ToggleButton: React.FC<Props> = (props) => {
  const refLeft = useRef<any>(null);
  const refRight = useRef<any>(null);
  const [widthLeft, setWidthOn] = useState(0);
  const [widthRight, setWidthOff] = useState(0);

  useEffect(() => {
    setWidthOn(refLeft.current.offsetWidth);
    setWidthOff(refRight.current.offsetWidth);
  }, []);

  const {
    className,
    leftEl,
    rightEl,
    checked,
    spread,
    shadowColor,
    checkedShadowColor,
    outlineColor,
    checkedOutlineColor,
    ...restProps
  } = {
    ...defaultInitialProps,
    ...props,
  };
  const mergeClass = `${defaultClass} ${className ? className : 'border-gray-400 bg-gray-400'}`;

  return (
    <button
      style={{
        boxShadow: `${checked ? widthLeft + 'px' : '-' + widthRight + 'px'} 0 0 ${spread} ${
          checked ? checkedShadowColor : shadowColor
        } inset,0 0 0 ${spread} ${checked ? checkedShadowColor : shadowColor} inset`,
      }}
      className={mergeClass}
      {...restProps}
    >
      <div className='flex justify-between items-center p-px'>
        <span
          ref={refLeft}
          className={`grow rounded-full p-1 whitespace-pre delay-100 ${
            !checked && outlineColor ? 'outline ' : ''
          }outline-4 ${outlineColor} outline-offset-[-2px]`}
        >
          {leftEl}
        </span>
        <span
          ref={refRight}
          className={`grow rounded-full p-1 whitespace-pre delay-100 ${
            checked && checkedOutlineColor ? 'outline ' : ''
          }outline-4 ${checkedOutlineColor} outline-offset-[-2px]`}
        >
          {rightEl}
        </span>
      </div>
    </button>
  );
};
