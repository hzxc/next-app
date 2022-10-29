import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect } from 'react';
import { Fetcher, Trade, Token } from '@uniswap/sdk';
import { bscBusdAddr, bscCakeAddr } from 'data';
import { Button } from 'components';
import { bscProvider } from 'conf';

const UniswapFetcher: NextPageWithLayout = () => {
  // const CAKE = new Token(56, bscCakeAddr, 18);
  // const BUSD = new Token(56, bscBusdAddr, 18);

  const handleFetchPair = async () => {
    const CAKE = await Fetcher.fetchTokenData(56, bscCakeAddr, bscProvider);
    const BUSD = await Fetcher.fetchTokenData(56, bscBusdAddr, bscProvider);
    console.log(CAKE);
    console.log(BUSD);
    const pairs = await Fetcher.fetchPairData(CAKE, BUSD, bscProvider);
    console.log(pairs);
  };

  return (
    <div className='p-8'>
      <Button onClick={handleFetchPair}>fetch pair data</Button>
      {/* <p>{JSON.stringify('')}</p> */}
    </div>
  );
};

UniswapFetcher.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default UniswapFetcher;
