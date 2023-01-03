import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import Image from 'next/image';
import { useAccount, useConnect, useDisconnect, useEnsAvatar } from 'wagmi';
import { Button } from 'components';
import dayjs from 'dayjs';
import React from 'react';

const SendTransaction: NextPageWithLayout = () => {
  const { address, connector, isConnected } = useAccount();

  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: 'nick.eth',
  });

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const [to, setTo] = React.useState('');

  const [amount, setAmount] = React.useState('');

  if (isConnected) {
    return (
      <div className='flex flex-col items-center w-96 mx-auto mt-4 rounded-3xl shadow-xl p-4 gap-2 border-4 border-zinc-400 text-lg'>
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
            placeholder='0xA0Cf…251e'
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

        <Button disabled={!to || !amount}>Send</Button>
      </div>
    );
  }

  return (
    <div className='w-96 mx-auto mt-4 '>
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
            {isLoading &&
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
