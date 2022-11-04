import { spawn } from 'child_process';
import { Button, IconButton } from 'components';
import { Layout } from 'components/layout';
import { bscBusdAddr, bscCakeAddr } from 'data/constants';
import { ethers, utils } from 'ethers';
import {
  getCreate2Address,
  solidityKeccak256,
  solidityPack,
} from 'ethers/lib/utils';
import { getBnbBalance, useCakePrice } from 'hooks/pancake';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useEffect, useState } from 'react';
import { FACTORY_ADDRESS_MAP, INIT_CODE_HASH_MAP } from 'packages/pancake/sdk';
import { isError } from 'utils';
import { ChainId } from 'packages';
import { useChainId } from 'hooks/useChainId';
import { useInitConnect } from 'hooks/useInitConnect';

const Index: NextPageWithLayout = () => {
  const { data, isFetching } = useCakePrice();
  useEffect(() => {
    console.log(isFetching ? 'fetching' : 'idle');
  }, [isFetching]);

  const [bnbBal, setBnbBal] = useState('');
  const [addr, setAddr] = useState(
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
  const chainId = useChainId();

  return (
    <div className='p-8'>
      <IconButton
        className='font-semibold [&>div>span:first-child]:hover:scale-125 [&>div>span:first-child]:transition-transform'
        leftSrc='/images/pancake/pancake.svg'
      >
        {data ? utils.formatUnits(data[1], 18) : undefined}
      </IconButton>
      <div className='space-x-4 py-4'>
        <input
          className='border w-96'
          type='text'
          value={addr}
          onChange={(e) => {
            setAddr(e.target.value);
          }}
          placeholder='account address'
        />
        <Button onClick={bnbBalHandler}>get bnb balance</Button>
        {bnbBal ? <span>{bnbBal}</span> : undefined}
      </div>
      <div>{err}</div>
      <div className='p-8 space-x-2'>
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
            chainId.then((chainId) => {
              console.log('chainId', chainId);
            });
            console.log('chainId', await activeConnector?.getChainId());
            console.log('isConnected', isConnected);
            console.log('address', address);
          }}
        >
          ChainId Test
        </Button>
      </div>
    </div>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
