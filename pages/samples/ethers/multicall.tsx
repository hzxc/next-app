import { UniSwapRouterV3ABI } from 'abi/uniswap';
import { Layout } from 'components/layout';
import { ethers } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Multicall: NextPageWithLayout = () => {
  const iface = new ethers.utils.Interface(UniSwapRouterV3ABI);
  // const abiCoder = ethers.utils.defaultAbiCoder;
  // const methodID = iface.getSighash('swapExactTokensForTokens');
  // const abiC = abiCoder.encode(['uint', 'string'], [1234, 'Hello World']);
  // const encodeFunc = iface.encodeFunctionData('aggregate', [
  //   { target: '', callData: '' },
  //   { target: '', callData: '' },
  // ]);
  // 0xe2e4263a
  // 0xe2e4263a
  return (
    <div className='p-8'>
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
    </div>
  );
};

Multicall.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Multicall;
