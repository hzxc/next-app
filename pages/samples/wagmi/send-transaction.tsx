import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import Image from 'next/image';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import { Button } from 'components';
import dayjs from 'dayjs';
import React from 'react';
import { useDebounce } from 'use-debounce';
import { utils } from 'ethers';

const SendTransaction: NextPageWithLayout = () => {
  const { address, connector, isConnected } = useAccount();

  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: 'nick.eth',
  });

  const {
    connect,
    connectors,
    error,
    isLoading: connLoading,
    pendingConnector,
  } = useConnect();
  const { disconnect } = useDisconnect();

  const [to, setTo] = React.useState('');
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState('');
  const [debouncedAmount] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  });

  const { data, sendTransaction } = useSendTransaction(config);

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
        <div className='w-full space-y-1'>
          <p>Recipient</p>
          <input
            className='p-3 w-full bg-zinc-200 rounded-2xl focus-visible:outline-0 focus:ring'
            aria-label='Recipient'
            // placeholder='0xfFc7....440a'
            placeholder='0x41b8...082B'
            onChange={(e) => setTo(e.target.value)}
            value={to}
          />
        </div>
        <div className='w-full space-y-1'>
          <p>Amount (ether)</p>
          <input
            className='p-3 w-full bg-zinc-200 rounded-2xl focus-visible:outline-0 focus:ring'
            aria-label='Amount (ether)'
            placeholder='0.05'
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
        </div>

        <Button
          disabled={!sendTransaction || !to || !amount}
          onClick={() => {
            sendTransaction?.();
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>

        {isSuccess && (
          <div>
            Successfully sent {amount} ether to {to}
            <div>
              <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='w-[460px] mx-auto mt-4 '>
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

        {error && <div>{error.message}</div>}
      </div>
    </div>
  );
};

SendTransaction.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SendTransaction;
