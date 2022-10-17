import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import { LinkButton } from 'components';

const BscDemo: NextPageWithLayout = () => {
  return (
    <div className='p-8 space-x-8'>
      <LinkButton href='https://testnet.binance.org/faucet-smart'>
        Binance Smart Chain Faucet
      </LinkButton>
      <LinkButton href='https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e'>
        Pancake Router Contract
      </LinkButton>
      <LinkButton href='https://testnet.bscscan.com/'>
        Bscscan Testnet
      </LinkButton>
    </div>
  );
};

BscDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BscDemo;
