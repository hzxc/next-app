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
import { BigNumber, ethers } from 'ethers';
import JSBI from 'jsbi';
import { CurrencyAmount, ERC20Token, Percent, _10000, _9975 } from 'eth';
import { bscTokens } from 'data/tokens';
import {
  getAllCommonPairs,
  getPair,
  tradeExactIn,
  tradeExactOut,
} from 'utils/pancake';

import _Big from 'big.js';
import toFormat from 'toformat';

const Big = toFormat(_Big);
Big.DP = 18;

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
    <div className='p-4 space-x-2 space-y-2'>
      <Button onClick={call}>Ethereum Multicall</Button>
      <Button
        onClick={() => {
          getPair(bscTokens.wbnb, bscTokens.cake).then((ret) => {
            console.log(ret);
          });
        }}
      >
        getPair
        {/* 0x0eD7e52944161450477ee417DE9Cd3a859b14fD0 */}
      </Button>
      <Button
        onClick={() => {
          getAllCommonPairs(bscTokens.wbnb, bscTokens.cake).then((ret) => {
            // console.log(ret);
          });
        }}
      >
        getAllCommonPairs
      </Button>

      <Button
        onClick={() => {
          tradeExactIn(
            CurrencyAmount.fromRawAmount(
              bscTokens.vai,
              ethers.utils.parseEther('1').toString()
            ),
            bscTokens.usdt
          ).then((ret) => {
            if (ret) {
              console.log(ret);

              console.log(
                'inputAmount.toSignificant()',
                ret.inputAmount.toSignificant()
              );
              console.log(
                'outputAmount.toSignificant()',
                ret.outputAmount.toSignificant()
              );

              console.log(
                'executionPrice.toSignificant()',
                ret.executionPrice.toSignificant()
              );

              console.log(
                'executionPrice.invert().toSignificant()',
                ret.executionPrice.invert().toSignificant()
              );

              const b = new Big(ret.inputAmount.toSignificant());
              console.log(
                b.div(new Big(ret.outputAmount.toSignificant())).toNumber()
              );
              // const inputAmount = ret.inputAmount;
              // const outputAmount = ret.outputAmount;
              // console.log(ret.priceImpact.toSignificant());
              // console.log(ret.priceImpact.toFixed());
              // const denominator = ret.executionPrice.input;
              // const numerator = ret.executionPrice.numerator;
              // const decimalScale = JSBI.exponentiate(
              //   JSBI.BigInt(10),
              //   JSBI.BigInt(18)
              // );
              // console.log(
              //   'JSBI.divide(denominator, decimalScale)',
              //   JSBI.divide(denominator, decimalScale).toString()
              // );
              // console.log(
              //   'JSBI.divide(numerator, decimalScale)',
              //   JSBI.divide(numerator, decimalScale).toString()
              // );
              // const dd = new Big(denominator.toString()).div(
              //   decimalScale.toString()
              // );
              // const dn = new Big(numerator.toString()).div(
              //   decimalScale.toString()
              // );
              // console.log(dd.toString());
              // console.log(dn.toString());
              // console.log(dd.div(dn).toString());
            }
          });
        }}
      >
        tradeExactIn
      </Button>

      <Button
        onClick={() => {
          tradeExactOut(
            bscTokens.usdt,
            CurrencyAmount.fromRawAmount(
              bscTokens.vai,
              ethers.utils.parseEther('111111').toString()
            )
          ).then((ret) => {
            if (ret) {
              console.log(ret.priceImpact.toFixed());
              // const denominator = ret?.executionPrice.denominator;
              // const numerator = ret?.executionPrice.numerator;
              // const decimalScale = JSBI.exponentiate(
              //   JSBI.BigInt(10),
              //   JSBI.BigInt(18)
              // );

              // const dd = new Big(denominator.toString()).div(
              //   decimalScale.toString()
              // );
              // const dn = new Big(numerator.toString()).div(
              //   decimalScale.toString()
              // );
              // // console.log(denominator.toString());
              // // console.log(numerator.toString());

              // console.log(dd);
              // console.log(dn);
              // console.log(dd.div(dn).toString());
              // console.log(JSBI.toNumber(JSBI.divide(numerator, denominator)));
            }
          });
        }}
      >
        tradeExactOut
      </Button>
      <Button
        onClick={() => {
          console.log(
            'add',
            JSBI.add(JSBI.BigInt('2'), JSBI.BigInt('1')).toString()
          );
        }}
      >
        JSBI.add
      </Button>
      <Button
        onClick={() => {
          console.log('divide', JSBI.divide(_9975, _10000).toString());
        }}
      >
        JSBI.divide
      </Button>

      <Button
        onClick={() => {
          console.log(Big(123.4567).toString());
          const percent = new Percent(25, 100);
          console.log(percent.toFixed());
        }}
      >
        Big
      </Button>
    </div>
  );
};

EthereumMulticall.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EthereumMulticall;
