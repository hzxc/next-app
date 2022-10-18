import React, { FC, createContext, HTMLAttributes, useState } from 'react';
import { MenuItemProps } from './MenuItem';

type MenuMode = 'horizontal' | 'vertical';

interface MenuProps {
  defaultIndex?: string;
  mode?: MenuMode;
  onSelect?: (selectedIndex: string) => void;
  defaultOpenSubMenus?: string[];
}

type Props = MenuProps & HTMLAttributes<HTMLUListElement>;

const defaultInitialProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical',
  defaultOpenSubMenus: [],
};

interface IMenuContext {
  index: string;
  onSelect?: (selectedIndex: string) => void;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<IMenuContext>({ index: '0' });

const verticalClass: string =
  'flex flex-col flex-nowrap items-start justify-start gap-0.5';
const horizontalClass: string =
  'flex flex-row flex-nowrap items-center justify-start gap-0.5';

export const Menu: FC<Props> = (props) => {
  const {
    className,
    mode,
    children,
    defaultIndex,
    onSelect,
    defaultOpenSubMenus,
  } = {
    ...defaultInitialProps,
    ...props,
  };
  const [currentActive, setActive] = useState(defaultIndex);
  const mergeClass = `${
    mode === 'horizontal' ? horizontalClass : verticalClass
  }${className ? ' ' + className : ''}`;
  const handleClick = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus,
  };

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<
        MenuItemProps & { className: string }
      >;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return React.cloneElement(childElement, {
          index: index.toString(),
          className: `${
            childElement.props.className ? childElement.props.className : ''
          } rounded-2xl`,
        });
      } else {
        throw new Error('Menu has a child which is not a MenuItem component');
      }
    });
  };

  return (
    <ul className={mergeClass}>
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};
