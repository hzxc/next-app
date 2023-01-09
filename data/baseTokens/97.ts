import { IToken } from '../../redux/pancake/pancakeSlice';

export const tokens97: IToken[] = [
  {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 97,
    decimals: 18,
    logoURI: '/images/pancake/bnb.svg',
  },
  {
    name: 'PancakeSwap Token',
    symbol: 'CAKE',
    address: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
    chainId: 97,
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
  },
  {
    name: 'BUSD Token',
    symbol: 'BUSD',
    address: '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
    chainId: 97,
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png',
  },
  {
    name: 'WBNB Token',
    symbol: 'WBNB',
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    chainId: 97,
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png',
  },
];

export const commonTokens97: Record<string, IToken> = {
  tbnb: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 97,
    decimals: 18,
    logoURI: '/images/pancake/bnb.svg',
  },
  wbnb: {
    name: 'WBNB Token',
    symbol: 'WBNB',
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    chainId: 97,
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png',
  },
  cake: {
    name: 'PancakeSwap Token',
    symbol: 'CAKE',
    address: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
    chainId: 97,
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
  },
  busd: {
    name: 'BUSD Token',
    symbol: 'BUSD',
    address: '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
    chainId: 97,
    decimals: 18,
    logoURI:
      'https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png',
  },
};
