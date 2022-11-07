import { useQuery } from '@tanstack/react-query';
import { ERC20Token, Pair } from 'eth';
import { getAllCommonPairs } from 'utils/pancake';

export const usePairs = (param: { tokenA: ERC20Token; tokenB: ERC20Token }) => {
  const { tokenA, tokenB } = param;
  //   const fromCurrency =
  //     ethers.constants.AddressZero === ethers.utils.getAddress(fromToken.address)
  //       ? WNATIVE[CHAIN_ID]
  //       : new ERC20Token(
  //           ChainId.BSC,
  //           fromToken.address,
  //           fromToken.decimals,
  //           fromToken.symbol,
  //           fromToken.name,
  //           fromToken.projectLink,
  //           fromToken.logoURI,
  //           fromToken.source
  //         );

  //   const toCurrency =
  //     ethers.constants.AddressZero === ethers.utils.getAddress(toToken.address)
  //       ? WNATIVE[CHAIN_ID]
  //       : new ERC20Token(
  //           ChainId.BSC,
  //           toToken.address,
  //           toToken.decimals,
  //           toToken.symbol,
  //           toToken.name,
  //           toToken.projectLink,
  //           toToken.logoURI,
  //           toToken.source
  //         );

  const pairAddr = Pair.getAddress(tokenA, tokenB);
  return useQuery<Pair[], Error>(['PanPairs', pairAddr], () => {
    return getAllCommonPairs(tokenA, tokenB);
  });
};
