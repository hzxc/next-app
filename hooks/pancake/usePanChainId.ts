import { ChainId } from 'eth';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

export const usePanChainId = () => {
  const { chain } = useNetwork();

  const [chainId, setChainId] = useState(ChainId.BSC);

  useEffect(() => {
    let id = chain?.id ?? ChainId.BSC;
    if (
      id !== ChainId.BSC &&
      id !== ChainId.ETHEREUM &&
      id !== ChainId.BSC_TESTNET
    ) {
      id = ChainId.BSC;
    }

    setChainId(id);
  }, [chain]);

  return [chainId] as const;
};
