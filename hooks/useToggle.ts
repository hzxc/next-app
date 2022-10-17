import { useMemo, useState } from 'react';

export const useToggle = (defaultVisible: boolean = false) => {
  const [visible, setVisible] = useState(defaultVisible);

  const { open, close, toggle } = useMemo(() => {
    return {
      open: () => setVisible(true),
      close: () => setVisible(false),
      toggle: () => setVisible((v) => !v),
    };
  }, []);

  return { visible, open, close, toggle } as const;
};
