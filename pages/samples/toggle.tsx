import { NextPage } from 'next';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { FiSun, FiMoon } from 'react-icons/fi';
import { ToggleButton } from 'components';
import { NextPageWithLayout } from 'pages/_app';
import { Layout } from 'components/layout';

const Toggle: NextPageWithLayout = () => {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const clsList = document.documentElement.classList;
    if (check && !clsList.contains('dark')) {
      document.documentElement.classList.add('dark');
    }

    if (!check && clsList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    }
  }, [check]);

  return (
    <div className='p-2 space-x-2 dark:bg-zinc-800 dark:text-white'>
      <ToggleButton
        onClick={() => {
          setCheck(!check);
        }}
        checked={check}
      />

      <ToggleButton
        checked={check}
        outlineColor='outline-amber-600'
        checkedOutlineColor='outline-violet-600'
      />

      <ToggleButton
        checked={check}
        className='border-purple-200 '
        shadowColor='rgb(238, 234, 244)'
        checkedShadowColor='rgb(49, 208, 170)'
      />

      <ToggleButton
        className='border-purple-200 dark:border-zinc-800'
        leftEl={<FiSun size={24} className='text-amber-400' />}
        rightEl={<FiMoon size={24} className='text-purple-400' />}
        checked={check}
        shadowColor='rgb(189, 194, 196)'
        checkedShadowColor='rgb(102, 97, 113)'
        outlineColor='outline-amber-600'
        checkedOutlineColor='outline-violet-600'
        onClick={() => {
          setCheck(!check);
        }}
      />

      <ToggleButton
        className='w-36 font-semibold border-violet-200 bg-[#7a6eaa]'
        checked={check}
        leftEl={<span className='text-white'>V2</span>}
        rightEl={<>V1(old)</>}
        shadowColor='#eeeaf4'
        checkedShadowColor='#666171'
        spread={'1px'}
      />

      <span>checked:{check.toString()}</span>
    </div>
  );
};

Toggle.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Toggle;
