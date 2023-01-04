import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import Image from 'next/image';
import {
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  useEnsAvatar,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { Button } from 'components';
import dayjs from 'dayjs';
import React from 'react';
import { useDebounce } from 'use-debounce';

const ContractWriteDynamicArgs: NextPageWithLayout = () => {
  const { address, connector, isConnected } = useAccount();

  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: 'nick.eth',
  });

  const {
    connect,
    connectors,
    error: connError,
    isLoading: connLoading,
    pendingConnector,
  } = useConnect();
  const { disconnect } = useDisconnect();

  const [tokenId, setTokenId] = React.useState('');
  const [debouncedTokenId] = useDebounce(tokenId, 500);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ internalType: 'uint32', name: 'tokenId', type: 'uint32' }],
        outputs: [],
      },
    ],
    functionName: 'mint',
    args: [parseInt(debouncedTokenId)],
    enabled: Boolean(debouncedTokenId),
  });

  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  if (isConnected) {
    return (
      <div className='flex flex-col items-center w-[460px] mx-auto mt-4 rounded-3xl shadow-xl p-4 gap-2 border-4 border-zinc-400 text-lg'>
        <div className='relative h-20 w-20'>
          <Image
            src={ensAvatar ?? `https://robohash.org/${dayjs().unix()}`}
            alt='avatar'
            layout='fill'
            className='rounded-full'
          />
        </div>

        <div>
          {address
            ? address.slice(0, 6) + '...' + address.slice(-4)
            : undefined}
        </div>
        <div>Connected to {connector?.name}</div>

        <Button
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </Button>

        <div className='space-x-2'>
          <label>Token ID</label>
          <input
            className='p-3 bg-zinc-200 rounded-2xl focus-visible:outline-0 focus:ring'
            id='tokenId'
            placeholder='420'
            onChange={(e) => setTokenId(e.target.value)}
            value={tokenId}
          />

          <Button disabled={!write || isLoading} onClick={() => write?.()}>
            {isLoading ? 'Minting...' : 'Mint'}
          </Button>

          {isSuccess && (
            <div>
              Successfully minted your NFT!
              <div>
                <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
              </div>
            </div>
          )}

          {(isPrepareError || isError) && (
            // <div>Error: {(prepareError || error)?.message}</div>
            <div className='w-full whitespace-normal break-all'>
              Error: {JSON.stringify(prepareError || error)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='w-[460px] mx-auto mt-4'>
      <div className='flex flex-col items-stretch gap-2 rounded-3xl shadow-xl border-4 p-6 border-zinc-400 text-lg text-zinc-300'>
        {connectors.map((connector) => (
          <button
            className='rounded-2xl bg-zinc-700 p-4 hover:opacity-80 active:translate-y-px'
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {connLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </button>
        ))}

        {connError && <div>{connError.message}</div>}
      </div>
    </div>
  );
};

ContractWriteDynamicArgs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ContractWriteDynamicArgs;
