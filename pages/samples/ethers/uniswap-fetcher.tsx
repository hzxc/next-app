import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect } from 'react';
import { Fetcher, Trade, Token } from '@uniswap/sdk';
import { bscBusdAddr, bscCakeAddr } from 'data';

const UniswapFetcher: NextPageWithLayout = () => {
  const CAKE = new Token(56, bscCakeAddr, 18);
  const BUSD = new Token(56, bscBusdAddr, 18);

  useEffect(() => {}, []);

  return <div className='p-8'>BestTrade</div>;
};

UniswapFetcher.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default UniswapFetcher;
