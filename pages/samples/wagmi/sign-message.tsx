import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement, useState } from 'react';
import Image from 'next/image';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useSignMessage,
} from 'wagmi';
import { Button } from 'components';
import dayjs from 'dayjs';
import React from 'react';
import { verifyMessage } from 'ethers/lib/utils';

const SignMessage: NextPageWithLayout = () => {
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

  const recoveredAddress = React.useRef<string>();
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
    },
  });

  const [message, setMessage] = useState('');

  if (isConnected) {
    return (
      <div className='flex flex-col items-center w-[460px] mx-auto mt-4 rounded-3xl shadow-xl p-4 gap-1 border-4 border-zinc-400 text-lg'>
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

        <label>Enter a message to sign</label>
        <textarea
          className='h-60 p-3 w-full bg-zinc-200 rounded-2xl focus-visible:outline-0 focus:ring'
          placeholder='The quick brown fox…'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />

        <Button disabled={connLoading} onClick={() => signMessage({ message })}>
          {connLoading ? 'Check Wallet' : 'Sign Message'}
        </Button>

        {data && (
          <div className='break-all'>
            <div>Recovered Address: {recoveredAddress.current}</div>
            <div>Signature: {data}</div>
          </div>
        )}

        {error && <div>{error.message}</div>}
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

SignMessage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default SignMessage;
