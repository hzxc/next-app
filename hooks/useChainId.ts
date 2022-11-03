import { ChainId } from 'packages';
import { useAccount } from 'wagmi';

export const useChainId = async () => {
  const { connector } = useAccount();
  return await connector?.getChainId();
  //   let chainId: ChainId | undefined = undefined;

  //   if (id && id in ChainId) {
  //     chainId = Number(id);
  //   }

  //   return chainId;
};
