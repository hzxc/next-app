import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ERC20Token, Pair, TradeDirection } from 'eth';
import { getAllCommonPairs } from 'utils/pancake';

export const usePairs = (param: {
  tokenA: ERC20Token;
  tokenB: ERC20Token;
  tradeQueryKey: string;
}) => {
  const { tokenA, tokenB, tradeQueryKey } = param;
  const queryClient = useQueryClient();

  const pairAddr = Pair.getAddress(tokenA, tokenB);
  return useQuery<[Pair[], string], Error>(
    ['PanPairs', pairAddr],
    () => {
      console.log('getAllCommonPairs');
      return getAllCommonPairs(tokenA, tokenB);
    },
    {
      onSuccess: () => {
        console.log('getAllCommonPairs success');
        queryClient.invalidateQueries({ queryKey: [tradeQueryKey] });
      },
      refetchOnWindowFocus: false,
      // retry: false,
      // keepPreviousData: true,
      refetchInterval: 30 * 1000,
    }
  );
};
