import { ChainId, ERC20Token, WBNB } from 'eth';
import { BUSD_TESTNET, CAKE_TESTNET } from './common';

export const bscTestnetTokens = {
  wbnb: WBNB[ChainId.BSC_TESTNET],
  cake: CAKE_TESTNET,
  busd: BUSD_TESTNET,
  syrup: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xfE1e507CeB712BDe086f3579d2c03248b2dB77f9',
    18,
    'SYRUP',
    'SyrupBar Token',
    'https://pancakeswap.finance/',
    'https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x009cF7bC57584b7998236eff51b98A168DceA9B0/logo.png'
  ),
  bake: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    18,
    'BAKE',
    'Bakeryswap Token',
    'https://www.bakeryswap.org/',
    'https://tokens.pancakeswap.finance/images/0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5.png'
  ),
  hbtc: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0x3Fb6a6C06c7486BD194BB99a078B89B9ECaF4c82',
    18,
    'HBTC',
    'Huobi BTC',
    '',
    'https://tokens.pancakeswap.finance/images/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png'
  ),
  wbtc: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0xfC8bFbe9644e1BC836b8821660593e7de711e564',
    8,
    'WBTC',
    'Wrapped BTC',
    '',
    'https://tokens.pancakeswap.finance/images/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png'
  ),
  usdc: new ERC20Token(
    ChainId.BSC_TESTNET,
    '0x2fB98DCc527c1403F92c6Bed05a50725d3005636',
    18,
    'USDC',
    'Binance-Peg USD Coin',
    '',
    'https://tokens.pancakeswap.finance/images/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d.png'
  ),
};
