import { Transition } from 'components';
import React, { FunctionComponentElement, ReactNode } from 'react';
import { LiHTMLAttributes, useContext, useState } from 'react';

import { MenuContext } from './Menu';
import { MenuItemProps } from './MenuItem';

export interface SubMenuProps {
  index?: string;
  subTitle: string | ReactNode;
}

type Props = SubMenuProps & LiHTMLAttributes<HTMLLIElement>;
const defaultClass: string = 'relative';
export const SubMenu: React.FC<Props> = (props) => {
  const { index, subTitle, children, className } = props;
  const context = useContext(MenuContext);
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>;
  const isOpend =
    index && context.mode === 'vertical'
      ? openedSubMenus.includes(index)
      : false;
  const [menuOpen, setOpen] = useState(isOpend);

  const mergeClass = `${defaultClass}${className ? ' ' + className : ''}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!menuOpen);
  };

  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 200);
  };

  const clickEvents =
    context.mode === 'vertical'
      ? {
          onClick: handleClick,
        }
      : {};
  const hoverEvents =
    context.mode !== 'vertical'
      ? {
          onMouseEnter: (e: React.MouseEvent) => {
            handleMouse(e, true);
          },
          onMouseLeave: (e: React.MouseEvent) => {
            handleMouse(e, false);
          },
        }
      : {};

  const renderChildren = () => {
    const childrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<
        MenuItemProps & { className: string }
      >;
      if (childElement.type.displayName === 'MenuItem') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`,
          className: `${
            childElement.props.className ? childElement.props.className : ''
          } w-64 first:rounded-t-md last:rounded-b-md`,
        });
      } else {
        console.error(
          'Warning: SubMenu has a child which is not a MenuItem component'
        );
      }
    });
    return (
      <Transition visible={menuOpen} timeout={300} classNames='zoom-in-top'>
        <ul
          className={`${
            context.mode === 'horizontal' ? 'absolute' : ''
          } flex flex-col flex-nowrap items-start justify-start border py-1 rounded-xl bg-white`}
        >
          {childrenComponent}
        </ul>
      </Transition>
    );
  };
  return (
    <li key={index} className={mergeClass} {...hoverEvents}>
      <div
        className={`flex items-center cursor-pointer rounded-2xl my-1 hover:bg-zinc-100 px-4 py-4${
          context.index.startsWith(index + '-')
            ? ' font-semibold text-[#7645d9]'
            : ''
        }`}
        style={{ lineHeight: '100%' }}
        {...clickEvents}
      >
        <span>{subTitle}</span>
      </div>

      {renderChildren()}
    </li>
  );
};

SubMenu.displayName = 'SubMenu';
