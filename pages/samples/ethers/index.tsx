import { spawn } from 'child_process';
import { Button, IconButton } from 'components';
import { Layout } from 'components/layout';
import { bscBusdAddr, bscCakeAddr } from 'data/constants';
import { BigNumber, ethers, utils } from 'ethers';
import {
  getCreate2Address,
  solidityKeccak256,
  solidityPack,
} from 'ethers/lib/utils';
import { useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect, useState } from 'react';
import { isError } from 'utils';

import { useInitConnect } from 'hooks/useInitConnect';
import {
  ChainId,
  CurrencyAmount,
  FACTORY_ADDRESS_MAP,
  Fraction,
  INIT_CODE_HASH_MAP,
  JSBI,
} from 'eth';
import { getBestBscProvider } from 'conf';
import { getBnbBalance, getTokensBalance } from 'utils/pancake';
import { bscTokens, BSC_BNB } from 'data/tokens';
import { tokens56 } from 'data/baseTokens';

const Index: NextPageWithLayout = () => {
  const { data, isFetching } = useCakePrice();
  useEffect(() => {
    getBestBscProvider();
  }, []);

  const [bnbBal, setBnbBal] = useState('');
  const [addr, setAddr] = useState<`0x${string}`>(
    '0x55cf452d43efafb505335cee7e0bb368a37c322c'
  );

  const [err, setErr] = useState('');

  const bnbBalHandler = async () => {
    getBnbBalance(addr)
      .then((d) => {
        setBnbBal(utils.formatUnits(d, 18));
        setErr('');
      })
      .catch((e) => {
        if (isError(e)) {
          setErr(e.message);
        }
      });
  };
  const [isConnected, address, activeConnector] = useInitConnect();

  useEffect(() => {
    // console.log(data);
    if (data) {
      console.log(data[1]._hex);
      // const ret = new Fraction(JSBI.BigInt(data[1]._hex));
      const ca = CurrencyAmount.fromRawAmount(bscTokens.cake, data[1]._hex);
      const bn = BigNumber.from(data[1]);
      console.log('toSignificant', ca.toSignificant());
      console.log('BigNumber.toString()', bn.toString());
      const am = bn.mul(BigNumber.from(5)).div(BigNumber.from(1000));
      console.log('0.5%', am.toString());
      // console.log(ret.divide(18).toSignificant(6));
    }
  }, [data]);

  return (
    <div className='p-8'>
      <IconButton
        className='font-semibold [&>div>span:first-child]:hover:scale-125 [&>div>span:first-child]:transition-transform'
        leftSrc='/images/pancake/pancake.svg'
      >
        {data ? utils.formatUnits(data[1], 18) : undefined}
      </IconButton>
      <p>{JSON.stringify(data)}</p>
      {/* <p>{data ? data[1].hex : ''}</p> */}
      {/* <p>{new Fraction(JSBI.BigInt(data[1].hex))}</p> */}
      <div className='space-x-4 py-4'>
        <input
          className='border w-96'
          type='text'
          value={addr}
          onChange={(e) => {
            try {
              setAddr(ethers.utils.getAddress(e.target.value));
            } catch (error) {
              console.log(error);
            }
          }}
          placeholder='account address'
        />
        <Button onClick={bnbBalHandler}>get bnb balance</Button>
        {bnbBal ? <span>{bnbBal}</span> : undefined}
      </div>
      <div>{err}</div>
      <div className='flex items-center justify-start flex-wrap p-4 gap-2'>
        <Button
          onClick={() => {
            console.log(
              solidityPack(['address', 'address'], [bscCakeAddr, bscBusdAddr])
            );
          }}
        >
          Solidity Pack
        </Button>
        <Button
          onClick={() => {
            console.log(
              getCreate2Address(
                FACTORY_ADDRESS_MAP[56],
                solidityKeccak256(
                  ['bytes'],
                  [
                    solidityPack(
                      ['address', 'address'],
                      [
                        '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
                        '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                      ]
                    ),
                  ]
                ),
                INIT_CODE_HASH_MAP[56]
              )
            );
          }}
        >
          GetCreate2Address
        </Button>

        <Button
          onClick={() => {
            console.log('1' in ChainId);
          }}
        >
          Enum Test
        </Button>

        <Button
          onClick={async () => {
            console.log('chainId', await activeConnector?.getChainId());
            console.log('isConnected', isConnected);
            console.log('address', address);
          }}
        >
          ChainId Test
        </Button>

        <Button
          onClick={async () => {
            const token0 = BSC_BNB;
            const token1 = bscTokens.busd;

            getTokensBalance('0x55cf452D43EfAfb505335cEe7e0BB368a37c322c', [
              token0,
              token1,
            ]).then((ret) => {
              console.log(ret);
              ret.forEach((item) => {
                console.log(item.currency.address, item.toSignificant());
              });
            });
          }}
        >
          Get Balance
        </Button>

        <Button
          onClick={() => {
            getBnbBalance('0x55cf452D43EfAfb505335cEe7e0BB368a37c322c').then(
              (ret) => {
                console.log(ret);
              }
            );
          }}
        >
          Get BNB Balance
        </Button>

        {/* <Button
          onClick={() => {
            getBalance('0x55cf452D43EfAfb505335cEe7e0BB368a37c322c', [
              baseTokens[0],
              baseTokens[1],
            ]).then((ret) => {
              console.log(ret);
            });
          }}
        >
          Get Currency Balance
        </Button> */}
      </div>
    </div>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
