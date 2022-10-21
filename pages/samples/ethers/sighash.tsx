import { IBEP20ABI, PancakeRouterABI } from 'abi/bsc';
import { MulticallABI } from 'abi/MulticallABI';
import { UniSwapRouterV3ABI } from 'abi/uniswap';
import { Button } from 'components';
import { Layout } from 'components/layout';
import { bscProvider, bscTestProvider } from 'conf';
import { ethers, utils } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Sighash: NextPageWithLayout = () => {
  const iface = new ethers.utils.Interface(UniSwapRouterV3ABI);
  const panIface = new ethers.utils.Interface(PancakeRouterABI);
  const bep20Iface = new ethers.utils.Interface(IBEP20ABI);
  const multicalliface = new ethers.utils.Interface(MulticallABI);
  const abiCoder = ethers.utils.defaultAbiCoder;

  const getAmountsOut = panIface.encodeFunctionData('getAmountsOut', [
    utils.parseEther('1'),
    [
      '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    ],
  ]);

  const symbol = bep20Iface.encodeFunctionData('symbol', []);

  const decimals = bep20Iface.encodeFunctionData('decimals', []);

  const aggregate = multicalliface.encodeFunctionData('aggregate', [
    [
      ['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', symbol],
      ['0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals],
    ],
  ]);

  // 0xe2e4263a
  return (
    <div className='overflow-auto	p-8'>
      <p>
        swapExactTokensForTokens:{iface.getSighash('swapExactTokensForTokens')}
      </p>
      <p>approveMax:{iface.getSighash('approveMax')}</p>
      <p>
        multicall(bytes32,bytes[]):
        {iface.getSighash('multicall(bytes32,bytes[])')}
      </p>
      <p>
        multicall(uint256,bytes[]):
        {iface.getSighash('multicall(uint256,bytes[])')}
      </p>
      <p>multicall(bytes[]):{iface.getSighash('multicall(bytes[])')}</p>
      <p>aggregate:{multicalliface.getSighash('aggregate')}</p>
      <p>
        aggregate:
        {multicalliface.getSighash('aggregate((address,bytes)[])')}
      </p>
      <p>
        symbol:
        {bep20Iface.getSighash('symbol')}
      </p>
      <p>
        decimals:
        {bep20Iface.getSighash('decimals')}
      </p>
      <p>
        getAmountsOut:
        {panIface.getSighash('getAmountsOut')}
      </p>

      <p className='break-words'>getAmountsOut:{getAmountsOut}</p>
      <p className='break-words'>aggregate:{aggregate}</p>
    </div>
  );
};

Sighash.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Sighash;
