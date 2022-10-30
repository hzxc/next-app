import { spawn } from 'child_process';
import { Button, IconButton } from 'components';
import { Layout } from 'components/layout';
import { ethers, utils } from 'ethers';
import { getBnbBalance, useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useState } from 'react';
import { ChainId, Pair, Token, TokenAmount, Trade } from '@uniswap/sdk';
import { pancakeBestPath } from 'utils/path';
import { bscBusdAddr, bscCakeAddr } from 'data/constants';
import { TradeDirection } from 'simple-uniswap-sdk';
import { stringify } from 'querystring';

const BestTrade: NextPageWithLayout = () => {
  const [trade, setTrade] = useState({
    fromToken: bscBusdAddr,
    toToken: bscCakeAddr,
    amountToTrade: '1',
  });

  const [path, setPath] = useState<string[]>([]);
  const bestPathHandle = () => {
    pancakeBestPath(bscBusdAddr, bscCakeAddr, '1', TradeDirection.output).then(
      (ret) => {
        setPath([
          ret.bestRouteQuote.routeText,
          ...ret.bestRouteQuote.routePathArray,
        ]);
      }
    );
  };
  return (
    <div className='flex flex-col items-center p-8 gap-2'>
      <input
        className='border w-96'
        type='text'
        value={trade.fromToken}
        onChange={(e) => {
          setTrade({ ...trade, fromToken: e.target.value });
        }}
        placeholder='from token'
      />

      <input
        className='border w-96'
        type='text'
        value={trade.toToken}
        onChange={(e) => {
          setTrade({ ...trade, toToken: e.target.value });
        }}
        placeholder='to token'
      />
      <input
        className='border w-96'
        type='text'
        value={trade.amountToTrade}
        onChange={(e) => {
          setTrade({ ...trade, amountToTrade: e.target.value });
        }}
        placeholder='amount to trade'
      />
      <Button onClick={bestPathHandle}>Pancake Get Best Path</Button>

      <p className='break-all'>{JSON.stringify(path)}</p>
    </div>
  );
};

BestTrade.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default BestTrade;
