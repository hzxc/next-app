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

  return useQuery<Trade<Currency, Currency, TradeType> | null, Error>(
    [tradeQueryKey, tag],
    () => {
      console.log('get trade data');

      if (!amountToTrade || !pairs || amountToTrade === '0') {
        return null;
      }

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
