import { Layout } from 'components/layout';
import { NextPageWithLayout } from 'pages/_app';
import { ReactElement } from 'react';
import { useEnsAddress, useEnsAvatar, useEnsName, useEnsResolver } from 'wagmi';
import Image from 'next/image';

const EnsDemo: NextPageWithLayout = () => {
  const {
    data: ensAvatar,
    isError: ensAvatarIsError,
    isLoading: ensAvatarIsLoading,
  } = useEnsAvatar({
    addressOrName: 'nick.eth',
  });
  const {
    data: ensAddr,
    isError: ensAddrIsError,
    isLoading: ensAddrIsLoading,
  } = useEnsAddress({
    name: 'nick.eth',
  });

  const {
    data: ensName,
    isError: ensNameIsError,
    isLoading: ensNameIsLoading,
  } = useEnsName({
    address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
  });

  const {
    data: ensResolver,
    isError: ensResolverIsError,
    isLoading: ensResolverIsLoading,
  } = useEnsResolver({
    name: 'nick.eth',
  });

  return (
    <div className='p-8 space-y-2'>
      <p className='text-2xl'>useEnsAddress</p>
      {ensAddrIsLoading ? <div>Fetching...</div> : undefined}
      {ensAddrIsError ? <div>Error fetching</div> : undefined}
      <div>EnsAddress: {ensAddr}</div>
      <p className='text-2xl'>useEnsName</p>
      {ensNameIsLoading ? <div>Fetching...</div> : undefined}
      {ensNameIsError ? <div>Error fetching</div> : undefined}
      <div>EnsName: {ensName}</div>
      <p className='text-2xl'>useEnsAvatar</p>
      {ensAvatarIsLoading ? <div>Fetching...</div> : undefined}
      {ensAvatarIsError ? <div>Error fetching</div> : undefined}
      <div>
        Avatar:
        {ensAvatar ? (
          <Image src={ensAvatar} alt='avatar' width={48} height={48} />
        ) : undefined}
      </div>
      <p className='text-2xl'>useEnsResolver</p>
      {ensResolverIsLoading ? <div>Fetching...</div> : undefined}
      {ensResolverIsError ? <div>Error fetching</div> : undefined}
      <div>Resolver: {JSON.stringify(ensResolver)}</div>
    </div>
  );
};

EnsDemo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EnsDemo;
