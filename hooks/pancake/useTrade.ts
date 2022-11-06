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
import { tradeExactIn, tradeExactOut } from 'utils/pancake';
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

  return useQuery<Trade<Currency, Currency, TradeType> | null, Error>(
    ['PanTrade', fromToken.address, toToken.address, amountToTrade, direction],
    () => {
      console.log('get trade data');
      if (!amountToTrade) {
        return null;
      }
      // invariant(amountToTrade, 'invalid amountToTrade');
      // console.log('amountToTrade', amountToTrade);

      if (param.direction === TradeDirection.input) {
        return tradeExactIn(
          CurrencyAmount.fromRawAmount(
            fromCurrency,
            ethers.utils.parseEther(amountToTrade).toString()
          ),
          toCurrency
        );
      } else if (param.direction === TradeDirection.output) {
        return tradeExactOut(
          fromCurrency,
          CurrencyAmount.fromRawAmount(
            toCurrency,
            ethers.utils.parseEther(amountToTrade).toString()
          )
        );
      }
      return null;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      keepPreviousData: true,
    }
  );
};
