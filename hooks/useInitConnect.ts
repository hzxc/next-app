import { useEffect } from 'react';
import { useAccount, useConnect, useMutation } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const useInitConnect = () => {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const { mutate } = useMutation(connectAsync);

  useEffect(() => {
    if (window.ethereum?._state?.isUnlocked && !isConnected) {
      mutate({});
    }
  }, []);

  return [isConnected, address, activeConnector] as const;
};
