import { commonTokens56, commonTokens97 } from 'data/baseTokens';
import {
  bscTestnetTokens,
  bscTokens,
  BUSD,
  USDC,
  USDT,
  WBTC_ETH,
} from 'data/tokens';
import { ChainId, ERC20Token, WNATIVE } from 'eth';
import { IToken } from 'redux/pancake/pancakeSlice';

export const PAN_ROUTER_ADDRESS: Record<number, string> = {
  [ChainId.ETHEREUM]: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
  [ChainId.RINKEBY]: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
  [ChainId.GOERLI]: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
  [ChainId.BSC]: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  [ChainId.BSC_TESTNET]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
};

export const PAN_COMMON_TOKEN: Record<number, IToken[]> = {
  [ChainId.ETHEREUM]: [],
  [ChainId.BSC]: [
    commonTokens56.bnb,
    commonTokens56.cake,
    commonTokens56.busd,
    commonTokens56.btcb,
  ],
  [ChainId.BSC_TESTNET]: [
    commonTokens97.tbnb,
    commonTokens97.cake,
    commonTokens97.busd,
    commonTokens97.wbnb,
  ],
  [ChainId.RINKEBY]: [],
  [ChainId.GOERLI]: [],
};
// [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
// used to construct intermediary pairs for trading
export const PAN_BASES_TO_CHECK_TRADES_AGAINST: Record<number, ERC20Token[]> = {
  [ChainId.ETHEREUM]: [
    WNATIVE[ChainId.ETHEREUM],
    USDC[ChainId.ETHEREUM],
    USDT[ChainId.ETHEREUM],
    WBTC_ETH,
  ],
  [ChainId.RINKEBY]: [
    WNATIVE[ChainId.GOERLI],
    USDC[ChainId.GOERLI],
    BUSD[ChainId.GOERLI],
  ],
  [ChainId.GOERLI]: [
    WNATIVE[ChainId.RINKEBY],
    USDC[ChainId.RINKEBY],
    BUSD[ChainId.RINKEBY],
  ],
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.cake,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
  ],
  [ChainId.BSC_TESTNET]: [
    bscTestnetTokens.wbnb,
    bscTestnetTokens.cake,
    bscTestnetTokens.busd,
  ],
};
