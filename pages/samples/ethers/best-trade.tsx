import { spawn } from 'child_process';
import { Button, IconButton } from 'components';
import { Layout } from 'components/layout';
import { ethers, utils } from 'ethers';
import { getBnbBalance, useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import { ChainId, Pair, Token, TokenAmount, Trade } from '@uniswap/sdk';

const BestTrade: NextPageWithLayout = () => {
  const HOT = new Token(
    ChainId.MAINNET,
    '0xc0FFee0000000000000000000000000000000000',
    18,
    'HOT',
    'Caffeine'
  );
  const NOT = new Token(
    ChainId.MAINNET,
    '0xDeCAf00000000000000000000000000000000000',
    18,
    'NOT',
    'Caffeine'
  );

  const pair = new Pair(
    new TokenAmount(HOT, '2000000000000000000'),
    new TokenAmount(NOT, '1000000000000000000')
  );
  return <div className='p-8'>BestTrade</div>;
};

BestTrade.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BestTrade;
