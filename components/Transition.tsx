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
}

export const Transition: React.FC<TransitionProps> = (props) => {
  const nodeRef = useRef(null);
  const { visible, timeout, classNames, children, ...restProps } = props;
  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={visible}
      timeout={timeout}
      classNames={classNames}
      {...restProps}
    >
      <div ref={nodeRef}>{children}</div>
    </CSSTransition>
  );
};
Transition.defaultProps = {
  visible: false,
  unmountOnExit: true,
  classNames: 'zoom-in-left',
};
