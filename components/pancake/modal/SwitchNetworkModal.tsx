import { Modal } from 'components/modal';
import { ModalOverlay } from './ModalOverlay';
import Image from 'next/image';
import WarningSvg from 'public/images/pancake/warning.svg';
import { PanButton } from '../button';
import { PanModal } from './PanModal';

export const SwitchNetworkModal: React.FC<{ visible: boolean; close: () => void }> = ({
  visible,
  close,
}) => {
  return (
    <PanModal visible={visible} close={close}>
      <div className='overflow-hidden w-96 rounded-3xl text-[#280d5f] bg-white'>
        <div className='text-xl font-semibold px-6 py-3 border-b bg-gradient-to-br from-cyan-50 to-purple-50'>
          <span>Check your network</span>
        </div>
        <div className='overflow-y-auto max-h-[calc(100vh-36px)] scrollbar-thin scrollbar-thumb-violet-900/80 scrollbar-track-slate-100 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg'>
          <div className='p-6 text-base'>
            <p>Currently Swap only supported in BNB Smart Chain, Ethereum</p>
          </div>
          <div className='flex flex-col gap-4 items-center justify-center p-6'>
            <span className='relative h-[175px] w-[194px]'>
              <Image
                src='/images/pancake/check-your-network.webp'
                layout='fill'
                alt='check-your-network'
                priority
              ></Image>
            </span>
            <p className='flex items-center justify-center w-full bg-[#fff7eb] gap-4 border border-[#ffb237] rounded-xl p-4 text-sm text-[#d67e0a]'>
              <WarningSvg className='text-[#ffb237]' />
              <span>Please switch your network to continue.</span>
            </p>
            <PanButton className='w-full h-12'>Switch network in wallet</PanButton>
            <PanButton className='w-full h-12 !shadow-none  text-[#1fc7d4] !bg-white ring-2 ring-[#1fc7d4]'>
              Disconnect Wallet
            </PanButton>
          </div>
        </div>
      </div>
    </PanModal>
  );
};
