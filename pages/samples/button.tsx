import { Button, IconButton, LinkButton } from 'components';
import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import PanExDown from 'public/images/pancake/panExDown.svg';
import BinanceWalletSvg from 'public/images/pancake/binanceWallet.svg';
import PanExUpDown from 'public/images/pancake/PanExUpDown.svg';
import ArrowDownSvg from 'public/images/pancake/arrowDown.svg';
import ArrowUpRight from 'public/images/pancake/arrowUpRight.svg';
import { PanButton } from 'components/pancake/button';

const ButtonPage: NextPageWithLayout = () => {
  return (
    <div>
      <div className='flex gap-4 flex-wrap items-center justify-start p-4'>
        <span>Icon Button:</span>
        <IconButton
          className='hover:bg-gray-100 hover:opacity-80 p-1 ring-1 ring-gray-100 rounded-xl active:translate-y-px'
          leftSrc='/images/pancake/bnb.svg'
        >
          BNB
        </IconButton>
        <IconButton leftSrc='/images/pancake/bnb.svg'></IconButton>
        <IconButton
          className='ring-1 p-1 rounded'
          leftSrc='https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png'
          rightSrc='/images/pancake/bnb.svg'
        >
          icon src
        </IconButton>
        <IconButton
          className='ring-1 p-1 rounded'
          leftIcon={<PanExDown className='text-purple-500' />}
          rightIcon={<BinanceWalletSvg />}
        >
          svgr
        </IconButton>
        <IconButton
          className='border text-cyan-500 active:translate-y-px'
          rightIcon={<ArrowUpRight />}
        ></IconButton>
        <IconButton
          className='border hover:opacity-70'
          leftIcon={<ArrowUpRight />}
        ></IconButton>
        <IconButton leftSrc='/images/pancake/panExDown.svg'></IconButton>
        <IconButton
          exClassName='panEx'
          leftIcon={<PanExDown />}
          rightIcon={<PanExUpDown className='text-white' />}
          leftSize='20px'
          rightSize='20px'
        ></IconButton>
        <IconButton
          exClassName='panMb'
          leftSize='32px'
          leftSrc='/images/pancake/56.png'
          rightIcon={<ArrowDownSvg />}
          style={{ boxShadow: 'rgb(0 0 0 / 10%) 0px -2px 0px inset' }}
        >
          BNB Smart Chain
        </IconButton>
      </div>
      <hr />
      <div className='flex gap-4 flex-wrap items-center justify-start p-4'>
        <span>Pancake Button:</span>
        <PanButton>Connect Wallet</PanButton>
        <PanButton className='w-72 h-12 rounded-2xl'>Connect Wallet</PanButton>
        <PanButton className='py-0 px-2'>scan risk</PanButton>
      </div>
      <hr />
      <div className='flex gap-4 flex-wrap items-center justify-start p-4'>
        <span>Base Button:</span>
        <Button>Base Button</Button>
        <button className='px-2 py-0.5 text-xs font-normal rounded-full border-2 text-emerald-400 border-emerald-400'>
          VOTE NOW
        </button>
      </div>
      <hr />
      <div className='flex gap-4 flex-wrap items-center justify-start p-4'>
        <span>Link Button:</span>
        <IconButton
          className=' text-cyan-500 hover:opacity-70 hover:underline active:translate-y-px'
          rightIcon={<ArrowUpRight />}
        >
          Convert ERC-20 to BEP-20
        </IconButton>
        <IconButton
          className=' text-black font-semibold text-xl'
          leftSrc='/images/pancake/pancakeSwapMobile.svg'
        >
          PancakeSwap
        </IconButton>
        <LinkButton href='https://testnet.binance.org/faucet-smart'>
          Binance Smart Chain Faucet
        </LinkButton>
      </div>
      <hr />
    </div>
  );
};

ButtonPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ButtonPage;
