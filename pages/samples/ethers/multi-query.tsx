import { IBEP20ABI, PancakeRouterABI } from 'abis/bsc';
import { MulticallABI } from 'abis/MulticallABI';
import { MultiQueryABI } from 'abis';
import { UniSwapRouterV3ABI } from 'abis/uniswap';
import { Button } from 'components';
import { Layout } from 'components/layout';
import { bscProvider } from 'conf';
import {
  bscBusdAddr,
  bscCakeAddr,
  bscMultiQueryAddr,
  BSC_PANCAKE_ROUTER_ADDR,
} from 'data/constants';
import { BigNumber, ethers, utils } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useState } from 'react';

const MultiQuery: NextPageWithLayout = () => {
  const [data, setData] = useState<{
    blockNumber: number;
    symbol: string;
    name: string;
    decimals: number;
    cakePrice: string;
  }>();
  const bep20Iface = new ethers.utils.Interface(IBEP20ABI);
  const pancakeRouterIface = new ethers.utils.Interface(PancakeRouterABI);

  const symbol = bep20Iface.encodeFunctionData('symbol', []);

  const decimals = bep20Iface.encodeFunctionData('decimals', []);
  const name = bep20Iface.encodeFunctionData('name', []);
  const getAmountsOut = pancakeRouterIface.encodeFunctionData('getAmountsOut', [
    utils.parseEther('1'),
    [bscCakeAddr, bscBusdAddr],
  ]);

  const abiCoder = ethers.utils.defaultAbiCoder;

  const mutiQueryContr = new ethers.Contract(
    bscMultiQueryAddr,
    MultiQueryABI,
    bscProvider
  );

  const queryHandler = async () => {
    try {
      const ret = await mutiQueryContr.multiQuery([
        [bscCakeAddr, symbol],
        [bscCakeAddr, decimals],
        [bscCakeAddr, name],
        [BSC_PANCAKE_ROUTER_ADDR, getAmountsOut],
      ]);

      const blockNumberRet = ret[0].toNumber();
      console.log(ret[0].toNumber());
      const [symbolRet] = abiCoder.decode(['string'], ret[1][0]);
      console.log('symbolRet', symbolRet);
      // console.log('ret[1][1]', ret[1][1]);
      const [decimalsRet] = abiCoder.decode(['uint'], ret[1][1]);

      console.log('decimalsRet', decimalsRet.toNumber());
      const decimalsRetNumber = BigNumber.from(ret[1][1]).toNumber();
      console.log('decimalsRetNumber', decimalsRetNumber);
      const [nameRet] = abiCoder.decode(['string'], ret[1][2]);
      console.log('nameRet', nameRet);
      // console.log('ret[1][3]', ret[1][3]);

      const [cakePriceRet] = abiCoder.decode(['uint[]'], ret[1][3]);
      // utils.formatUnits(data[1], 18)
      // console.log('cakePriceRet', JSON.stringify(cakePriceRet));
      setData({
        blockNumber: blockNumberRet,
        symbol: symbolRet,
        name: nameRet,
        decimals: decimalsRet.toNumber(),
        cakePrice: utils.formatUnits(cakePriceRet[1], decimalsRet.toNumber()),
      });
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return (
    <div className='overflow-auto	p-8'>
      <div className='p-4'>
        <Button className='text-sm' onClick={queryHandler}>
          Click Multi Query
        </Button>
      </div>
      {data ? 'CAKE:' + JSON.stringify(data) : undefined}
    </div>
  );
};

MultiQuery.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default MultiQuery;
