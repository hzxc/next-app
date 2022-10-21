import { IBEP20ABI, PancakeRouterABI } from 'abi/bsc';
import { MulticallABI } from 'abi/MulticallABI';
import { MultiQueryABI } from 'abi';
import { UniSwapRouterV3ABI } from 'abi/uniswap';
import { Button } from 'components';
import { Layout } from 'components/layout';
import { bscProvider, bscTestProvider } from 'conf';
import {
  bscTestNetCakeAddr,
  bscTestNetMulticallAddr,
  bscTestNetMultiQueryAddr,
} from 'data';
import { BigNumber, ethers, utils } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useState } from 'react';

const MultiQuery: NextPageWithLayout = () => {
  const [data, setData] = useState<{
    blockNumber?: number;
    symbol?: string;
    name?: string;
    decimals?: number;
  }>();
  const bep20Iface = new ethers.utils.Interface(IBEP20ABI);

  const symbol = bep20Iface.encodeFunctionData('symbol', []);

  const decimals = bep20Iface.encodeFunctionData('decimals', []);
  const name = bep20Iface.encodeFunctionData('name', []);
  const abiCoder = ethers.utils.defaultAbiCoder;

  const mutiQueryContr = new ethers.Contract(
    bscTestNetMultiQueryAddr,
    MultiQueryABI,
    bscTestProvider
  );

  const queryHandler = async () => {
    try {
      const ret = await mutiQueryContr.multiQuery([
        [bscTestNetCakeAddr, symbol],
        [bscTestNetCakeAddr, decimals],
        [bscTestNetCakeAddr, name],
      ]);

      const blockNumberRet = ret[0].toNumber();
      console.log(ret[0].toNumber());
      const [symbolRet] = abiCoder.decode(['string'], ret[1][0]);
      console.log('symbolRet', symbolRet);
      const [decimalsRet] = abiCoder.decode(['uint'], ret[1][1]);
      console.log('decimalsRet', decimalsRet);
      const decimalsRetNumber = BigNumber.from(ret[1][1]).toNumber();
      console.log('decimalsRetNumber', decimalsRetNumber);
      const [nameRet] = abiCoder.decode(['string'], ret[1][2]);
      console.log('nameRet', nameRet);
      setData({
        blockNumber: blockNumberRet,
        symbol: symbolRet,
        name: nameRet,
        decimals: decimalsRet.toNumber(),
      });
      console.log(JSON.stringify(data));
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return (
    <div className='overflow-auto	p-8'>
      <div className='p-4'>
        <Button onClick={queryHandler}>Multi Query</Button>
      </div>
      {JSON.stringify(data)}
    </div>
  );
};

MultiQuery.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MultiQuery;
