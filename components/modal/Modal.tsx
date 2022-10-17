import { TransitionRef } from 'components';
import { Portal } from 'components/portal';
import { ReactNode, useEffect, useRef } from 'react';

export const Modal: React.FC<{ visible: boolean; children: ReactNode }> = ({
  visible,
  children,
}) => {
  const nodeRef = useRef(null);

  const ModalDom = (
    <div ref={nodeRef} className='fixed top-0 left-0 right-0 bottom-0 z-50'>
      {children}
    </div>
  );
  return (
    <TransitionRef visible={visible} timeout={300} nodeRef={nodeRef} classNames='fade-modal'>
      <Portal>{ModalDom}</Portal>
    </TransitionRef>
  );
};
