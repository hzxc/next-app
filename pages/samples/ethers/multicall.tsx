import { PancakeRouterABI } from 'abi/bsc';
import { MulticallABI } from 'abi/MulticallABI';
import { UniSwapRouterV3ABI } from 'abi/uniswap';
import { Layout } from 'components/layout';
import { ethers, utils } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Multicall: NextPageWithLayout = () => {
  const iface = new ethers.utils.Interface(UniSwapRouterV3ABI);
  const panIface = new ethers.utils.Interface(PancakeRouterABI);
  const multicalliface = new ethers.utils.Interface(MulticallABI);
  // const abiCoder = ethers.utils.defaultAbiCoder;
  // const methodID = iface.getSighash('swapExactTokensForTokens');
  // const abiC = abiCoder.encode(['uint', 'string'], [1234, 'Hello World']);
  const encodeFunc = panIface.encodeFunctionData('getAmountsOut', [
    utils.parseEther('1'),
    [
      '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    ],
  ]);
  // 0xe2e4263a
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
        getAmountsOut:
        {panIface.getSighash('getAmountsOut')}
      </p>
      <p className='break-words'>encodeFunc:{encodeFunc}</p>
    </div>
  );
};

Multicall.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Multicall;
