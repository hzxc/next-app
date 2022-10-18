import { Layout, PanButton, TokenModal } from 'components/pancake';
import ChartSvg from '/public/images/pancake/chart.svg';
import SettingSvg from '/public/images/pancake/setting.svg';
import HistorySvg from '/public/images/pancake/history.svg';
import ArrowLoaddingSvg from '/public/images/pancake/arrowLoading.svg';
import PanExDown from 'public/images/pancake/panExDown.svg';
import PanExUpDown from 'public/images/pancake/PanExUpDown.svg';
import PanCopy from 'public/images/pancake/panCopy.svg';
import PanQuestionMask from 'public/images/pancake/panQuestionMark.svg';
import { useToggle } from 'hooks';
import { useTokens } from 'hooks/pancake';
import { ReactElement, useEffect } from 'react';
import { NextPageWithLayout } from 'pages/_app';
import { IconButton } from 'components';
import { useAppSelector } from 'redux/hooks';

import { selectPancake } from 'redux/pancake/pancakeSlice';
import { selectPancakePersist } from 'redux/pancake/pancakePersistSlice';
import { IoMdRefresh } from 'react-icons/io';

const Pancake: NextPageWithLayout = () => {
  const { visible, close, open } = useToggle(false);
  const { mutate, isIdle } = useTokens();
  const pancake = useAppSelector(selectPancake);
  const pancakePersist = useAppSelector(selectPancakePersist);

  useEffect(() => {
    if (!pancakePersist.tokens && isIdle) {
      console.log('get tokens from network');
      mutate();
    } else {
      console.log('get tokens from local storage');
    }
  }, [isIdle, mutate, pancakePersist.tokens]);
  return (
    <div>
      <TokenModal visible={visible} close={close} />
      <div className='w-80 flex flex-col border rounded-3xl bg-white'>
        <div className='p-6 border-b'>
          <div className='flex items-center justify-between'>
            <IconButton
              leftIcon={<ChartSvg className='w-6 h-6' />}
            ></IconButton>
            <span className='text-xl font-semibold text-[#280d5f] pl-14'>
              Swap
            </span>
            <div className='flex gap-2'>
              <IconButton
                className='text-[#7a6eaa] hover:opacity-70 active:translate-y-px'
                leftIcon={<SettingSvg />}
              ></IconButton>
              <IconButton
                className='text-[#7a6eaa]  hover:opacity-70 active:translate-y-px'
                leftIcon={<HistorySvg />}
              ></IconButton>
              <IconButton
                className='text-[#D7CAEC] hover:opacity-70 active:translate-y-px'
                leftIcon={<IoMdRefresh />}
              ></IconButton>
            </div>
          </div>
          <div className='text-sm text-center'>Trade tokens in an instant</div>
        </div>
        <div className='flex flex-col items-start justify-start p-4 gap-2 text-indigo-900 font-semibold'>
          <div className='px-2 space-x-2'>
            <IconButton
              onClick={open}
              className='active:translate-y-px [&>div>span:last-child]:!ml-[-2px]'
              leftSrc='/images/pancake/bnb.svg'
              rightSrc='/images/pancake/arrowDown.svg'
            >
              BNB
            </IconButton>
          </div>
          <input
            placeholder='0.0'
            className='h-14 px-4 w-full pb-4 font-normal bg-[#eeeaf4] ring ring-[#eeeaf4] focus-visible:outline-0 rounded-2xl text-right placeholder:text-[#7a6eaa] '
            type='text'
          />
          <div className='p-1 w-full text-center'>
            <IconButton
              exClassName='panEx'
              leftSize='20px'
              rightSize='20px'
              leftIcon={<PanExDown />}
              rightIcon={<PanExUpDown className='text-white' />}
            ></IconButton>
          </div>
          <div className='px-2 space-x-2'>
            <IconButton
              onClick={open}
              className='align-bottom active:translate-y-px [&>div>span:last-child]:!ml-[-2px]'
              leftSrc='/images/pancake/pancake.svg'
              rightSrc='/images/pancake/arrowDown.svg'
            >
              CAKE
            </IconButton>
            <IconButton
              className='align-middle text-[#7a6eaa] active:translate-y-px hover:opacity-70'
              leftSize='16px'
              leftIcon={<PanCopy />}
            ></IconButton>
          </div>

          <input
            placeholder='0.0'
            className='h-14 px-4 w-full pb-4 font-normal bg-[#eeeaf4] ring ring-[#eeeaf4] focus-visible:outline-0 rounded-2xl text-right placeholder:text-[#7a6eaa] '
            type='text'
          />
          <div className='w-full p-1 flex justify-end gap-1'>
            <PanButton className='!py-[2px] !px-2 text-xs'>SCAN RISK</PanButton>
            <PanQuestionMask className='text-[#7a6eaa] h-5 w-5' />
          </div>
          <div className='w-full flex items-center justify-between px-4 pb-3'>
            <span className='text-xs font-normal text-violet-700'>
              Slippage Tolerance
            </span>
            <span className='text-[#1fc7d4]'>0.5%</span>
          </div>

          <PanButton className='w-72 h-12'>Connect Wallet</PanButton>
        </div>
        <div>tokens.length:{pancake.baseTokens.length}</div>
        <div>persist baseTokens.length:{pancakePersist.baseTokens?.length}</div>
        <div>persist tokens.length:{pancakePersist.tokens?.length}</div>
      </div>
    </div>
  );
};

Pancake.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Pancake;
