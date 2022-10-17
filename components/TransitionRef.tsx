import React, { HTMLAttributes, ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

type AnimationName =
  | 'zoom-in-top'
  | 'zoom-in-left'
  | 'zoom-in-bottom'
  | 'zoom-in-right'
  | 'zoom-in-center';

interface TransitionProps {
  visible?: boolean;
  unmountOnExit?: boolean;
  classNames?: string;
  children: ReactNode;
  timeout: number;
  nodeRef: any;
}

export const TransitionRef: React.FC<TransitionProps> = (props) => {
  const { visible, timeout, classNames, children, ...restProps } = props;
  return (
    <CSSTransition
      in={visible}
      timeout={timeout}
      classNames={classNames}
      {...restProps}
    >
      {children}
    </CSSTransition>
  );
};
TransitionRef.defaultProps = {
  visible: false,
  unmountOnExit: true,
  classNames: 'zoom-in-center',
};
