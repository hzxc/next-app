import { useMutation, useQuery } from '@tanstack/react-query';
import {
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

export const useTrade = (param: {
  fromToken: IToken;
  toToken: IToken;
  amountToTrade: string;
  direction: TradeDirection;
}) => {
  const { fromToken, toToken, amountToTrade, direction } = param;
  const fromCurrency =
    ethers.constants.AddressZero === ethers.utils.getAddress(fromToken.address)
      ? WNATIVE[fromToken.chainId]
      : new ERC20Token(
          fromToken.chainId,
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
      ? WNATIVE[toToken.chainId]
      : new ERC20Token(
          toToken.chainId,
          toToken.address,
          toToken.decimals,
          toToken.symbol,
          toToken.name,
          toToken.projectLink,
          toToken.logoURI,
          toToken.source
        );

  const { data: pairs, dataUpdatedAt } = usePairs({
    tokenA: fromCurrency,
    tokenB: toCurrency,
  });

  const [tag, setTag] = useState<boolean>(false);

  // useEffect(() => {
  //   if (pairs && !isFetching) {
  //     setTag(!tag);
  //   }
  // }, [pairs, isFetching]);

  const { mutate } = useMutation(async () => {
    setTag(!tag);
  });

  useEffect(() => {
    mutate();
  }, [dataUpdatedAt, mutate]);

  const tradeQueryKey = `PanTrade-${Pair.getAddress(
    fromCurrency,
    toCurrency
  )}-${direction}-${amountToTrade}`;

  // utils.id(JSON.stringify(pairs)) : 'undefined'

  return useQuery<Trade<Currency, Currency, TradeType> | null, Error>(
    [tradeQueryKey, tag],
    // [tradeQueryKey],
    () => {
      console.log('get trade data');

      if (
        !amountToTrade ||
        !pairs ||
        pairs.length <= 0 ||
        Number(amountToTrade) <= 0
      ) {
        return null;
      }

      if (param.direction === TradeDirection.input) {
        return tradeExactInByPairs(
          CurrencyAmount.fromRawAmount(
            fromCurrency,
            ethers.utils
              .parseUnits(amountToTrade, fromCurrency.decimals)
              .toString()
          ),
          toCurrency,
          pairs
        );
      } else if (param.direction === TradeDirection.output) {
        return tradeExactOutByPairs(
          fromCurrency,
          CurrencyAmount.fromRawAmount(
            toCurrency,
            ethers.utils
              .parseUnits(amountToTrade, toCurrency.decimals)
              .toString()
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
