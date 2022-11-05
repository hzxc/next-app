import { Layout } from 'components/layout';

import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import multicall3ABI from 'abis/multicall3.json';
import erc20ABI from 'abis/erc20.json';
import { Interface } from 'ethers/lib/utils';
import { bscCakeAddr } from 'data/constants';
import { bscProvider } from 'conf';
import { Button } from 'components';
import IPancakePairABI from 'abis/bsc/IPancakePair.json';

import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from 'ethereum-multicall';
import { BigNumber } from 'ethers';
import JSBI from 'jsbi';
import { ERC20Token } from 'eth';
import { bscTokens } from 'data/tokens';
import { getPair } from 'utils/pancake';

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
      reference: 'token',
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
    {
      reference: 'pair',
      contractAddress: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
      abi: IPancakePairABI,
      calls: [
        {
          reference: 'getReservesCall',
          methodName: 'getReserves',
          methodParameters: [],
        },
      ],
    },
  ];

  const call = async () => {
    const { results }: ContractCallResults = await multicall.call(
      contractCallContext
    );
    console.log(results['token'].callsReturnContext);
    console.log(results['pair'].callsReturnContext[0].returnValues[0]);
    console.log(
      BigNumber.from(
        results['pair'].callsReturnContext[0].returnValues[0]
      ).toString()
    );
    console.log(
      JSBI.BigInt(
        results['pair'].callsReturnContext[0].returnValues[0].hex
      ).toString()
    );
    // console.log(
    //   BigNumber.from(results['pair'].callsReturnContext[0].returnValues[0])
    // );
  };

  return (
    <div className='p-4 space-x-2'>
      <Button onClick={call}>Ethereum Multicall</Button>
      <Button
        onClick={() => {
          getPair(bscTokens.bnb, bscTokens.cake).then((ret) => {
            console.log(ret);
          });
        }}
      >
        getPair
        {/* 0x0eD7e52944161450477ee417DE9Cd3a859b14fD0 */}
      </Button>
    </div>
  );
};

EthereumMulticall.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EthereumMulticall;
