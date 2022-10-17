import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <div
        style={{ width: 'calc(100vw - 256px)' }}
        className='font-kanit min-h-screen bg-white'
      >
        {children}
      </div>
      <Sidebar />
    </>
  );
};
