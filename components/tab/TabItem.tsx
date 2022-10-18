import { LiHTMLAttributes, FC, useContext } from 'react';
import { TabContext } from './Tab';

export interface TabItemProps {
  index?: string;
  disabled?: boolean;
}

type Props = TabItemProps & LiHTMLAttributes<HTMLLIElement>;
const defaultClass: string =
  'cursor-pointer hover:bg-[#eff4f5] border-b-4 border-b-transparent [&>*:first-child]:px-1 [&>*:first-child]:pt-4 pb-[6px]';
const activeClass: string = 'font-semibold text-violet-600 !border-b-[#1fc7d4]';

const TabItem: FC<Props> = (props) => {
  const { index, disabled, className, children } = props;
  const context = useContext(TabContext);

  const mergeClass = `${defaultClass}${className ? ' ' + className : ''}${
    context.index === index ? ' ' + activeClass : ''
  }`;

  const handleClick = () => {
    if (context.onSelect && !disabled && typeof index === 'string') {
      context.onSelect(index);
    }
  };

  return (
    <li
      className={mergeClass}
      style={{ lineHeight: '100%' }}
      onClick={handleClick}
    >
      {/* {typeof children === 'string' ? <div>{children}</div> : children} */}
      <div>{children}</div>
    </li>
  );
};

TabItem.displayName = 'TabItem';
export { TabItem };
