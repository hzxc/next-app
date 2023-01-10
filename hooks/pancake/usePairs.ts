import { useQuery } from '@tanstack/react-query';
import { ChainId, ERC20Token, Pair } from 'eth';
import { useDebounce } from 'use-debounce';
import { getAllCommonPairs } from 'utils/pancake';
import { useNetwork } from 'wagmi';
import { usePanChainId } from './usePanChainId';

export const usePairs = (param: { tokenA: ERC20Token; tokenB: ERC20Token }) => {
  const { tokenA, tokenB } = param;

  const pairAddr = Pair.getAddress(tokenA, tokenB);

  // const debouncePairAddr = useDebounce(pairAddr, 400);

  const [chainId] = usePanChainId();
  return useQuery<Pair[], Error>(
    ['PanPairs', pairAddr],
    () => {
      console.log('getAllCommonPairs');
      return getAllCommonPairs(chainId, tokenA, tokenB);
    },
    {
      refetchOnWindowFocus: false,
      // retry: false,
      // keepPreviousData: true,
      refetchInterval: 30 * 1000,
    }
  );
};
