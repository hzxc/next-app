import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import Image from 'next/image';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi';
import { Button } from 'components';

const ConnectWallet: NextPageWithLayout = () => {
  const { address, connector, isConnected } = useAccount();
  // const { data: ensAvatar } = useEnsAvatar({ addressOrName: address });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: 'nick.eth' });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className='p-4 space-y-1'>
        {ensAvatar ? (
          <Image src={ensAvatar} alt='avatar' width={48} height={48} />
        ) : undefined}
        <div>{ensName ? `${ensName} (${address})` : address}</div>
        <div>Connected to {connector?.name}</div>
        <Button
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center pt-8'>
      <div className='flex flex-col items-stretch gap-2 rounded-3xl border-4 p-6 border-zinc-400 text-lg text-zinc-300 min-w-[384px]'>
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

ConnectWallet.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ConnectWallet;
