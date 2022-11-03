import { Layout } from 'components/layout';
import { ethers } from 'ethers';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import multicall3ABI from 'abis/multicall3.json';
import erc20ABI from 'abis/erc20.json';
import { Interface } from 'ethers/lib/utils';
import { bscCakeAddr, MULTICALL3 } from 'data/constants';
import { bscProvider } from 'conf';
import { Button } from 'components';
import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from 'ethereum-multicall';

const multicall3Iface = new Interface(multicall3ABI);
const erc20Iface = new Interface(erc20ABI);

const EthereumMulticall: NextPageWithLayout = () => {
  //   const multicall = new ethers.Contract(
  //     MULTICALL3,
  //     multicall3Iface,
  //     bscProvider
  //   );
  //   const signer = bscProvider.getSigner();

  //   const multicallWithSigner = multicall.connect(signer);

  //   const symbol = erc20Iface.encodeFunctionData('symbol', []);
  //   const call = async () => {
  //     const ret = await multicallWithSigner.aggregate3([
  //       [bscCakeAddr, true, symbol],
  //     ]);
  //     console.log(ret);
  //   };
  //  -------------
  let provider = bscProvider;
  const multicall = new Multicall({
    ethersProvider: provider,
    tryAggregate: true,
  });

  const contractCallContext: ContractCallContext[] = [
    {
      reference: 'cakeContract',
      contractAddress: bscCakeAddr,
      abi: erc20ABI,
      calls: [
        { reference: 'symbolCall', methodName: 'symbol', methodParameters: [] },
        { reference: 'nameCall', methodName: 'name', methodParameters: [] },
        {
          reference: 'decimalsCall',
          methodName: 'decimals',
          methodParameters: [],
        },
      ],
    },
  ];

  const call = async () => {
    const results: ContractCallResults = await multicall.call(
      contractCallContext
    );
    console.log(results);
  };
  return (
    <div className='p-4'>
      <Button onClick={call}>Multicall3</Button>
    </div>
  );
};

EthereumMulticall.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EthereumMulticall;
