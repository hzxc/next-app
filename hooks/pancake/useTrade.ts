import { useQuery } from '@tanstack/react-query';
import {
  ChainId,
  Currency,
  CurrencyAmount,
  ERC20Token,
  Trade,
  TradeDirection,
  TradeType,
  WNATIVE,
} from 'eth';
import { ethers } from 'ethers';
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

  const { data: pairsData } = usePairs({
    tokenA: fromCurrency,
    tokenB: toCurrency,
  });

  return useQuery<Trade<Currency, Currency, TradeType> | null, Error>(
    [
      'PanTrade',
      // fromToken.address,
      // toToken.address,
      amountToTrade,
      pairsData ? pairsData[1] : '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
      direction,
    ],
    () => {
      console.log('get trade data');
      // console.log('amountToTrade', amountToTrade);
      if (!amountToTrade || !pairsData || amountToTrade === '0') {
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
          pairsData[0]
        );
      } else if (param.direction === TradeDirection.output) {
        return tradeExactOutByPairs(
          fromCurrency,
          CurrencyAmount.fromRawAmount(
            toCurrency,
            ethers.utils.parseEther(amountToTrade).toString()
          ),
          pairsData[0]
        );
      }
      return null;
    },
    {
      refetchOnWindowFocus: false,
      // retry: false,
      keepPreviousData: true,
      refetchInterval: 10 * 1000,
    }
  );
};
