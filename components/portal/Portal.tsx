import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Portal = ({ children }: { children: ReactNode }) => {
  const container = useRef(document.createElement('div')).current;
  useEffect(() => {
    container.setAttribute('role', 'portal');
    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return createPortal(children, container);
};
