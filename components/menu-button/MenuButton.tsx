import { Transition } from 'components/Transition';
import React, {
  createContext,
  FunctionComponentElement,
  HTMLAttributes,
  ReactNode,
  useState,
} from 'react';
import { MenuButtonItemProps } from './MenuButtonItem';

interface MenuButtonProps {
  navBtn: ReactNode;
  title?: string;
  defaultIndex?: string;
  onSelect?: (selectedIndex: string) => void;
  pos?: string;
}

const defaultInitialProps: MenuButtonProps = {
  pos: 'left-0',
  defaultIndex: '0',
  navBtn: <></>,
};

interface IMenuButtonContext {
  index: string;
  onSelect?: (selectedIndex: string) => void;
}

export const MenuButtonContext = createContext<IMenuButtonContext>({
  index: '0',
});

type Props = MenuButtonProps & HTMLAttributes<HTMLDivElement>;
const defaultClass: string = 'relative z-40';

export const MenuButton: React.FC<Props> = (props) => {
  const {
    className,
    children,
    navBtn,
    defaultIndex,
    title,
    pos,
    onSelect,
    ...restProps
  } = {
    ...defaultInitialProps,
    ...props,
  };
  const mergeClass = `${defaultClass} ${className ? ' ' + className : ''}`;

  const [currentActive, setActive] = useState(defaultIndex);
  const [menuOpen, setOpen] = useState(false);

  const handleClick = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: IMenuButtonContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
  };

  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setOpen(toggle);
    }, 200);
  };

  const hoverEvents = {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouse(e, true);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouse(e, false);
    },
  };
  const renderChildren = () => {
    const childrenComponent = React.Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<
        MenuButtonItemProps & { className: string }
      >;
      if (childElement.type.displayName === 'MenuButtonItem') {
        return React.cloneElement(childElement, {
          index: index.toString(),
          className: `${childElement.props.className} w-64 first:rounded-t-md last:rounded-b-md`,
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
          className={`absolute ${pos} flex flex-col flex-nowrap items-start justify-start border py-1 rounded-xl bg-white`}
        >
          {title ? (
            <li className='border-b w-64 h-11 p-[14px]'>{title}</li>
          ) : undefined}
          {childrenComponent}
        </ul>
      </Transition>
    );
  };

  return (
    <div
      className={mergeClass}
      style={{ lineHeight: '100%' }}
      {...restProps}
      {...hoverEvents}
    >
      {navBtn}
      <MenuButtonContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuButtonContext.Provider>
    </div>
  );
};
