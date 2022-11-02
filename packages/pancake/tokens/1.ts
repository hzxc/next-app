import { ChainId, WETH9 } from '../sdk';
import { USDC, USDT, WBTC_ETH } from './common';

export const ethereumTokens = {
  weth: WETH9[ChainId.ETHEREUM],
  usdt: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM],
  wbtc: WBTC_ETH,
};
