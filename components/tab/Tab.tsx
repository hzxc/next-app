import React, { FC, createContext, HTMLAttributes, useState } from 'react';
import { TabItemProps } from './TabItem';

interface TabProps {
  defaultIndex?: string;
  onSelect?: (selectedIndex: string) => void;
}

type Props = TabProps & HTMLAttributes<HTMLUListElement>;

const defaultInitialProps: TabProps = {
  defaultIndex: '0',
};

interface ITabContext {
  index: string;
  onSelect?: (selectedIndex: string) => void;
}

export const TabContext = createContext<ITabContext>({ index: '0' });

const defaultClass: string =
  'flex flex-row flex-nowrap items-stretch justify-start gap-5';

export const Tab: FC<Props> = (props) => {
  const { className, children, defaultIndex, onSelect } = {
    ...defaultInitialProps,
    ...props,
  };
  const [currentActive, setActive] = useState(defaultIndex);
  const mergeClass = `${defaultClass}${className ? ' ' + className : ''}`;

  const handleClick = (index: string) => {
    setActive(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  const passedContext: ITabContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
  };

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement =
        child as React.FunctionComponentElement<TabItemProps>;
      const { displayName } = childElement.type;
      if (displayName === 'TabItem') {
        return React.cloneElement(childElement, {
          index: index.toString(),
        });
      } else {
        throw new Error('Tab has a child which is not a TabItem component');
      }
    });
  };

  return (
    <ul className={mergeClass}>
      <TabContext.Provider value={passedContext}>
        {renderChildren()}
      </TabContext.Provider>
    </ul>
  );
};
