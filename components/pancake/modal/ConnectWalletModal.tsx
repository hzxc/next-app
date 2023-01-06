import CloseSvg from 'public/images/pancake/close.svg';
import { IconButton } from 'components';
import { PanButton } from '../button';
import { useAccount, useConnect } from 'wagmi';
import { PanModal } from './PanModal';
import { useEffect } from 'react';

export const ConnectWalletModal: React.FC<{
  visible: boolean;
  close: () => void;
}> = ({ visible, close }) => {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      close();
    }
  }, [isConnected, close]);
  return (
    <PanModal visible={visible} close={close}>
      <div className='overflow-hidden w-80 rounded-3xl text-[#280d5f] bg-white'>
        <div className='flex items-center justify-between h-16 text-xl font-semibold px-6 py-3 border border-x-transparent border-t-transparent bg-gradient-to-br from-cyan-50 to-purple-50'>
          <span>Connect Wallet</span>
          <IconButton onClick={close}>
            <CloseSvg className='w-5 h-5 text-[#1fc7d4]' />
          </IconButton>
        </div>
        <div className='overflow-y-auto max-h-[calc(100vh-48px)] scrollbar-thin scrollbar-thumb-violet-900/80 scrollbar-track-slate-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg'>
          <div className='my-6 h-48 text-[#7a6eaa] text-sm'>
            <IconButton
              onClick={() =>
                connect({
                  connector: connectors.find((item) => {
                    return item.id === 'metaMask';
                  }),
                })
              }
              className='active:translate-y-px w-1/2 h-1/2 hover:opacity-70'
              leftSize='40px'
              rightSize='40px'
              col
              leftSrc='/images/pancake/metamask.svg'
            >
              Metamask
            </IconButton>
            <IconButton
              onClick={() =>
                connect({
                  connector: connectors.find((item) => {
                    return item.name === 'Injected';
                  }),
                })
              }
              className='active:translate-y-px w-1/2 h-1/2 hover:opacity-70'
              leftSize='40px'
              rightSize='40px'
              col
              leftSrc='/images/pancake/binanceWallet.svg'
            >
              Binance Wallet
            </IconButton>
            <IconButton
              onClick={() =>
                connect({
                  connector: connectors.find((item) => {
                    return item.id === 'coinbaseWallet';
                  }),
                })
              }
              className='active:translate-y-px w-1/2 h-1/2 hover:opacity-70'
              leftSize='40px'
              rightSize='40px'
              col
              leftSrc='/images/pancake/coinbase.svg'
            >
              Coinbase Wallet
            </IconButton>
            <a href='https://pancakeswap.finance/swap'>
              <IconButton
                className='active:translate-y-px w-1/2 h-1/2 hover:opacity-70'
                leftSize='40px'
                rightSize='40px'
                col
                leftSrc='/images/pancake/ellipsis.svg'
              >
                More
              </IconButton>
            </a>
          </div>
          <div className='border border-x-transparent border-b-transparent  p-6'>
            <p className='text-[#7a6eaa] w-full text-center mb-4'>
              Haven’t got a crypto wallet yet?
            </p>
            <div>
              <a
                href='https://docs.pancakeswap.finance/get-started/connection-guide'
                target='_blank'
                rel='noopener noreferrer'
              >
                <PanButton className=' !bg-[#7a6eaa] w-full h-12'>
                  Learn How to Connect
                </PanButton>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PanModal>
  );
};
