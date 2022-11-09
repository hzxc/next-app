import { useQuery } from '@tanstack/react-query';
import {
  ChainId,
  Currency,
  CurrencyAmount,
  ERC20Token,
  Pair,
  Trade,
  TradeDirection,
  TradeType,
  WNATIVE,
} from 'eth';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { IToken } from 'redux/pancake/pancakeSlice';
import { tradeExactInByPairs, tradeExactOutByPairs } from 'utils/pancake';
import { usePairs } from './usePairs';
const CHAIN_ID = 56;

export const useTrade = (param: {
  fromToken: IToken;
  toToken: IToken;
  amountToTrade: string;
  direction: TradeDirection;
}) => {
  const { fromToken, toToken, amountToTrade, direction } = param;
  const fromCurrency =
    ethers.constants.AddressZero === ethers.utils.getAddress(fromToken.address)
      ? WNATIVE[CHAIN_ID]
      : new ERC20Token(
          ChainId.BSC,
          fromToken.address,
          fromToken.decimals,
          fromToken.symbol,
          fromToken.name,
          fromToken.projectLink,
          fromToken.logoURI,
          fromToken.source
        );

  const toCurrency =
    ethers.constants.AddressZero === ethers.utils.getAddress(toToken.address)
      ? WNATIVE[CHAIN_ID]
      : new ERC20Token(
          ChainId.BSC,
          toToken.address,
          toToken.decimals,
          toToken.symbol,
          toToken.name,
          toToken.projectLink,
          toToken.logoURI,
          toToken.source
        );
  // console.log('useTrade', fromCurrency.address, toCurrency.address);

  // ${Pair.getAddress(
  //   fromCurrency,
  //   toCurrency
  // )}
  // 'PanTrade',
  // amountToTrade,
  // // pairsData ? pairsData[1] : '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
  // direction,
  // ];

  const { data: pairs, isFetching } = usePairs({
    tokenA: fromCurrency,
    tokenB: toCurrency,
  });

  const [tag, setTag] = useState<boolean>();

  useEffect(() => {
    if (pairs && !isFetching) {
      setTag(!tag);
    }
  }, [pairs, isFetching]);

  const tradeQueryKey = `PanTrade-${Pair.getAddress(
    fromCurrency,
    toCurrency
  )}-${direction}-${amountToTrade}`;

  // const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ['todos'] });

  // const keccak256Ret = utils.keccak256(
  //   utils.toUtf8Bytes(JSON.stringify(pairsData))
  // );
  // console.log('allpairs', JSON.stringify(allPairs));
  // const sha256Ret = utils.sha256(
  //   utils.toUtf8Bytes(JSON.stringify(pairsData?.[0] || ''))
  // );

  return useQuery<Trade<Currency, Currency, TradeType> | null, Error>(
    // [tradeQueryKey, dataUpdatedAt],
    [tradeQueryKey, tag],
    () => {
      console.log('get trade data');
      // console.log('pair', pairs ? 'yes' : 'undefined');
      // console.log(tradeQueryKey, tag);
      // console.log('tag', tag ? 'true' : 'false');
      // console.log('dataUpdatedAt', dataUpdatedAt);

      // console.log('amountToTrade', amountToTrade);
      // console.log('direction', direction);

      // console.log('amountToTrade', amountToTrade);
      if (!amountToTrade || !pairs || amountToTrade === '0') {
        return null;
      }
      // invariant(amountToTrade, 'invalid amountToTrade');

      if (param.direction === TradeDirection.input) {
        return tradeExactInByPairs(
          CurrencyAmount.fromRawAmount(
            fromCurrency,
            ethers.utils.parseEther(amountToTrade).toString()
          ),
          toCurrency,
          pairs
        );
      } else if (param.direction === TradeDirection.output) {
        return tradeExactOutByPairs(
          fromCurrency,
          CurrencyAmount.fromRawAmount(
            toCurrency,
            ethers.utils.parseEther(amountToTrade).toString()
          ),
          pairs
        );
      }
      return null;
    },
    {
      refetchOnWindowFocus: false,
      // retry: false,
      keepPreviousData: true,
      // refetchInterval: 10 * 1000,
    }
  );
};
