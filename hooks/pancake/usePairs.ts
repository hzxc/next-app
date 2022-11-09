import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ERC20Token, Pair, TradeDirection } from 'eth';
import { getAllCommonPairs } from 'utils/pancake';

export const usePairs = (param: { tokenA: ERC20Token; tokenB: ERC20Token }) => {
  const { tokenA, tokenB } = param;

  const pairAddr = Pair.getAddress(tokenA, tokenB);
  return useQuery<Pair[], Error>(
    ['PanPairs', pairAddr],
    () => {
      console.log('getAllCommonPairs');
      return getAllCommonPairs(tokenA, tokenB);
    },
    {
      refetchOnWindowFocus: false,
      // retry: false,
      // keepPreviousData: true,
      refetchInterval: 30 * 1000,
    }
  );
};
