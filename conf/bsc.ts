import { ethers } from 'ethers';

const bscUrls: string[] = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',

  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed2.defibit.io',
  'https://bsc-dataseed3.defibit.io',
  'https://bsc-dataseed4.defibit.io',

  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed2.ninicoin.io',
  'https://bsc-dataseed3.ninicoin.io',
  'https://bsc-dataseed4.ninicoin.io',
];

const bscTestUrls: string[] = ['https://bsctestapi.terminet.io/rpc'];

export const bscProvider = new ethers.providers.JsonRpcProvider(
  bscUrls[Math.floor(Math.random() * 13)],
  {
    name: 'bsc',
    chainId: 56,
  }
);

export const bscTestProvider = new ethers.providers.JsonRpcProvider(
  bscTestUrls[0],
  {
    name: 'bsc testnet',
    chainId: 97,
  }
);
