import { IBEP20ABI } from 'abi/bsc';
import { Layout } from 'components/layout';
import { ethers } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';

const Multicall: NextPageWithLayout = () => {
  const iface = new ethers.utils.Interface(IBEP20ABI);
  // const abiCoder = ethers.utils.defaultAbiCoder;
  const hash = iface.getSighash('balanceOf');
  // const abiC = abiCoder.encode(['uint', 'string'], [1234, 'Hello World']);
  // const encodeFunc = iface.encodeFunctionData('aggregate', [
  //   { target: '', callData: '' },
  //   { target: '', callData: '' },
  // ]);
  // 0xe2e4263a
  // 0xe2e4263a
  return (
    <div className='p-8'>
      <p>hash:{hash}</p>
      {/* <p>encodeFunc:{abiC}</p> */}
    </div>
  );
};

Multicall.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Multicall;
